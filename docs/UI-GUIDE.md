# Hướng dẫn chỉnh giao diện

## Dashboard website giám sát

`dashboard.html` là trang desktop mới, độc lập với CSS/JavaScript của bộ mockup
điện thoại. Không nạp `styles.css` hoặc `app.js` cũ vào trang này.

| File | Trách nhiệm |
| --- | --- |
| `assets/css/pages/dashboard.css` | Khung desktop/mobile, bộ lọc, bảng bên phải, marker và cluster |
| `assets/js/dashboard-data.js` | Nạp JSON nguồn qua HTTP và quản lý Web Worker |
| `assets/js/dashboard-model.js` | 900 NV mô phỏng, snapshot, chỉ mục lọc và khoảng cách Haversine |
| `assets/js/dashboard-data-worker.js` | Lọc dữ liệu ngoài luồng giao diện |
| `assets/data/shops.json` | 26.219 shop đã chuẩn hóa từ file nguồn |
| `assets/js/dashboard-geography.js` | Nền quốc gia tổng quan dự phòng, dữ liệu Natural Earth qua world-atlas |
| `assets/js/map-provider.js` | Khởi tạo Leaflet, tile, cluster, focus, đường nối lộ trình và phát hiện lỗi tile |
| `assets/js/dashboard.js` | Bộ lọc dùng chung, chọn đối tượng, danh sách, chi tiết và báo cáo chỉ đọc |
| `assets/vendor/` | Thư viện bản đồ cố định phiên bản, thông báo bản quyền và giấy phép |
| `serve.cjs` | HTTP preview cục bộ, không dependency |
| `tests/dashboard-data.test.cjs` | Kiểm tra phân bố dữ liệu, ID, quan hệ nhân viên/cửa hàng và snapshot |

Các script nạp theo thứ tự: Leaflet → markercluster → model → data loader → địa lý →
adapter map → dashboard. Namespace riêng là `window.ViewMapDashboard`.
`getSnapshot(date)` trả bản sao dữ liệu cho các ngày 17–19/11/2026.

Luồng: bộ lọc → `refresh()` → Web Worker → cùng tập cửa hàng/nhân viên cho số đếm,
danh sách, marker và báo cáo tổng hợp. Tab Tất cả/Nhân viên/Cửa hàng chỉ chọn
lớp đối tượng hiển thị; các chỉ số trên cùng vẫn mô tả tập dữ liệu trong bộ lọc.
Lọc trạng thái cửa hàng giữ lại các nhân viên phụ trách cửa hàng khớp.
Tìm tên nhân viên sẽ kèm danh mục shop phụ trách; tìm mã cửa hàng sẽ kèm chủ quản.

Chọn marker hoặc hàng danh sách đi qua `select(type, id)`, mở chi tiết và
focus bản đồ. Nhân viên có lộ trình nối tọa độ; báo cáo chỉ hiển thị số liệu mẫu.
Khi đi từ lộ trình tới cửa hàng đang nằm ngoài tìm kiếm/trạng thái, dashboard
xóa điều kiện tìm kiếm/trạng thái/tọa độ/NV để đối tượng được chọn có trong tập dữ liệu.
Shop chỉ có mặt trên bản đồ nếu có tọa độ hợp lệ.

Các hook chính: `#dashboard-map`, `#dashboard-filters`, `#search-query`,
`#region-filter`, `#city-filter`, `#sup-filter`, `#employee-filter`,
`#location-filter`, `#date-filter`, `#status-filter`,
`#overview-panel`, `#detail-panel`, `#object-list`, `#summary-grid`;
thuộc tính `data-object`, `data-nav`, `data-select-type`, `data-select-id`,
`data-action`, `data-scope-city`. Khi đổi tên phải đổi selector tương ứng.

Xem [DASHBOARD-DATA.md](DASHBOARD-DATA.md) để sửa cách nhập nguồn, chia vùng/SUP,
phân trang, Worker và đường nối dọc hiển thị khoảng cách giữa các thẻ shop.

Nguồn file và dữ liệu mô phỏng không phải API. Muốn nối backend, thay lớp snapshot bằng dữ liệu
đã xác minh có ID, tọa độ, trạng thái, ngày, route và báo cáo; giữ adapter map
tách biệt. Không biến website thành nơi check-in/gửi đánh giá trong phạm vi này.

## 1. Chọn đúng lớp cần sửa

| Mục đích | File nên bắt đầu |
| --- | --- |
| Màu nền tảng, font, reset | `assets/css/base.css` |
| Khung ứng dụng đang hiển thị, chiều cao header/nội dung | `assets/css/layout-preview.css` |
| Cấu trúc khung, thanh tiêu đề, toolbar | `assets/css/layout.css` |
| Button, badge, avatar, card, ô tìm kiếm, sheet | `assets/css/components.css` |
| Thông báo dạng khối / toast | `assets/css/notices.css` / `assets/css/feedback.css` |
| Modal nhân viên, cửa hàng và hiệu ứng lớp phủ | `assets/css/modals.css` |
| Thay đổi theo kích thước màn hình | `assets/css/responsive.css` |
| Đổi icon đang chạy trong trang | `assets/js/icons.js` |
| Đổi dữ liệu mẫu được JavaScript sinh ra | `assets/js/demo-data.js` |

Các biến hiện có trong `:root`: `--green`, `--lime`, `--ink`, `--muted`,
`--line`, `--blue`, `--amber`. Nhiều quy tắc cũ vẫn dùng màu trực tiếp;
đổi một biến chưa đảm bảo đổi toàn bộ giao diện. Khi chuẩn hóa palette cần
đối chiếu các giá trị màu trong file của màn hình liên quan.

## 2. Bản đồ màn hình và code

Các đường dẫn trong bảng tính từ thư mục gốc của ứng dụng.

| HTML | CSS trong `assets/css/` | JavaScript trong `assets/js/` |
| --- | --- | --- |
| `index.html` | `pages/gallery.css`, `responsive.css` | Không nạp JavaScript |
| `01-map-overview.html` | `pages/map.css`, `pages/map-overview.css`, `pages/map-interactions.css`, `modals.css` | `map.js`, `modals.js` |
| `02-employee-route.html` | `pages/map.css`, `components.css` | `core.js` |
| `03-working-employees.html` | `pages/employees.css`, `components.css`, `modals.css` | `employees.js`, `modals.js` |
| `04-store-detail.html` | `pages/store.css`, `modals.css` | `stores.js`, `modals.js` |
| `05-location-status.html` | `pages/employees.css` | `employees.js`, `stores.js` |
| `06-filters.html` | `pages/filters.css` | `filters.js` |
| `07-idle-employees.html` | `pages/employees.css` | `employees.js` |
| `08-sup-checkin.html` | `pages/checkin.css` | `checkin.js`, `core.js` |
| `09-sa-evaluation.html` | `pages/evaluation.css`, `pages/checkin.css` | `evaluation.js`, `core.js` |
| `10-store-report.html` | `pages/reports.css`, `pages/checkin.css` | `reports.js` |
| `11-employee-daily-report.html` | `pages/reports.css`, `pages/checkin.css` | Nội dung HTML tĩnh, sự kiện chung |
| `12-completed-stores.html` | `pages/employees.css` | `stores.js` |
| `13-report-activity-detail.html` | `pages/reports.css`, `pages/checkin.css` | `reports.js` |

Mọi trang chức năng còn sử dụng các lớp nền tảng, layout và component dùng chung.
`pages/checkin.css` giữ các quy tắc chung của `.checkin-page`, `.evaluation-page`,
`.report-page`, `.checkin-store`, `.evaluation-store`, `.report-store` và tiêu đề
section; các quy tắc này vốn đứng trước phần riêng của đánh giá/báo cáo.

## 3. Thứ tự CSS và các lớp ghi đè

Chỉ nạp `assets/css/styles.css` từ HTML. File này import các phần theo thứ tự
cũ: nền tảng → layout → bản đồ cơ bản → component → cửa hàng → nhân viên →
thông báo → bộ lọc → check-in → đánh giá → báo cáo → toast → gallery → bản đồ
tổng quan → responsive → khung preview → modal → tương tác bản đồ.

Không đảo thứ tự import hoặc dùng `@layer` trong lúc sửa một màn hình: điều
này có thể thay đổi ưu tiên của cả ứng dụng. Quy tắc responsive nằm trước
một số quy tắc preview vì đó là thứ tự đang có, không phải do thiếu breakpoint.

Những điểm dễ sửa nhầm:

- `.phone` trong `layout.css` mô tả khung điện thoại cũ; khung chữ nhật hiện
  tại được ghi đè bởi `.app-screen .phone` và `.overview-page .phone` trong
  `layout-preview.css`.
- `.statusbar` vẫn có trong HTML nhưng bị ẩn trong chế độ preview.
- Vị trí marker của trang tổng quan được chốt ở phần cuối
  `pages/map-interactions.css`, ghi đè tọa độ cơ bản ở các phần trước.
- CSS clustering vẫn tồn tại, nhưng trang tổng quan ghi đè để cửa hàng luôn
  có thể chọn ở mức zoom rộng; đừng xóa nhánh này vì nhìn thấy selector lặp.
- Giữ đường dẫn ảnh đúng theo nơi đặt stylesheet: CSS trong `pages/` dùng
  `../../images/`, CSS ngay trong `css/` dùng `../images/`.
- `.route-map-full` và `.employee-name` trong `styles.css` thay hai inline
  style cũ; giữ chúng khi thay đổi entry CSS.

Khi sửa, ưu tiên chỉnh rule đang quyết định kết quả trong đúng file chức năng;
tránh thêm một lớp override mới ở cuối chỉ để đè rule cũ.

## 4. Hợp đồng DOM cần giữ khi chỉnh HTML

JavaScript dùng cả `data-*`, class và ID để tìm phần tử. Có thể thêm class để
trang trí, nhưng đổi/xóa các hook sau cần kiểm tra lại code xử lý.

| Hook | Vai trò |
| --- | --- |
| `.phone`, `.map`, `.overview`, `.overview-content` | Giới hạn phạm vi bản đồ, modal và trạng thái |
| `data-href`, `data-back` | Điều hướng bằng click; `data-href` hỗ trợ Enter/Space |
| `data-action`, `data-message`, `.toast` | Hiển thị thông báo mô phỏng |
| `data-modal-target`, `data-modal-close` | Chọn modal để mở/đóng |
| `.map-info-modal`, `.map-info-card`, `.modal-close` | Trạng thái modal và trả focus |
| `data-name`, `data-store`, `data-gps`, `data-avatar`, `data-status`, `data-status-class` | Dữ liệu đưa vào modal nhân viên |
| `data-store-name`, `data-store-code`, `data-store-address`, `data-store-distance` | Dữ liệu đưa vào modal cửa hàng |
| `data-area`, `data-focus`, `data-store-id` | Liên kết khu vực và marker |
| `data-zoom`, `data-map-zoom`, `data-map-locate` | Zoom và định vị mô phỏng |
| `data-map-status-filter`, `data-visit-status` | Lọc trạng thái cửa hàng |
| `data-store-cluster`, `data-cluster-store` | Mở danh sách cụm và chọn cửa hàng |
| `data-route-list`, `.route-list` | Cuộn tới danh sách lộ trình |
| `data-employee-card`, `data-employee-name`, `data-employee-store` | Nguồn tìm kiếm nhân viên |
| `data-employee-search`, `data-employee-count`, `.out-empty` | Tìm kiếm, số kết quả và trạng thái trống |
| `.working-list-body .employee-list` | Khởi tạo danh sách nhân viên đang làm |
| `data-filter-form`, `data-reset-filters`, `data-apply-filters` | Điều khiển form bộ lọc |
| `data-filter-options`, thuộc tính `name` của input | Gợi ý lựa chọn và tên tham số URL |
| `.switch`, `.on` | Trạng thái bật/tắt |
| `.checkin-tabs button`, `.active` | Tab chấm công |
| `.rating-stars button`, `.selected` | Chọn mức đánh giá |
| `data-report-form`, `data-report-employee`, `data-view-store-report` | Chọn nhân viên xem báo cáo |
| `data-report-context`, `data-report-results`, `data-report-empty`, `data-change-report` | Chuyển giữa form và kết quả |
| `data-report-employee-name`, `data-activity-detail` | Vùng nội dung báo cáo động |
| `.completed-card`, `.completed-total-link`, `.completed-stores-page` | Danh sách hoàn thành |
| `.store-panel`, `.store-title`, `.info-line`, `.subheading`, `.employee` | Cập nhật chi tiết cửa hàng |
| `data-store-employee-report` | Liên kết báo cáo nhân viên hoàn thành |

Các ID `employee-modal-name`, `employee-modal-store`, `employee-modal-gps`,
`employee-modal-route-store`, `employee-modal-avatar`, `employee-modal-status`,
`store-modal-name`, `store-modal-code`, `store-modal-address`,
`store-modal-distance`, `cluster-store-list`, `cluster-store-items`,
`cluster-list-title` là đích cập nhật DOM. Nếu đổi tên, phải đổi selector trong
`modals.js` tương ứng và các thuộc tính ARIA trỏ tới ID đó.

Giữ các class trạng thái như `.is-open`, `.modal-active`, `.detail-sheet-open`,
`.employee-sheet-open`, `.map-focus-active`, `.is-focused-marker`,
`.is-status-filtered-out`, `.zoom-clustered`, `.is-panning`: JavaScript và CSS
cùng dùng chúng. Đừng đặt nội dung trang trí mới vào phần tử có `textContent`
hoặc `innerHTML` được cập nhật nếu chưa điều chỉnh renderer.

## 5. Nội dung nào được sinh bằng JavaScript?

- `employees.js`: các thẻ nhân viên bổ sung khi `view=all`, thuộc tính của thẻ
  để mở modal và số lượng/kết quả tìm kiếm.
- `modals.js`: nội dung modal và danh sách cửa hàng trong cụm.
- `reports.js`: phiếu chi tiết hoạt động; trạng thái form/kết quả báo cáo.
- `stores.js`: danh sách cửa hàng đã hoàn thành, nhân viên hoàn thành tại cửa
  hàng và một số thông tin cửa hàng.

Sửa HTML ban đầu của các vùng này có thể không đổi phần đang hiển thị vì
JavaScript tạo lại nội dung. Nếu muốn đổi bố cục, sửa template tương ứng;
nếu chỉ đổi màu/khoảng cách/font, ưu tiên CSS.

`demo-data.js` chứa `storeClusters`, `mapAreas`, `extraEmployees`,
`completionProfiles`, `storeDetails`, `buildActivityDetails(activityItem)`.
Dữ liệu ban đầu trong HTML vẫn được giữ tại từng trang, không tự đồng bộ với
các object này. Đây là bộ mockup, chưa có một nguồn dữ liệu tập trung cho mọi trang.

## 6. URL để kiểm tra từng trạng thái

| Ví dụ | Trạng thái |
| --- | --- |
| `03-working-employees.html?view=all` | Danh sách tất cả nhân viên mẫu |
| `01-map-overview.html?zoom=16` | Mức zoom hiển thị nhãn marker |
| `01-map-overview.html?focus=an#employee-info-modal` | Mở sẵn modal nhân viên An |
| `01-map-overview.html?cluster=north` | Mở danh sách cụm cửa hàng |
| `04-store-detail.html?store=minh-khai&employee=bao` | Cửa hàng và nhân viên hoàn thành |
| `10-store-report.html?employee=Nguy%E1%BB%85n%20V%C4%83n%20An&store=an-phu` | Mở thẳng báo cáo nhân viên |
| `12-completed-stores.html?employee=bao` | Hai cửa hàng hoàn thành, một cửa hàng chưa hoàn thành |
| `13-report-activity-detail.html?type=price&item=2` | Phiếu khảo sát giá thứ hai |

`employee` có ý nghĩa khác nhau theo trang: khóa `mai/bao/tuan` trong danh
sách hoàn thành và tên nhân viên trong báo cáo. Không chuẩn hóa tham số này
trong một thay đổi UI đơn thuần.

Các loại phiếu hiện có: `attendance`, `support`, `customer`, `price`, `stock`,
`check-sa`. Giá trị không nhận diện dùng nội dung `attendance` theo code cũ.

## 7. Quy trình sửa UI và xác minh

1. Chọn trang và trạng thái URL cần sửa, chụp ảnh trước khi thay đổi.
2. Sửa HTML/CSS trong đúng nhóm file; đọc phần nội dung động nếu liên quan.
3. Kiểm tra cả trang mục tiêu và trang dùng chung component vừa sửa.
4. So sánh kích thước khoảng 390px và 1280px, cùng chiều cao thấp nếu chỉnh
   vùng cuộn hoặc thanh thao tác cố định.
5. Kiểm tra không mất ảnh/icon, không phát sinh lỗi JavaScript trong console.
6. Kiểm tra click và bàn phím: điều hướng, mở modal, đóng bằng nút/nền/Escape,
   trả focus, tìm kiếm có/không có kết quả, zoom/kéo/lọc bản đồ.
7. Kiểm tra chọn/đổi nhân viên báo cáo, các phiếu hoạt động, tab check-in,
   chọn sao và các nút thông báo.

Có thể kiểm tra cú pháp JavaScript mà không cần cài gói:

```powershell
Get-ChildItem assets/js/*.js | ForEach-Object { node --check $_.FullName }
```

Lệnh này không chứng minh đúng giao diện hoặc tương tác; vẫn cần kiểm tra
trình duyệt. Dự án không có bước build/lint/test được cấu hình sẵn.
