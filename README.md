# View Map — bộ giao diện quản lý nhân viên thị trường

**Hướng dẫn bật website từng bước trên Windows:**
[README-HUONG-DAN-CHAY.md](README-HUONG-DAN-CHAY.md).

Dự án gồm 14 trang mockup và một dashboard website, dùng HTML, CSS và JavaScript
thuần. Dashboard dùng shop từ file nguồn; nhân viên và báo cáo là mô phỏng.
Không cần cài dependency hay build để chạy website.

## Dashboard website với 26K shop và 900 NV mẫu

Chạy từ thư mục này, không cần cài dependency hoặc build:

```powershell
node serve.cjs
```

Mở `http://127.0.0.1:8080/dashboard.html`. Bản dữ liệu lớn cần HTTP; không mở
trực tiếp dashboard bằng `file://`. Server chỉ chạy trên máy cục bộ, dừng bằng Ctrl+C.
Nếu cổng bận, đặt biến `PORT` trước khi chạy.

- 26.219 shop nguồn, 900 nhân viên mô phỏng, 39 SUP và nhóm Chưa phân SUP.
- Mặc định hiện cả shop và nhân viên; lọc Vùng → Tỉnh/thành → SUP → Nhân viên,
  cùng trạng thái lượt ghé, tọa độ, tên/mã và ba ngày mẫu 17–19/11/2026.
- 8.877 shop có vị trí để hiển thị, 17.270 shop thiếu tọa độ và 72 shop cần
  kiểm tra vẫn nằm trong danh sách/báo cáo. Không tạo tọa độ giả cho shop.
- Cột phải phân trang 50 hàng; lọc bằng Web Worker và tạo marker theo đợt.
- Danh mục phụ trách tách khỏi lộ trình ngày. Khoảng cách nằm giữa các thẻ shop,
  cạnh đường nối dọc; tính đường thẳng ước lượng từ lat/long, không phải đường bộ.
- Vị trí NV, trạng thái làm việc và báo cáo được mô phỏng; chỉ giám sát/xem báo
  cáo, không check-in/gửi đánh giá. Mỗi shop được giao đúng một NV trong cùng SUP/tỉnh.
- Bản đồ Leaflet có gom cụm. Nền đường phố OpenStreetMap cần internet; nền
  tổng quan dự phòng không có chi tiết đường phố. Giữ nguyên ghi nguồn trên map.

Chi tiết nguồn dữ liệu, cấu trúc mã, cách bổ sung tọa độ và quy tắc phân công:
[docs/DASHBOARD-DATA.md](docs/DASHBOARD-DATA.md).

```powershell
node --test tests/dashboard-data.test.cjs
```

Đã đạt 10 nhóm kiểm thử dữ liệu và các kiểm tra trình duyệt trên toàn bộ
26.219 shop: Worker thật, phân trang, SUP/NV, tọa độ thiếu/cần kiểm tra,
timeline dọc, báo cáo, đổi ngày và kích thước 1280/768/390/320px. Không ghi nhận
lỗi JavaScript hoặc tài nguyên nội bộ tải lỗi trong lượt cuối. Phép đo cục bộ:
nạp và lọc dữ liệu ban đầu khoảng 2,1 giây; đổi SUP khoảng 0,18 giây. Đây không
phải cam kết hiệu năng cho mọi máy và chưa bao gồm chờ tải nền đường phố.

Nguồn/giấy phép thư viện: [assets/vendor/README.md](assets/vendor/README.md).
Các trang mockup mobile cũ vẫn được giữ nguyên.

## Mở dự án

Mở `index.html` bằng trình duyệt. Trang này liên kết tới dashboard và 7 màn hình đầu;
các màn hình còn lại truy cập qua thao tác trong ứng dụng hoặc mở file trực tiếp.
Các trang mockup mobile dùng đường dẫn tương đối và script thông thường, nên
vẫn chạy qua `file://`. Dashboard dữ liệu lớn cần HTTP để nạp JSON và Worker.

Nếu có Python, có thể chạy HTTP server từ thư mục chứa README:

```powershell
python -m http.server 8000
```

Sau đó mở `http://localhost:8000/index.html`.

## Cấu trúc

```text
index.html                         Trang chọn màn hình
01-map-overview.html               Tổng quan bản đồ
02-employee-route.html             Lộ trình nhân viên
03-working-employees.html          Nhân viên đang IN / tất cả nhân viên
04-store-detail.html               Chi tiết cửa hàng
05-location-status.html            Danh sách nhân viên hoàn thành
06-filters.html                    Bộ lọc
07-idle-employees.html             Nhân viên chưa làm việc
08-sup-checkin.html                Check-in SUP
09-sa-evaluation.html              Đánh giá SA
10-store-report.html               Báo cáo theo nhân viên tại cửa hàng
11-employee-daily-report.html       Báo cáo ngày
12-completed-stores.html           Cửa hàng đã hoàn thành của nhân viên
13-report-activity-detail.html     Phiếu hoạt động báo cáo
assets/
  css/
    styles.css                    Điểm nạp và thứ tự cascade
    base.css                      Biến màu và quy tắc nền tảng
    layout.css                    Khung điện thoại và thanh ứng dụng
    layout-preview.css            Giao diện khung chữ nhật đang sử dụng
    components.css                Sheet, avatar, badge, button, card, search
    notices.css                   Các khối thông báo
    feedback.css                  Toast
    modals.css                    Lớp phủ và bottom sheet nhân viên/cửa hàng
    responsive.css                Quy tắc màn hình 760px / 520px
    pages/                        CSS của từng nhóm màn hình
  js/
    demo-data.js                  Dữ liệu mẫu dùng trong JavaScript
    icons.js                      Sprite SVG nội tuyến
    core.js                       Query string và sự kiện dùng chung
    map.js                        Zoom, kéo bản đồ và lọc trạng thái
    modals.js                     Mở/đóng modal, focus và liên kết URL
    employees.js                  Danh sách và tìm kiếm nhân viên
    filters.js                    Form bộ lọc và gợi ý lựa chọn
    checkin.js                    Tab check-in/check-out
    evaluation.js                 Chọn số sao đánh giá
    reports.js                    Báo cáo và phiếu hoạt động
    stores.js                     Cửa hàng và danh sách hoàn thành
    app.js                        Thứ tự khởi tạo
  images/                         Ảnh bản đồ, avatar và sprite SVG gốc
docs/
  UI-GUIDE.md                     Hướng dẫn chỉnh giao diện và hợp đồng DOM
```

## Luồng khởi tạo

Các trang chức năng nạp dữ liệu và các script chức năng trước `app.js`.
Mỗi file bao trong một hàm riêng để tránh biến toàn cục trùng tên. Những phần
cần dùng chung được đăng ký vào `window.ViewMap`.

`app.js` khởi tạo theo thứ tự: icon → sự kiện chung → nhân viên → bản đồ →
modal từ URL → bộ lọc → check-in → đánh giá → báo cáo → cửa hàng.
Giữ thứ tự này: danh sách phải có dữ liệu trước tìm kiếm/mở modal, bản đồ phải
có lớp zoom trước thao tác focus và các script phải có mặt trước khi khởi tạo.

## Phạm vi lần clean code

- Tách CSS theo các đoạn liên tiếp, giữ nguyên thứ tự selector và declaration.
- Tách JavaScript theo chức năng, chuyển các bộ dữ liệu mẫu sang file riêng.
- Chuẩn hóa cách trình bày HTML, đánh dấu khung, tiêu đề, nội dung và script.
- Chuyển hai kiểu inline của lộ trình và tên nhân viên sang class CSS.
- Bỏ biến lựa chọn báo cáo không được sử dụng.
- Giữ tên file HTML, đường dẫn điều hướng, nội dung và tương tác hiện tại.

Một số khối CSS nằm ở nhiều file do lịch sử ghi đè. Đây là cách bảo toàn giao
diện trong bước tách; không được coi mọi selector lặp là code thừa để xóa.
Chưa chuyển header/modal thành template sinh bằng JavaScript, vì giữ markup
trực tiếp giúp chỉnh UI và mở trang tĩnh thuận tiện hơn.

## Giới hạn hiện tại

- Bản đồ là ảnh nền và marker mô phỏng; nút định vị không gọi GPS thật.
- Các nút camera, xác nhận check-in, gửi đánh giá và làm mới chỉ hiển thị
  thông báo theo hành vi có sẵn; chưa lưu dữ liệu hoặc gọi API.
- Bộ lọc chuyển giá trị form qua URL nhưng chưa áp dụng đầy đủ các điều kiện;
  hai switch chưa được đưa vào `FormData`.
- Trang hoàn thành hiển thị số đếm ban đầu 6 nhưng có 3 thẻ nhân viên.
- Dữ liệu cửa hàng còn nằm cả trong HTML và `demo-data.js`, chưa nhất quán
  về mã/địa chỉ; một số nội dung báo cáo và lộ trình vẫn cố định theo mẫu.
- Có cả sprite gốc `assets/images/icons.svg` và sprite nội tuyến trong
  `icons.js`. Các trang chức năng dùng bản nội tuyến sau khởi tạo; hai bản
  chưa hoàn toàn giống nhau, nên không gộp bằng cách thay thế tùy ý.
- Chưa có package manifest, formatter, lint hoặc bộ test do dự án cấu hình.

Hướng dẫn sửa từng phần, các tham số URL và danh sách kiểm tra nằm trong
[docs/UI-GUIDE.md](docs/UI-GUIDE.md).

## Kết quả kiểm chứng lần clean code

Đã kiểm tra bằng Chrome headless trên Windows, đối chiếu với bản sao trước sửa:

- 12 file JavaScript qua kiểm tra cú pháp; 469 tham chiếu nội bộ trong HTML
  trỏ tới file tồn tại. Toàn bộ ảnh/SVG giữ nguyên nội dung byte.
- 631 quy tắc CSS gốc được trình duyệt phân tích thành cùng nội dung và cùng
  thứ tự sau khi tách; hai class thay inline style được bổ sung riêng.
- 14 trang và 8 biến thể URL ở viewport 390×844 và 1280×844: 44 ảnh đối chiếu,
  43 ảnh trùng tuyệt đối. Ảnh modal nhân viên ở viewport 390px khác đúng một
  pixel tại góc viền khung; không có sai lệch bố cục/nội dung quan sát được.
- 38 giá trị trạng thái được thu thập sau các thao tác trên bản cũ và bản mới
  giống nhau: zoom, pan, modal, trả focus, lọc trạng thái, cụm cửa hàng, tìm
  kiếm, điều hướng hoàn thành, form bộ lọc, báo cáo, chọn sao và tab check-in.
- Không ghi nhận lỗi JavaScript khi mở 44 trạng thái hoặc chạy các luồng trên.
  Chrome chặn yêu cầu SVG ngoài qua `file://` ở cả bản gốc; sprite nội tuyến
  vẫn cung cấp icon. Kiểm tra tương tác phân biệt lỗi có sẵn này với lỗi mới.

Đây là đối chiếu trên Chrome với dữ liệu mẫu hiện tại, không phải xác nhận
tích hợp backend, GPS/camera thật hoặc bảo đảm tương thích mọi trình duyệt.
