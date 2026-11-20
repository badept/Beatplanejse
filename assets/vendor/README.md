# Thư viện bản đồ được đóng gói tại chỗ

Chỉ `dashboard.html` nạp các thư viện này. Các trang mockup cũ không thay đổi.

| Thư viện | Phiên bản | Nguồn | Giấy phép |
| --- | --- | --- | --- |
| Leaflet | 1.9.4 | https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/ | BSD 2-Clause, xem `LEAFLET-LICENSE.txt` |
| Leaflet.markercluster | 1.5.3 | https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/ | MIT, xem `MARKERCLUSTER-LICENSE.txt` |

Không chỉnh trực tiếp các file vendor. Khi nâng phiên bản, tải lại đúng bộ
JS/CSS, giữ thông báo bản quyền và kiểm tra adapter `assets/js/map-provider.js`.
Dashboard dùng `L.divIcon`, không phụ thuộc bộ ảnh marker mặc định của Leaflet.

Nền đường phố được tải khi xem bản đồ từ OpenStreetMap; nguồn và ghi công
được giữ trên bản đồ. Không có chức năng tải trước hoặc tải bản đồ offline.
URL tile được cấu hình tập trung trong `map-provider.js` để có thể đổi nhà cung cấp.
Xem https://operations.osmfoundation.org/policies/tiles/ trước khi đưa vào vận hành.

Nền tổng quan dự phòng `dashboard-geography.js` lấy từ Natural Earth qua
world-atlas 2.0.2 (https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json).
Đây là hình học tổng quan public domain, không phải nền đường phố hoặc
dữ liệu ranh giới hành chính chính thức.
