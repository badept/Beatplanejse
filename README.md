# Beatplane Map Demo

Demo giao diện theo dõi nhân viên và cửa hàng trên bản đồ, viết bằng HTML, CSS và JavaScript thuần.

## Chạy dự án

1. Mở thư mục dự án bằng VS Code.
2. Mở `01-map-overview.html`.
3. Chọn **Open with Live Server**, hoặc mở trực tiếp file bằng trình duyệt.

Giữ nguyên cấu trúc thư mục vì các trang dùng chung tài nguyên trong `assets/`.

## Màn hình chính

`01-map-overview.html` là trang **Tổng quan bản đồ**. Trang này gồm:

- Bản đồ khu vực và vị trí nhân viên/cửa hàng.
- Bộ lọc, làm mới bản đồ và xác định vị trí hiện tại.
- Thông tin nhanh khi chọn nhân viên hoặc cửa hàng.
- Lộ trình ghé cửa hàng trong ngày và nhóm cửa hàng gần nhau.

Đây là điểm bắt đầu phù hợp nhất để xem và điều hướng sang các màn hình khác.

## Danh sách file

| File | Chức năng |
| --- | --- |
| `index.html` | Trang danh mục/liên kết đến toàn bộ màn hình demo. |
| `01-map-overview.html` | Tổng quan bản đồ, nhân viên, cửa hàng và lộ trình. |
| `02-employee-route.html` | Xem lộ trình làm việc của một nhân viên. |
| `03-working-employees.html` | Danh sách nhân viên đang làm việc (IN). |
| `04-store-detail.html` | Thông tin chi tiết một cửa hàng. |
| `05-location-status.html` | Danh sách nhân viên đã hoàn thành vị trí/công việc. |
| `06-filters.html` | Bộ lọc dữ liệu hiển thị trên bản đồ. |
| `07-idle-employees.html` | Danh sách nhân viên chưa bắt đầu làm việc. |
| `08-sup-checkin.html` | Check-in và thông tin ca làm của SUP. |
| `09-sa-evaluation.html` | Màn hình đánh giá SA. |
| `10-store-report.html` | Chọn nhân viên và xem báo cáo cửa hàng. |
| `11-employee-daily-report.html` | Báo cáo ngày: cửa hàng, bán hàng và tồn kho. |
| `12-completed-stores.html` | Danh sách cửa hàng đã hoàn thành. |
| `13-report-activity-detail.html` | Chi tiết một phiếu báo cáo. |

## Tài nguyên dùng chung

- `assets/css/styles.css`: toàn bộ giao diện và bố cục.
- `assets/js/app.js`: xử lý điều hướng, thao tác và hiển thị dữ liệu demo.
- `assets/images/`: bản đồ, biểu tượng và ảnh đại diện.

