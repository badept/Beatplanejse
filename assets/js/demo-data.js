/* Dữ liệu mẫu. Giữ nguyên dữ liệu và nội dung hiển thị khi clean code. */
(() => {
    const app = (window.ViewMap ||= {});

    const storeClusters = {
        north: ["an-phu", "minh-tam", "nguyen-van-linh"],
        center: ["hoang-dieu", "phu-my"],
        south: ["tan-thuan", "minh-khai", "binh-phu"],
    };

    const mapAreas = {
        "thu-duc": { name: "Quận Thủ Đức", employees: 11, stores: 4 },
        "binh-thanh": { name: "Quận Bình Thạnh", employees: 10, stores: 4 },
    };

    const extraEmployees = [
        ["Đặng Minh Tâm", "CH Tân Thuận", "assets/images/avatar-an.svg", "09:29 · 12 phút trước"],
        ["Nguyễn Thảo Vy", "CH Bình Phú", "assets/images/avatar-binh.svg", "09:26 · 15 phút trước"],
        ["Phan Gia Bảo", "CH An Phú", "assets/images/avatar-huy.svg", "09:37 · 4 phút trước"],
        ["Lê Hoài Nam", "CH Hoàng Diệu", "assets/images/avatar-an.svg", "09:30 · 11 phút trước"],
        ["Trương Khánh Linh", "CH Minh Khai", "assets/images/avatar-binh.svg", "09:32 · 9 phút trước"],
        ["Vũ Thanh Phong", "CH Phú Mỹ", "assets/images/avatar-huy.svg", "09:25 · 16 phút trước"],
        ["Mai Ngọc Anh", "CH Nguyễn Văn Linh", "assets/images/avatar-an.svg", "09:40 · 1 phút trước"],
        ["Đinh Quốc Việt", "CH Minh Tâm", "assets/images/avatar-binh.svg", "09:22 · 19 phút trước"],
        ["Hồ Bảo Trâm", "CH Tân Thuận", "assets/images/avatar-huy.svg", "09:35 · 6 phút trước"],
    ];

    const completionProfiles = {
        mai: { name: "Nguyễn Thị Mai", initials: "NM", done: 3, total: 3 },
        bao: { name: "Phạm Quốc Bảo", initials: "PB", done: 2, total: 3 },
        tuan: { name: "Võ Minh Tuấn", initials: "VT", done: 4, total: 4 },
    };

    const storeDetails = {
        "an-phu": { name: "CH An Phú", code: "CH001", address: "Số 123 Nguyễn Văn Linh, P. Tân Phú,<br>Q.7, TP. Hồ Chí Minh", distance: "30 m" },
        "minh-khai": { name: "CH Minh Khai", code: "CH002", address: "Số 58 Minh Khai, P. Vĩnh Tuy,<br>Q. Hai Bà Trưng, Hà Nội", distance: "120 m" },
        "hoang-dieu": { name: "CH Hoàng Diệu", code: "CH003", address: "Số 86 Hoàng Diệu, P. Hải Châu,<br>Q. Hải Châu, Đà Nẵng", distance: "65 m" },
    };

    function buildActivityDetails(activityItem) {
        return {
            attendance: {
                title: "Chấm công vào",
                status: "Đã check-in thành công",
                time: "09:44 · 10/11/2026",
                rows: [["Nhân viên", "Nguyễn Văn An"], ["Ca làm việc", "08:00 – 17:00"], ["Vị trí", "CH An Phú · cách điểm 30 m"], ["Xác nhận", "Ảnh và GPS hợp lệ"]],
            },
            support: {
                title: "Hỗ trợ cửa hàng",
                status: "Đã hoàn thành",
                time: "10:05 · 10/11/2026",
                rows: [["Nội dung", "Trưng bày và hỗ trợ đơn hàng"], ["Nhân viên", "Nguyễn Văn An"], ["Kết quả", "Đủ vật phẩm trưng bày"], ["Ghi chú", "Cửa hàng xác nhận"]],
            },
            customer: {
                title: "Khảo sát lượng khách tại quán",
                status: "Đã hoàn thành",
                time: "10:08 · 10/11/2026",
                rows: [["Khung giờ khảo sát", "09:30 – 10:00"], ["Số khách ghi nhận", "26 khách"], ["Nhân viên", "Nguyễn Văn An"], ["Ghi chú", "Lượng khách ổn định"]],
            },
            price: {
                title: `Khảo sát giá sản phẩm #${activityItem}/2`,
                status: "Đã hoàn thành",
                time: "10:12 · 10/11/2026",
                rows: activityItem === "2" ? [["Jet Filter", "24.000đ / bao"], ["Vinataba", "18.000đ / bao"], ["Người khảo sát", "Nguyễn Văn An"], ["Trạng thái", "Đã xác nhận giá"]] : [["Marlboro Gold", "32.000đ / bao"], ["Esse Change", "28.000đ / bao"], ["Người khảo sát", "Nguyễn Văn An"], ["Trạng thái", "Đã xác nhận giá"]],
            },
            stock: {
                title: `Khảo sát tồn kho #${activityItem}/2`,
                status: "Đã hoàn thành",
                time: "10:18 · 10/11/2026",
                rows: activityItem === "2" ? [["Jet Filter", "43 bao"], ["Vinataba", "60 bao"], ["Người khảo sát", "Nguyễn Văn An"], ["Xác nhận", "Đã kiểm đếm thực tế"]] : [["Marlboro Gold", "18 bao"], ["Esse Change", "5 bao"], ["Người khảo sát", "Nguyễn Văn An"], ["Xác nhận", "Đã kiểm đếm thực tế"]],
            },
            "check-sa": {
                title: "Kiểm tra SA",
                status: "Đã hoàn thành",
                time: "10:26 · 10/11/2026",
                rows: [["Kết quả", "Đạt 8/10 tiêu chí"], ["Trưng bày", "Đạt"], ["Tồn kho", "Cần bổ sung Esse Change"], ["Người kiểm tra", "Nguyễn Văn An"]],
            },
        };
    }

    Object.assign(app, { storeClusters, mapAreas, extraEmployees, completionProfiles, storeDetails, buildActivityDetails });
})();
