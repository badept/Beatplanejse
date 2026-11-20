/* Modal nhân viên/cửa hàng, focus bản đồ và mở chi tiết từ URL. */
(() => {
    const app = (window.ViewMap ||= {});

    const { storeClusters, mapAreas } = app;

    function fillAreaSummary(modal, trigger) {
        const area = mapAreas[trigger.dataset.area];
        let summary = modal.querySelector("[data-area-summary]");
        if (!area) {
            if (summary) summary.hidden = true;
            return;
        }

        if (!summary) {
            summary = document.createElement("div");
            summary.className = "map-area-summary";
            summary.dataset.areaSummary = "";
            const anchor = modal.querySelector(".employee-detail-meta, .store-detail-list");
            if (anchor) anchor.insertAdjacentElement("afterend", summary);
        }

        if (!summary) return;
        summary.hidden = false;
        summary.innerHTML = `<span>Khu vực ${area.name}</span><b>${area.employees} Plane · ${area.stores} cửa hàng</b>`;
    }

    function fillEmployeeModal(modal, trigger) {
        const fields = {
            "#employee-modal-name": trigger.dataset.name,
            "#employee-modal-store": trigger.dataset.store,
            "#employee-modal-gps": trigger.dataset.gps,
        };

        Object.entries(fields).forEach(([selector, value]) => {
            const field = modal.querySelector(selector);
            if (field && value) field.textContent = value;
        });

        const currentRouteStore = modal.querySelector("#employee-modal-route-store");
        if (currentRouteStore && trigger.dataset.store) {
            currentRouteStore.textContent = `${trigger.dataset.store} (Hiện tại)`;
            const storeSlug = trigger.dataset.store
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLocaleLowerCase("vi")
                .replace(/^ch\s+/, "")
                .replace(/\s+/g, "-");
            const currentRouteItem = currentRouteStore.closest("li");
            if (currentRouteItem) currentRouteItem.dataset.href = `04-store-detail.html?store=${storeSlug}`;
        }

        const reportButton = modal.querySelector("[data-employee-report]");
        if (reportButton && trigger.dataset.name) {
            const storeSlug = (trigger.dataset.store || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLocaleLowerCase("vi")
                .replace(/^ch\s+/, "")
                .replace(/\s+/g, "-");
            reportButton.dataset.href = `10-store-report.html?employee=${encodeURIComponent(trigger.dataset.name)}&store=${storeSlug}`;
        }

        const avatar = modal.querySelector("#employee-modal-avatar");
        if (avatar && trigger.dataset.avatar) {
            avatar.src = trigger.dataset.avatar;
            avatar.alt = trigger.dataset.name || "Nhân viên";
        }

        const status = modal.querySelector("#employee-modal-status");
        if (status && trigger.dataset.status) {
            status.textContent = trigger.dataset.status;
            status.classList.remove("green", "orange", "red");
            status.classList.add(trigger.dataset.statusClass || "green");
        }

        fillAreaSummary(modal, trigger);
    }

    function fillStoreModal(modal, trigger) {
        const fields = {
            "#store-modal-name": trigger.dataset.storeName,
            "#store-modal-code": trigger.dataset.storeCode,
            "#store-modal-address": trigger.dataset.storeAddress,
            "#store-modal-distance": trigger.dataset.storeDistance,
        };

        Object.entries(fields).forEach(([selector, value]) => {
            const field = modal.querySelector(selector);
            if (field && value) field.textContent = value;
        });

        fillAreaSummary(modal, trigger);
    }

    function focusMapMarker(trigger) {
        const map = trigger.closest(".map");
        if (!map) return;

        map.querySelectorAll(".is-focused-marker").forEach((marker) => {
            marker.classList.remove("is-focused-marker");
        });

        const mapRect = map.getBoundingClientRect();
        const anchor = trigger.querySelector(".pin-core") || trigger;
        const anchorRect = anchor.getBoundingClientRect();
        const targetX = mapRect.left + mapRect.width / 2;
        const targetY = mapRect.top + Math.min(96, mapRect.height * 0.22);
        const currentX = anchorRect.left + anchorRect.width / 2;
        const currentY = anchorRect.top + anchorRect.height / 2;

        map.style.setProperty("--marker-pan-x", `${targetX - currentX}px`);
        map.style.setProperty("--marker-pan-y", `${targetY - currentY}px`);
        map.classList.add("map-focus-active");
        trigger.classList.add("is-focused-marker");
    }

    function resetMapFocus(phone) {
        const map = phone.querySelector(".map.map-focus-active");
        if (!map) return;

        map.classList.remove("map-focus-active");
        map.style.removeProperty("--marker-pan-x");
        map.style.removeProperty("--marker-pan-y");
        map.querySelectorAll(".is-focused-marker").forEach((marker) => {
            marker.classList.remove("is-focused-marker");
        });
    }

    function openInfoModal(trigger) {
        const phone = trigger.closest(".phone");
        const modal = phone && phone.querySelector(`#${trigger.dataset.modalTarget}`);
        if (!phone || !modal) return;

        phone.querySelectorAll(".map-info-modal.is-open").forEach((openModal) => {
            openModal.classList.remove("is-open");
            openModal.hidden = true;
        });

        if (trigger.dataset.name) fillEmployeeModal(modal, trigger);
        if (trigger.dataset.storeName) fillStoreModal(modal, trigger);

        const map = phone.querySelector(".map");
        if (map && trigger.dataset.focus) map.dataset.focus = trigger.dataset.focus;
        focusMapMarker(trigger);

        modal.__returnFocus = trigger;
        modal.hidden = false;
        phone.classList.add("modal-active");
        phone.classList.toggle(
            "employee-sheet-open",
            modal.classList.contains("employee-sheet-modal"),
        );
        phone.classList.toggle(
            "detail-sheet-open",
            modal.classList.contains("detail-sheet-modal"),
        );
        trigger.setAttribute("aria-expanded", "true");

        requestAnimationFrame(() => {
            modal.classList.add("is-open");
            const closeButton = modal.querySelector(".modal-close");
            if (closeButton) closeButton.focus();
        });
    }

    function openStoreCluster(trigger) {
        const phone = trigger.closest(".phone");
        const modal = phone && phone.querySelector("#cluster-store-list");
        const map = trigger.closest(".map");
        const storeIds = storeClusters[trigger.dataset.storeCluster] || [];
        if (!phone || !modal || !map || !storeIds.length) return;

        const list = modal.querySelector("#cluster-store-items");
        const title = modal.querySelector("#cluster-list-title");
        list.replaceChildren();
        title.textContent = `${storeIds.length} cửa hàng gần nhau`;

        storeIds.forEach((storeId) => {
            const marker = map.querySelector(`[data-store-id="${storeId}"]`);
            if (!marker) return;

            const row = document.createElement("button");
            row.className = "cluster-store-row";
            row.dataset.clusterStore = storeId;

            const icon = document.createElement("span");
            icon.className = "cluster-store-row-icon";
            icon.innerHTML = '<svg class="ico"><use href="#store" /></svg>';

            const text = document.createElement("span");
            const name = document.createElement("b");
            const address = document.createElement("small");
            name.textContent = marker.dataset.storeName;
            address.textContent = marker.dataset.storeAddress;
            text.append(name, address);

            const distance = document.createElement("em");
            distance.textContent = marker.dataset.storeDistance;
            row.append(icon, text, distance);
            list.append(row);
        });

        modal.__returnFocus = trigger;
        modal.hidden = false;
        phone.classList.add("modal-active", "detail-sheet-open");
        focusMapMarker(trigger);
        requestAnimationFrame(() => {
            modal.classList.add("is-open");
            const closeButton = modal.querySelector(".modal-close");
            if (closeButton) closeButton.focus();
        });
    }

    function openStoreFromCluster(choice) {
        const phone = choice.closest(".phone");
        const clusterModal = choice.closest(".map-info-modal");
        const map = phone && phone.querySelector(".map");
        const marker = map && map.querySelector(
            `[data-store-id="${choice.dataset.clusterStore}"]`,
        );
        if (!phone || !clusterModal || !map || !marker) return;

        clusterModal.classList.remove("is-open");
        clusterModal.hidden = true;
        phone.classList.remove("modal-active", "detail-sheet-open");
        resetMapFocus(phone);
        app.setMapZoom(map, 16);

        requestAnimationFrame(() => openInfoModal(marker));
    }

    function closeInfoModal(closeControl) {
        const modal = closeControl.closest(".map-info-modal");
        const phone = modal && modal.closest(".phone");
        if (!modal || !phone) return;

        const returnFocus = modal.__returnFocus;
        modal.classList.remove("is-open");
        phone.classList.remove("modal-active");
        phone.classList.remove("employee-sheet-open");
        phone.classList.remove("detail-sheet-open");
        resetMapFocus(phone);
        const map = phone.querySelector(".map");
        if (map) map.removeAttribute("data-focus");
        if (returnFocus) returnFocus.setAttribute("aria-expanded", "false");

        window.setTimeout(() => {
            modal.hidden = true;
            if (returnFocus) returnFocus.focus();
        }, 180);
    }

    function initModalLinks() {
        const { pageParams } = app;
        const hashModalId = location.hash.slice(1);
        if (hashModalId) {
            const requestedFocus = pageParams.get("focus");
            const focusSelector = requestedFocus ?
                `[data-focus="${requestedFocus}"]` :
                "";
            const initialTrigger = document.querySelector(
                `[data-modal-target="${hashModalId}"]${focusSelector}`,
            );
            if (initialTrigger) openInfoModal(initialTrigger);
        }

        const requestedCluster = pageParams.get("cluster");
        if (requestedCluster && !hashModalId) {
            const clusterTrigger = document.querySelector(
                `[data-store-cluster="${requestedCluster}"]`,
            );
            if (clusterTrigger) openStoreCluster(clusterTrigger);
        }
    }

    Object.assign(app, { openInfoModal, closeInfoModal, openStoreCluster, openStoreFromCluster, resetMapFocus, initModalLinks });
})();
