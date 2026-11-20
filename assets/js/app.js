/* Điểm khởi tạo. Các script chức năng phải được nạp trước file này. */
(() => {
    const app = window.ViewMap;

    app.initIcons();
    app.initCore();
    app.initEmployees();
    app.initMap();
    app.initModalLinks();
    app.initFilters();
    app.initCheckin();
    app.initEvaluation();
    app.initReports();
    app.initStores();
})();
