/* Điều hướng và sự kiện dùng chung. Thứ tự nhánh click được giữ nguyên. */
(() => {
    const app = (window.ViewMap ||= {});

    const pageParams = new URLSearchParams(location.search);

    function initCore() {
        const { setMapStatusFilter, closeInfoModal, openStoreFromCluster, openStoreCluster, setMapZoom, centerOnMyLocation, openInfoModal } = app;
        document.addEventListener("click", (event) => {
            const statusFilter = event.target.closest("[data-map-status-filter]");
            if (statusFilter) {
                setMapStatusFilter(statusFilter);
                return;
            }

            const routeListControl = event.target.closest("[data-route-list]");
            if (routeListControl) {
                const routeList = routeListControl.closest(".phone")?.querySelector(".route-list");
                if (routeList) {
                    routeList.scrollIntoView({ behavior: "smooth", block: "center" });
                    routeList.classList.remove("is-highlighted");
                    window.setTimeout(() => routeList.classList.add("is-highlighted"), 20);
                }
                return;
            }

            const closeControl = event.target.closest("[data-modal-close]");
            if (closeControl) {
                closeInfoModal(closeControl);
                return;
            }

            const storeChoice = event.target.closest("[data-cluster-store]");
            if (storeChoice) {
                openStoreFromCluster(storeChoice);
                return;
            }

            const storeCluster = event.target.closest("[data-store-cluster]");
            if (storeCluster) {
                openStoreCluster(storeCluster);
                return;
            }

            const zoomControl = event.target.closest("[data-map-zoom]");
            if (zoomControl) {
                const map = zoomControl.closest(".map");
                const direction = zoomControl.dataset.mapZoom === "in" ? 1 : -1;
                setMapZoom(map, Number(map.dataset.zoom) + direction);
                return;
            }

            const locateControl = event.target.closest("[data-map-locate]");
            if (locateControl) {
                const overview = locateControl.closest(".overview-content");
                const map = overview && overview.querySelector(".map");
                if (map) centerOnMyLocation(map);
                return;
            }

            const modalTrigger = event.target.closest("[data-modal-target]");
            if (modalTrigger) {
                openInfoModal(modalTrigger);
                return;
            }

            const navigation = event.target.closest("[data-href], [data-back]");
            if (navigation) {
                location.href = navigation.dataset.href || "index.html";
                return;
            }

            const toggle = event.target.closest(".switch");
            if (toggle) {
                toggle.classList.toggle("on");
                toggle.setAttribute("aria-pressed", toggle.classList.contains("on"));
            }

            const action = event.target.closest("[data-action]");
            if (action) {
                const phone = action.closest(".phone");
                const toast = phone && phone.querySelector(".toast");
                if (toast) {
                    toast.textContent = action.dataset.message || "Đã cập nhật";
                    toast.classList.add("show");
                    clearTimeout(window.__toastTimer);
                    window.__toastTimer = setTimeout(
                        () => toast.classList.remove("show"),
                        1500,
                    );
                }
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                const openModal = document.querySelector(".map-info-modal.is-open");
                const closeControl = openModal && openModal.querySelector("[data-modal-close]");
                if (closeControl) closeInfoModal(closeControl);
                return;
            }

            if (event.key !== "Enter" && event.key !== " ") return;

            const modalTrigger = event.target.closest("[data-modal-target]");
            if (modalTrigger) {
                event.preventDefault();
                openInfoModal(modalTrigger);
                return;
            }

            const navigation = event.target.closest("[data-href]");
            if (!navigation) return;
            event.preventDefault();
            location.href = navigation.dataset.href;
        });
    }

    Object.assign(app, { pageParams, initCore });
})();
