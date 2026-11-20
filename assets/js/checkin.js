/* Trạng thái tab chấm công; các thao tác xác nhận vẫn là mô phỏng. */
(() => {
    const app = (window.ViewMap ||= {});

    function initCheckin() {
        document.querySelectorAll(".checkin-tabs button").forEach((tab) => {
            tab.addEventListener("click", () => {
                tab.closest(".checkin-tabs").querySelectorAll("button").forEach((item) => {
                    item.classList.toggle("active", item === tab);
                });
            });
        });
    }

    Object.assign(app, { initCheckin });
})();
