# Hướng dẫn bật và chạy website View Map trên Windows

Để xem đầy đủ dashboard, cần bật server rồi mở website bằng địa chỉ HTTP.
Không mở trực tiếp `dashboard.html` bằng cách nhấp đúp: địa chỉ `file:///...`
không nạp được bộ dữ liệu lớn và Worker xử lý bộ lọc.

## 1. Bật website

Nếu vừa clone/tải từ GitHub, mở PowerShell trong thư mục chứa `serve.cjs` rồi chạy `node serve.cjs`. Máy mới cần cài Node.js 22 trở lên. Phần bên dưới là lệnh tắt cho thư mục trên máy gốc.

1. Nhấn **Windows + R**.
2. Nhập `powershell`, nhấn **Enter**.
3. Sao chép nguyên dòng dưới đây, dán vào PowerShell rồi nhấn **Enter**:

```powershell
node "C:\Users\DELL5480\Desktop\Beatplanejse-main\Beatplanejse-main\serve.cjs"
```

Lệnh này chạy được dù PowerShell đang đứng ở thư mục nào.

Khi bật thành công, cửa sổ sẽ hiện:

```text
Local: http://127.0.0.1:8080/dashboard.html
```

**Giữ cửa sổ PowerShell đang mở trong suốt lúc sử dụng website.** Việc cửa sổ
đứng tại dòng địa chỉ, chưa trở về dấu nhắc, là bình thường: server đang chạy.

Máy hiện tại đã có Node.js v22.15.0. Không cần chạy `npm install`, build,
cài Python hoặc nhập lại file Excel để xem dashboard đã chuẩn bị sẵn.

## 2. Mở website

Mở Chrome, Edge hoặc tab trình duyệt trong Codex, dán địa chỉ sau vào thanh
địa chỉ rồi nhấn **Enter**:

**[http://127.0.0.1:8080/dashboard.html](http://127.0.0.1:8080/dashboard.html)**

Nếu đang mở tab có địa chỉ `file:///C:/.../dashboard.html`, thay toàn bộ địa
chỉ đó bằng địa chỉ HTTP ở trên. Không chỉ bấm tải lại tab `file:///...`.

Chờ website nạp xong dữ liệu. Khi nút **Bộ lọc** sử dụng được, có thể bắt đầu
chọn vùng, tỉnh/thành, SUP hoặc nhân viên.

## 3. Cách sử dụng

- **Bộ lọc:** nằm trên thanh đầu trang, mặc định thu gọn. Bấm để mở; bấm lại
  để đóng. Các lựa chọn đang lọc vẫn được giữ khi thu gọn.
- **Bản đồ:** kéo để di chuyển, dùng nút `+` / `−` để phóng to hoặc thu nhỏ.
  Bấm cụm số để xem các điểm gần nhau, bấm marker để mở chi tiết.
- **Cột phải:** xem tổng quan hoặc chọn tab Tất cả / Nhân viên / Cửa hàng.
  Danh sách có nút Trước / Sau, tối đa 50 đối tượng mỗi trang.
- **Chi tiết nhân viên:** xem SUP, danh mục shop phụ trách, vị trí mô phỏng
  và lộ trình ngày. Khoảng cách nằm trên đường nối dọc giữa hai shop.
- **Báo cáo:** bấm nút xem báo cáo trong phần chi tiết hoặc tab Báo cáo trên
  thanh đầu trang. Đây là giao diện chỉ đọc, không dùng để check-in.
- **Đặt lại:** mở Bộ lọc rồi bấm Đặt lại để xem lại toàn bộ dữ liệu.

## 4. Dữ liệu và bản đồ hiển thị thế nào

Dashboard có **26.219 shop nguồn, 900 nhân viên mẫu và 39 SUP**, cùng nhóm
shop chưa phân SUP. Nhân viên, trạng thái làm việc, vị trí nhân viên và báo
cáo là mô phỏng; không phải dữ liệu vận hành trực tiếp.

Không phải mọi shop đều có marker:

| Nhóm shop | Số lượng | Cách hiển thị |
| --- | ---: | --- |
| Có tọa độ để hiển thị theo kiểm tra sơ bộ | 8.877 | Có thể hiện trên bản đồ |
| Thiếu tọa độ / tọa độ bằng 0 | 17.270 | Giữ trong danh sách và báo cáo |
| Tọa độ cần kiểm tra | 72 | Giữ trong danh sách, chưa đặt lên bản đồ |

Khoảng cách giữa shop là **ước lượng đường thẳng**, không phải quãng đường
đi theo đường bộ. Ngày làm việc hiện có dữ liệu mẫu **17–19/11/2026**.

**Cần internet để tải nền đường phố OpenStreetMap.** Nếu nền đường phố không
tải được, website hiện thông báo và dùng nền địa lý tổng quan dự phòng.
Danh sách, bộ lọc và báo cáo vẫn sử dụng được, nhưng nền dự phòng không có
chi tiết đường phố. Bật server cục bộ không tự khắc phục được lỗi mạng ngoài.

## 5. Tắt và mở lại lần sau

Để tắt server, quay lại PowerShell và nhấn **Ctrl + C**. Sau đó có thể đóng
cửa sổ. Khi server tắt, tải lại website sẽ không kết nối được.

Lần sau muốn sử dụng, thực hiện lại bước 1 và mở địa chỉ ở bước 2. Địa chỉ
`127.0.0.1` chỉ dùng trên máy đang chạy server.

## 6. Xử lý lỗi thường gặp

### Trình duyệt báo không thể kết nối

Kiểm tra cửa sổ PowerShell vẫn đang chạy và có dòng `Local: ...`. Nếu đã
đóng cửa sổ hoặc nhấn Ctrl+C, chạy lại lệnh ở bước 1. Kiểm tra địa chỉ mở
đúng cổng được in trong PowerShell.

### Website yêu cầu chạy node serve.cjs

Bạn đang mở bằng `file:///...`. Bật server và đổi sang:

```text
http://127.0.0.1:8080/dashboard.html
```

### Báo EADDRINUSE hoặc cổng 8080 đã được sử dụng

Thử mở địa chỉ ở bước 2 trước; có thể server đã được bật trong cửa sổ khác.
Nếu cần chạy bằng cổng khác, nhập hai dòng sau trong PowerShell:

```powershell
$env:PORT = "8081"
node "C:\Users\DELL5480\Desktop\Beatplanejse-main\Beatplanejse-main\serve.cjs"
```

Sau đó mở **[http://127.0.0.1:8081/dashboard.html](http://127.0.0.1:8081/dashboard.html)**.
Muốn quay lại cổng 8080 trong cùng cửa sổ: dừng bằng Ctrl+C, đặt
`$env:PORT = "8080"` rồi chạy lại lệnh `node`.

### Báo không tìm thấy serve.cjs

Dùng nguyên lệnh có đường dẫn đầy đủ ở bước 1. Thư mục này có hai lớp cùng
tên; file server nằm tại:

```text
C:\Users\DELL5480\Desktop\Beatplanejse-main\Beatplanejse-main\serve.cjs
```

Nếu di chuyển dự án sang nơi khác, thay đường dẫn trong lệnh bằng vị trí mới.

### Báo node không được nhận diện

Thử mở một cửa sổ PowerShell mới và chạy:

```powershell
node --version
```

Máy đã dùng để chuẩn bị dự án có Node.js. Nếu lỗi vẫn xuất hiện, cần kiểm
tra Node.js/PATH của tài khoản Windows đang sử dụng trước khi chạy website.

### Dữ liệu chưa hiện hoặc giao diện vẫn là bản cũ

Chờ nạp dữ liệu, sau đó thử **Ctrl + F5** trên tab HTTP. Nếu vẫn lỗi, kiểm tra
file `assets\data\shops.json` còn nằm trong thư mục dự án và PowerShell
không báo lỗi. Không cần nhập lại Excel chỉ để mở dashboard.

## 7. Mở bộ giao diện mobile cũ

Sau khi bật server, có thể mở trang chọn giao diện tại:

**[http://127.0.0.1:8080/index.html](http://127.0.0.1:8080/index.html)**

Tài liệu kỹ thuật và cập nhật dữ liệu nằm trong
[README dự án](Beatplanejse-main/README.md) và
[hướng dẫn dữ liệu dashboard](Beatplanejse-main/docs/DASHBOARD-DATA.md).
