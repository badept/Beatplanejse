"""Read-only XLSX import. Whitelist shop fields; never execute workbook content.
Usage: python scripts/import-shops.py input.xlsx
Requires openpyxl. The input file is never changed.
"""
import argparse
import base64
import json
import math
from collections import Counter
from pathlib import Path
import unicodedata
import openpyxl


def normalize(value):
    return "".join(c for c in unicodedata.normalize("NFD", str(value or "")) if unicodedata.category(c) != "Mn").replace("đ", "d").replace("Đ", "D").lower().strip()


GROUPS = {
    "north": "Hà Nội|Hải Phòng|Bắc Ninh|Quảng Ninh|Hải Dương|Vĩnh Phúc|Hưng Yên|Thái Nguyên|Bắc Giang|Phú Thọ|Nam Định|Ninh Bình|Thái Bình|Hà Nam|Hòa Bình|Sơn La|Điện Biên|Lào Cai|Yên Bái|Tuyên Quang|Hà Giang|Cao Bằng|Bắc Kạn|Lạng Sơn|Lai Châu",
    "central": "Thanh Hóa|Nghệ An|Hà Tĩnh|Quảng Bình|Quảng Trị|Thừa Thiên Huế|Huế|Đà Nẵng|Quảng Nam|Quảng Ngãi|Bình Định|Phú Yên|Khánh Hòa|Ninh Thuận|Bình Thuận|Kon Tum|Gia Lai|Đắk Lắk|Đắk Nông|Lâm Đồng",
    "south": "Hồ Chí Minh|TP. Hồ Chí Minh|Thành phố Hồ Chí Minh|Bình Dương|Bình Phước|Đồng Nai|Tây Ninh|Bà Rịa - Vũng Tàu|Long An|Tiền Giang|Bến Tre|Trà Vinh|Vĩnh Long|Đồng Tháp|An Giang|Kiên Giang|Cần Thơ|Hậu Giang|Sóc Trăng|Bạc Liêu|Cà Mau",
}
REGION_BY_NAME = {normalize(name): region for region, names in GROUPS.items() for name in names.split("|")}


def key(prefix, value):
    return prefix + base64.urlsafe_b64encode(str(value).encode("utf-8")).decode("ascii").rstrip("=")


def parse_coordinate(lat, lng):
    try:
        lat, lng = float(lat), float(lng)
    except (ValueError, TypeError):
        return None, None, "missing"
    if not math.isfinite(lat) or not math.isfinite(lng):
        return None, None, "invalid"
    if lat == 0 or lng == 0:
        return None, None, "missing"
    if not (8 <= lat <= 24.5 and 102 <= lng <= 110.8):
        return None, None, "review"
    return lat, lng, "available"


def convert(source, destination):
    book = openpyxl.load_workbook(source, read_only=True, data_only=True)
    sheet = book["data"] if "data" in book.sheetnames else book.worksheets[0]
    rows = sheet.iter_rows(values_only=True)
    headers = list(next(rows))
    required = {"shop_id", "shop_code", "shop_name", "province_name", "latitude", "longitude"}
    if not required.issubset(headers):
        raise ValueError("Missing columns: " + ", ".join(sorted(required - set(headers))))
    cities, supervisors, stores, ids = {}, {}, [], set()
    quality = Counter()
    for values in rows:
        if not any(value is not None for value in values):
            continue
        row = dict(zip(headers, values))
        text = lambda field: str(row.get(field) or "").strip()
        source_id = text("shop_id")
        if not source_id or source_id in ids:
            raise ValueError("Missing or duplicated shop_id at input row " + str(len(stores) + 2))
        ids.add(source_id)
        city_name = text("province_name") or "Chưa có tỉnh/thành"
        city_id = key("P-", row.get("province_id") or city_name)
        region = REGION_BY_NAME.get(normalize(city_name), "unassigned")
        cities[city_id] = {"id": city_id, "name": city_name, "region": region}
        manager = text("manager_id")
        sup_id = key("M-", manager) if manager not in ("", "0", "-1") else "unassigned"
        supervisor_name = text("manager_code") or ("Mã " + manager if sup_id != "unassigned" else "Chưa phân SUP")
        supervisors[sup_id] = {"id": sup_id, "name": supervisor_name, "sourceManagerId": manager, "regions": [], "cityIds": []}
        lat, lng, location_status = parse_coordinate(row.get("latitude"), row.get("longitude"))
        quality[location_status] += 1
        raw_lat, raw_lng = row.get("latitude"), row.get("longitude")
        raw_value = lambda value: value if isinstance(value, (str, int, float)) and not isinstance(value, bool) and (not isinstance(value, float) or math.isfinite(value)) else None
        stores.append({"id": key("CH-", source_id), "sourceId": source_id, "code": text("shop_code"), "name": text("shop_name") or text("shop_code"), "address": text("shop_address"), "cityId": city_id, "city": city_name, "district": text("district_name"), "ward": text("ward_name"), "region": region, "supervisorId": sup_id, "lat": lat, "lng": lng, "locationStatus": location_status, "sourceLatitude": raw_value(raw_lat), "sourceLongitude": raw_value(raw_lng), "sourceStatus": text("status")})
    book.close()
    for store in stores:
        sup = supervisors[store["supervisorId"]]
        if store["region"] not in sup["regions"]:
            sup["regions"].append(store["region"])
        if store["cityId"] not in sup["cityIds"]:
            sup["cityIds"].append(store["cityId"])
    output = {"schemaVersion": 1, "source": source.name, "supervisorMapping": "manager-is-sup-confirmed", "quality": dict(quality), "cities": list(cities.values()), "supervisors": list(supervisors.values()), "stores": stores}
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":"), allow_nan=False), encoding="utf-8")
    print(json.dumps({"stores": len(stores), "cities": len(cities), "managerGroups": len(supervisors), "quality": dict(quality), "bytes": destination.stat().st_size}, ensure_ascii=True))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "assets/data/shops.json")
    args = parser.parse_args()
    if args.source.resolve() == args.output.resolve():
        raise ValueError("Output must differ from input")
    convert(args.source, args.output)
