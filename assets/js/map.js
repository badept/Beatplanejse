/* Zoom, kéo bản đồ, định vị mô phỏng và lọc trạng thái cửa hàng. */
(() => {
    const app = (window.ViewMap ||= {});

    function setMapZoom(map, zoom) {
        const nextZoom = Math.max(11, Math.min(18, Number(zoom)));
        map.dataset.zoom = String(nextZoom);
        map.classList.toggle("zoom-clustered", nextZoom <= 13);
        const mapSize = 105 + (nextZoom - 11) * 14;
        map.style.setProperty("--map-zoom-size", `${mapSize}%`);
        map.style.setProperty("--map-marker-scale", String(mapSize / 161));

        const label = map.querySelector(".map-zoom-level b");
        if (label) label.textContent = nextZoom.toFixed(0);
    }

    function prepareMapZoomLayer(map) {
        const zoomLayer = document.createElement("div");
        zoomLayer.className = "map-zoom-layer";
        map.insertBefore(zoomLayer, map.firstChild);

        [...map.children].forEach((child) => {
            if (!child.matches(".map-zoom-level, .premium-zoom, .map-zoom-layer")) {
                zoomLayer.append(child);
            }
        });
    }

    function centerOnMyLocation(map) {
        const phone = map.closest(".phone");
        app.resetMapFocus(phone);
        map.removeAttribute("data-focus");
        map.classList.add("map-user-centered", "location-pulse");
        setMapZoom(map, 15);
        window.setTimeout(() => map.classList.remove("location-pulse"), 700);
    }

    function setMapStatusFilter(control) {
        const sheet = control.closest(".overview");
        const map = control.closest(".phone")?.querySelector(".overview-content .map");
        if (!sheet || !map) return;

        const nextStatus = control.dataset.mapStatusFilter;
        const selectedStatuses = new Set(
            (map.dataset.statusFilters || "").split(",").filter(Boolean),
        );

        if (selectedStatuses.has(nextStatus)) selectedStatuses.delete(nextStatus);
        else selectedStatuses.add(nextStatus);

        if (selectedStatuses.size) map.dataset.statusFilters = [...selectedStatuses].join(",");
        else delete map.dataset.statusFilters;

        map.querySelectorAll(".store-map-pin").forEach((store) => {
            const isHidden = selectedStatuses.size && !selectedStatuses.has(store.dataset.visitStatus);
            store.classList.toggle("is-status-filtered-out", isHidden);
        });

        sheet.querySelectorAll("[data-map-status-filter]").forEach((chip) => {
            const isActive = selectedStatuses.has(chip.dataset.mapStatusFilter);
            chip.classList.toggle("is-active", isActive);
            chip.setAttribute("aria-pressed", String(isActive));
        });
    }

    function enableMapPan(map) {
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let originX = 0;
        let originY = 0;
        let wasDragged = false;

        const readPan = (name) => Number.parseFloat(map.style.getPropertyValue(name)) || 0;
        const applyPan = (x, y) => {
            map.style.setProperty("--map-pan-x", `${Math.max(-190, Math.min(190, x))}px`);
            map.style.setProperty("--map-pan-y", `${Math.max(-150, Math.min(150, y))}px`);
        };

        map.addEventListener("pointerdown", (event) => {
            if (event.button !== 0 || event.target.closest("button, .named-pin, .store-map-pin, .store-cluster")) return;
            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            originX = readPan("--map-pan-x");
            originY = readPan("--map-pan-y");
            wasDragged = false;
            map.classList.add("is-panning");
            map.setPointerCapture(pointerId);
        });

        map.addEventListener("pointermove", (event) => {
            if (event.pointerId !== pointerId) return;
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) wasDragged = true;
            if (!wasDragged) return;
            event.preventDefault();
            applyPan(originX + deltaX, originY + deltaY);
        });

        const stopPanning = (event) => {
            if (event.pointerId !== pointerId) return;
            if (map.hasPointerCapture(pointerId)) map.releasePointerCapture(pointerId);
            pointerId = null;
            map.classList.remove("is-panning");
        };
        map.addEventListener("pointerup", stopPanning);
        map.addEventListener("pointercancel", stopPanning);

        map.addEventListener("click", (event) => {
            if (!wasDragged) return;
            event.preventDefault();
            event.stopPropagation();
            wasDragged = false;
        });
    }

    function initMap() {
        const { pageParams } = app;
        document.querySelectorAll(".store-map-pin[data-store-name]").forEach((marker) => {
            if (marker.querySelector(".store-pin-label")) return;
            const label = document.createElement("span");
            label.className = "pin-label store-pin-label";
            label.textContent = marker.dataset.storeName;
            marker.append(label);
        });

        document.querySelectorAll(".map[data-zoom]").forEach((map) => {
            prepareMapZoomLayer(map);
            setMapZoom(map, pageParams.get("zoom") || map.dataset.zoom);
            enableMapPan(map);
        });
    }

    Object.assign(app, { setMapZoom, centerOnMyLocation, setMapStatusFilter, initMap });
})();
