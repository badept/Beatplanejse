# Dashboard với dữ liệu shop nguồn và nhân viên mô phỏng

## Dữ liệu và phạm vi

Dashboard sử dụng 26.219 shop từ file người dùng cung cấp, giữ mã nguồn, tên,
địa chỉ, tỉnh/thành, quận/huyện, xã/phường, tọa độ và thông tin SUP. Tên đơn vị
địa lý được giữ theo file, không tự đổi sang tên/ranh giới hành chính mới.
Vùng Bắc/Trung/Nam là nhóm hiển thị được cấu hình trong importer; dữ liệu chưa
phân loại có nhóm riêng. SUP được xác nhận lấy từ `manager_id` / `manager_code`.

- 39 SUP có mã hợp lệ; 418 shop chưa có mã hợp lệ vào nhóm Chưa phân SUP.
- 8.877 shop có tọa độ để hiển thị theo kiểm tra sơ bộ.
- 17.270 shop có tọa độ thiếu/0; không đặt điểm giả lên bản đồ.
- 72 shop nằm ngoài hộp tọa độ kiểm tra sơ bộ; giữ lại với trạng thái Cần kiểm tra.

Kiểm tra sơ bộ chỉ xác nhận giá trị số và hộp tọa độ tổng quan, không chứng minh
điểm nằm đúng địa chỉ hoặc đúng ranh giới Việt Nam. Các tọa độ gốc vẫn được giữ
trong `sourceLatitude` / `sourceLongitude` để đối chiếu, không sửa file Excel.
Không đưa ảnh, tên liên hệ hoặc các cột không phục vụ giám sát vào bộ dữ liệu web.
`sourceStatus` được giữ riêng; không coi đó là trạng thái lượt ghé.

## Phân công 900 nhân viên mẫu

Mỗi shop thuộc đúng một danh mục nhân viên. Nhân viên và shop trong cùng danh
mục thuộc cùng SUP và tỉnh/thành. Danh mục được chia theo quận/huyện và vị trí
để hạn chế phân công ngẫu nhiên xuyên vùng. Đây không phải tối ưu tuyến đường.

Phân bổ số nhân viên theo số shop của từng nhóm, đủ đúng 900 người. Với cùng
bộ dữ liệu, mã/tên và trạng thái mô phỏng ổn định khi tải lại. Ngày 19/11 chốt
ảnh dữ liệu lúc 10:30: 540 người đang làm ca 08–17, 225 đã kết ca sớm 06–10,
45 có lịch nhưng vắng, 90 nghỉ. Ngày 17–18/11 chốt lúc 17:30: 765 đã kết ca,
45 vắng và 90 nghỉ. Mỗi ngày có 810 người có lịch; phân bố bằng seed cố định.

Danh mục phụ trách khác lộ trình ngày: mỗi lộ trình có tối đa 3–6 shop, hoặc ít
hơn nếu danh mục không đủ điểm phù hợp. Ưu tiên các shop có tọa độ trong danh mục;
nếu không có, lộ trình vẫn hiển thị các shop chưa có vị trí. Nhân viên nghỉ
không có tuyến; nhân viên vắng vẫn có kế hoạch nhưng không phát sinh lượt ghé.
Tuyến có thời gian di chuyển giữa hai điểm và không xếp vượt ca. Vị trí nhân viên là
mô phỏng tại shop trong lộ trình, không phải GPS thật; nhân viên chưa làm hoặc
không có shop định vị được sẽ không có marker vị trí cá nhân.

Ba ngày mẫu 17–19/11/2026 được giữ riêng. Trạng thái lượt ghé, thời gian, số bán,
tồn kho và doanh thu đều là mô phỏng. Website không có check-in/gửi đánh giá.

## Khoảng cách giữa các điểm dừng

Khoảng cách đặt ngay sau thẻ shop A, trên đường nối dọc trước thẻ shop B.
Số hiển thị tính theo Haversine từ tọa độ hai điểm liên tiếp trong đúng thứ tự
lộ trình; hiển thị ~ số km. Không dùng giá trị 50 km
cố định, không coi đường nối này là quãng đường đường bộ.

- Thiếu tọa độ ở một đầu: ghi Chưa có tọa độ, không thay bằng 0 km.
- Hai shop có cùng tọa độ hợp lệ: có thể hiển thị ~ 0 km.
- Tổng đầy đủ khi mọi chặng tính được; nếu thiếu chặng, chỉ ghi tổng đoạn có tọa độ.
- Không tính được chặng nào: ghi Chưa đủ tọa độ để tính khoảng cách.
- Trên map, không nối xuyên qua điểm thiếu tọa độ để tạo một chặng giả.

## Tổ chức mã nguồn và hiệu năng

| File | Vai trò |
| --- | --- |
| `scripts/import-shops.py` | Đọc XLSX, kiểm tra khóa/cột, chọn trường cần dùng, xuất JSON |
| `assets/data/shops.json` | Dữ liệu đã chuẩn hóa, khoảng 9,6 MB; không phải backend |
| `assets/js/dashboard-model.js` | Phân công NV, tạo snapshot, chỉ mục, Haversine và engine lọc |
| `assets/js/dashboard-data.js` | Nạp dữ liệu qua HTTP, quản lý vòng đời Web Worker và fallback |
| `assets/js/dashboard-data-worker.js` | Lọc vùng/tỉnh/SUP/NV/trạng thái/tọa độ/tìm kiếm ngoài luồng UI |
| `assets/js/dashboard.js` | Cột thông tin, phân trang 50 hàng, báo cáo và lộ trình |
| `assets/js/map-provider.js` | Chỉ tạo marker có vị trí, tạo theo đợt 350 điểm, hủy đợt cũ khi lọc |
| `tests/dashboard-data.test.cjs` | Kiểm tra phân bổ, quan hệ, trạng thái, bộ lọc và khoảng cách |

Lọc dùng chỉ mục tên/mã đã chuẩn hóa và Map theo ID. UI chỉ dựng 50 hàng của
trang hiện tại, mặc định xen kẽ nhân viên/shop. Khi chỉ chọn đối tượng hoặc mở
báo cáo, giữ tập marker thay vì dựng lại hàng nghìn marker. Không bật animation
gom cụm; timer tạo marker cũ bị hủy nếu bộ lọc mới đến. Web Worker được kết thúc
khi đổi snapshot, kết quả lọc cũ không ghi đè bộ lọc mới.

Nếu Web Worker không hoạt động, bộ lọc dùng cùng engine trên luồng chính;
trường hợp này có thể kém mượt hơn. Nền đường phố vẫn phụ thuộc mạng; nền địa lý
đóng gói sẵn hỗ trợ xem điểm và báo cáo khi tile không tải được.

## Chạy và cập nhật nguồn

Chạy `node serve.cjs`, sau đó mở `http://127.0.0.1:8080/dashboard.html`.
Bản dữ liệu lớn bắt buộc dùng HTTP; mở trực tiếp `file://` sẽ có hướng dẫn lỗi.
Các trang mockup cũ vẫn mở như trước. Không cần npm install hoặc build.

Importer dùng Python và `openpyxl`, chỉ cần khi thay bộ dữ liệu nguồn:

```powershell
python scripts/import-shops.py "D:\Downloads\download_shop_2026111941719PM.xlsx"
node --test tests/dashboard-data.test.cjs
```

Nếu Excel thay đổi ID hoặc cấu trúc, importer dừng khi thiếu cột/ID hoặc trùng
shop_id. Khi thêm tỉnh/thành không có trong cấu hình, dữ liệu vào Chưa xác định
vùng để đối chiếu. Không đổi dữ liệu thật bằng tọa độ mô phỏng.

## Kiểm chứng

Mười nhóm kiểm thử dữ liệu xác minh số lượng nguồn/SUP, phân công đủ 900 người,
không trùng danh mục, trạng thái của ba ngày, khoảng cách Haversine, bộ lọc và
các trường hợp thiếu tọa độ. Kiểm thử trình duyệt sử dụng toàn bộ 26.219 shop,
kiểm tra Worker thật, phân trang, chọn SUP/NV, timeline dọc, báo cáo chỉ theo
lượt ghé trong khoảng ngày, shop cần kiểm tra, nhóm chưa phân SUP, đổi ngày và màn hình nhỏ.

Thời gian đo là phép đo cục bộ trên máy kiểm tra, không phải cam kết hiệu năng
cho mọi thiết bị hoặc cho môi trường vận hành có backend/API thật.

## Plan ngày và Actual ATD

Plan ngày đếm mỗi nhân viên có `schedule.isScheduled` trong ngày được chọn là
1 công. Actual ATD đếm mỗi nhân viên có đủ `attendance.inAt` và `attendance.outAt`
hợp lệ, OUT sau IN, thuộc `attendance.date` được chọn là 1 công. Chỉ có IN chưa
được tính ATD; không tính theo số shop hoặc lượt ghé. Ca qua đêm thuộc ngày công
được gán trong `attendance.date`.

Các chỉ số theo tập nhân viên sau bộ lọc, bao gồm SUP. Báo cáo một shop dùng
nhân viên phụ trách shop đó, không nhân số công theo số shop. Dữ liệu mô phỏng
hiện có Plan 810 mỗi ngày, Actual ATD 765 vào 17–18/11 và 225 vào 19/11;
chưa kết nối nguồn
lịch làm việc/chấm công thật. Lịch là nguồn tính Plan, lộ trình không thay thế lịch.

Nhãn “Nạp dữ liệu” là thời điểm trình duyệt nạp dữ liệu thành công, không phải
thời điểm cập nhật tại hệ thống nguồn. Đổi bộ lọc không thay đổi thời điểm này.

## Lịch sử ghé và lọc nhanh

Phiếu shop dùng một giao diện khoảng ngày, mặc định Từ ngày và Đến ngày đều
là hôm nay theo múi giờ Việt Nam. Không có tab chuyển chế độ. Lịch sử lấy các lượt có
`report.visits > 0` trong ba ngày mẫu, mới nhất trước; mỗi lượt ghi nhân viên
và SUP của snapshot ngày đó. Số liệu thu gọn mặc định, mở từng lượt để đọc.
KPI chi tiết và danh sách lượt ghé cùng theo khoảng ngày ở đầu báo cáo.
Bộ dữ liệu hiện mô phỏng tối đa một lượt/shop/ngày;
khi nối API cần cung cấp từng visit ID và nhân viên thực hiện tại thời điểm ghé.

Nút trạng thái dưới bản đồ dùng chung bộ lọc với danh sách/báo cáo, kết hợp
ngày, vùng, địa điểm, SUP, nhân viên, tìm kiếm và điều kiện tọa độ. Số cạnh nút
là số shop trong phạm vi này trước khi áp dụng trạng thái. Nút đối tượng chọn
nhân viên/cửa hàng/tất cả trên bản đồ và danh sách.

Ô tìm tên/mã NV và cửa hàng ngay trên danh sách hỗ trợ không dấu, chỉ thu hẹp
danh sách trong phạm vi bộ lọc hiện có; không đổi KPI hoặc marker. Khi tìm một
nhóm, danh sách tạm chỉ hiển thị nhóm đó; nhập cả hai ô trả kết quả tương ứng
của cả hai nhóm. Xóa từ khóa khôi phục danh sách. Chọn lớp Nhân viên/Cửa hàng
chỉ hiện và áp dụng ô tìm của nhóm đó; Tất cả hiện cả hai. Phân trang và các
ô tìm nằm trong một khối ghim khi cuộn cột phải. Nhập từ khóa về trang đầu.
Các ô tìm mặc định thu gọn sau nút “Tìm trong danh sách”. Bấm mở/đóng không
xóa từ khóa hay thay kết quả; nút hiện “Đang lọc” khi có từ khóa đang áp dụng.
Lịch sử có khoảng Từ ngày–Đến ngày (bao gồm cả hai đầu), không nhận khoảng đảo
ngược. Ngày chưa có dữ liệu hiện trống, không tự lấy ngày mẫu thay thế.
Thanh lọc trạng thái giữ chấm màu cùng số lượng và trạng thái chọn.

## Giờ và ảnh IN/OUT tại cửa hàng

Mỗi shop trong snapshot có `visit: { inAt, outAt, inPhoto, outPhoto }` dành cho
lượt ghé ngày đó, độc lập với `employee.attendance` tính Actual ATD. Lượt chưa
ghé có giờ null; lượt đang làm có IN, chưa OUT; lượt kết thúc có OUT sau IN.
Giờ là dữ liệu mô phỏng, hiển thị theo múi giờ Việt Nam. Thời gian tại CH tính
từ OUT trừ IN, không suy từ chấm công ngày.

Hiện `inPhoto` và `outPhoto` đều null nên hiện khung Chưa có ảnh. Khi có URL
HTTP/HTTPS hợp lệ, hiển thị ảnh và cho xem lớn bằng hộp thoại; ảnh tải lỗi có
khung thông báo thay thế. Chưa có luồng tải ảnh lên hay API lưu ảnh.

## Xem riêng khoảng cách giữa hai shop

Bấm khoảng cách giữa hai điểm liền kề để bản đồ chỉ hiện hai shop A/B, tên
và đoạn nối, tự zoom vừa hai điểm. Các điểm không gom cụm trong chế độ này.
Nút “Về toàn bộ lộ trình” khôi phục lớp điểm đang lọc và zoom theo lộ trình.
Rời chi tiết cũng thoát chế độ xem riêng. Đoạn thiếu tọa độ không có nút;
khoảng cách vẫn tính theo đường thẳng Haversine.

## Khoảng ngày tổng quan báo cáo

Tổng quan có Từ ngày–Đến ngày riêng, mặc định cùng ngày làm việc đang chọn;
đổi ngày làm việc hoặc đặt lại bộ lọc sẽ đưa khoảng về ngày đó. Các điều kiện
vùng, địa điểm, SUP, nhân viên, trạng thái, tìm kiếm và tọa độ được áp dụng
riêng trên từng snapshot trong khoảng (bao gồm hai đầu).
Riêng Plan/ATD không bị thu hẹp bởi trạng thái hoặc tọa độ shop: hai điều kiện
này chỉ lọc số liệu shop. Nhờ đó lọc Đang làm không làm giảm mẫu số nhân viên.

Plan và Actual ATD cộng theo công/người/ngày; số bán và doanh thu cộng theo
ngày. Bảng địa điểm cộng công, đếm shop duy nhất trong khoảng. Tồn kho cuối kỳ
chỉ lấy đúng ngày kết thúc; nếu ngày đó không có dữ liệu hiển thị “—”, không
lấy ngày trước thay thế. Khoảng hoàn toàn không có dữ liệu hiển thị các tổng
bằng 0 và thông báo không có dữ liệu. Khoảng đảo ngược không được áp dụng.

## Quy tắc sổ dữ liệu và số đối chiếu

Tồn cuối = tồn đầu + nhập − bán; tồn đầu ngày sau bằng tồn cuối ngày trước.
Khi tồn đầu dưới 70 bao, dữ liệu giả lập nhập thêm 100 bao. Giá ổn định theo
shop. Chỉ lượt hoàn tất thành công có số bán và doanh thu; đang ghé, chưa ghé,
không thành công đều chưa ghi doanh thu. Giờ ghé nằm trong ca và trước mốc
dữ liệu; các lượt của cùng NV không chồng nhau. Dữ liệu được tái lập từ seed,
cache nội bộ không bị sửa qua snapshot trả về.

| Ngày | Mốc dữ liệu | Plan | Actual ATD | Đã bán (bao) | Doanh thu (đồng) | Tồn (bao) |
|---|---|---:|---:|---:|---:|---:|
| 17/11/2026 | 17:30 | 810 | 765 | 80.546 | 2.002.550.000 | 4.113.158 |
| 18/11/2026 | 17:30 | 810 | 765 | 82.094 | 2.057.114.000 | 4.036.364 |
| 19/11/2026 | 10:30 | 810 | 225 | 71.345 | 1.779.266.000 | 3.992.019 |

Khoảng 17–19/11: Plan 2.430, Actual ATD 1.755, bán 233.985 bao,
doanh thu 5.838.930.000 đồng; tồn lấy đúng 19/11 là 3.992.019 bao.
Tổng các SUP (kể cả nhóm chưa phân SUP) bằng toàn quốc. Báo cáo NV/cửa hàng
dùng cùng hàm `summarizeReport`, cùng khoảng ngày với chi tiết lượt ghé; tồn
NV là tồn toàn danh mục phụ trách, không chỉ các shop đã ghé. Phân công shop
nguồn và 900 nhân viên vẫn giữ nguyên. Chạy đối soát bằng:

```powershell
node --test tests/dashboard-data.test.cjs
```
