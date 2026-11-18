const iconSprite = `
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
<symbol id="back" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="filter" viewBox="0 0 24 24"><path d="M4 5h16l-6.2 7v5.2l-3.6 1.8v-7L4 5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="refresh" viewBox="0 0 24 24"><path d="M20 7v5h-5M4 17v-5h5M18.2 9A7 7 0 0 0 6.1 6.3L4 9m2 6a7 7 0 0 0 12.1 2.7L20 15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" stroke-width="1.7"/></symbol>
<symbol id="chart" viewBox="0 0 24 24"><path d="M5 19V9m5 10V5m5 14v-7m4 7V3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
<symbol id="list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor"/></symbol>
<symbol id="person" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4.5 21c.4-5 3.2-7.5 7.5-7.5s7.1 2.5 7.5 7.5" fill="currentColor"/></symbol>
<symbol id="users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 20c.3-4.3 2.5-6.5 6.5-6.5s6.2 2.2 6.5 6.5M15 14.3c3.7.1 5.8 2 6 5.7" fill="none" stroke="currentColor" stroke-width="1.7"/></symbol>
<symbol id="store" viewBox="0 0 24 24"><path d="M4 9h16v11H4zM3 9l2-5h14l2 5M3 9c0 2 3.5 2 3.5 0 0 2 3.5 2 3.5 0 0 2 4 2 4 0 0 2 3.5 2 3.5 0 0 2 3.5 2 3.5 0M9 20v-5h6v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></symbol>
<symbol id="search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15 15 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="pin" viewBox="0 0 24 24"><path d="M12 22s7-6.4 7-13a7 7 0 1 0-14 0c0 6.6 7 13 7 13Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" fill="currentColor"/></symbol>
<symbol id="clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
<symbol id="report" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" stroke-width="1.7"/></symbol>
<symbol id="route" viewBox="0 0 24 24"><circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 18h2.5c5 0 1-12 5.5-12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2.5 2.5"/></symbol>
<symbol id="info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10v7" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7" r="1.2" fill="currentColor"/></symbol>
<symbol id="warning" viewBox="0 0 24 24"><path d="M12 3 2.5 20h19L12 3Z" fill="currentColor"/><path d="M12 8v6" stroke="#fff" stroke-width="2"/><circle cx="12" cy="17" r="1" fill="#fff"/></symbol>
<symbol id="play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="m10 8 6 4-6 4V8Z" fill="currentColor"/></symbol>
<symbol id="check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z" fill="currentColor"/></symbol>
<symbol id="close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></symbol>
<symbol id="camera" viewBox="0 0 24 24"><path d="M4 7h3l1.5-2h7L17 7h3v12H4V7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
<symbol id="chevron" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
<symbol id="briefcase" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 7V4h6v3M3 12h18" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
<symbol id="pulse" viewBox="0 0 24 24"><path d="M2 13h5l2-7 4 13 2.5-8 1.5 2h5" fill="none" stroke="currentColor" stroke-width="1.8"/></symbol>
</svg>`;

document.body.insertAdjacentHTML("afterbegin", iconSprite);
document.querySelectorAll('use[href*="icons.svg#"]').forEach((use) => {
    use.setAttribute("href", `#${use.getAttribute("href").split("#")[1]}`);
});

function goBack(fallback = "01-map-overview.html") {
    if (window.history.length > 1) {
        window.history.back();
        return;
    }
    window.location.href = fallback;
}

const storeClusters = {
    north: ["an-phu", "minh-tam", "nguyen-van-linh"],
    center: ["hoang-dieu", "phu-my"],
    south: ["tan-thuan", "minh-khai", "binh-phu"],
};

const mapAreas = {
    "thu-duc": { name: "Quận Thủ Đức", employees: 12, stores: 40, stats: { plane: 12, working: 4, completed: 4, idle: 2 } },
    "binh-thanh": { name: "Quận Bình Thạnh", employees: 9, stores: 40, stats: { plane: 9, working: 2, completed: 2, idle: 1 } },
};
const overallMapStats = { plane: 21, working: 6, completed: 6, idle: 3 };

function setMapAreaStats(phone, areaKey) {
    if (!phone) return;
    const stats = areaKey ? mapAreas[areaKey]?.stats : overallMapStats;
    if (!stats) return;

    phone.querySelectorAll("[data-map-stat]").forEach((stat) => {
        const value = stats[stat.dataset.mapStat];
        const number = stat.querySelector("b");
        if (number && Number.isFinite(value)) number.textContent = String(value);
    });
}

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

function addMapStores() {
    const map = document.querySelector(".overview-page .map");
    if (!map || map.querySelector("[data-store-id='thu-duc-01']")) return;

    // A fixed shuffled order avoids a visual stripe of the same colour.
    const statusOrder = [
        "complete", "pending", "failed", "in-progress", "pending", "complete", "in-progress", "failed",
        "in-progress", "failed", "pending", "complete", "failed", "complete", "pending", "in-progress",
        "pending", "in-progress", "complete", "failed", "complete", "failed", "in-progress", "pending",
        "failed", "pending", "complete", "in-progress", "in-progress", "complete", "failed", "pending",
    ];
    // Deliberately uneven points so stores feel naturally scattered, not gridded.
    const scatterPoints = [
        [0.06, 0.11], [0.45, 0.05], [0.23, 0.19], [0.79, 0.12],
        [0.94, 0.27], [0.11, 0.33], [0.61, 0.29], [0.34, 0.40],
        [0.72, 0.45], [0.02, 0.52], [0.51, 0.56], [0.88, 0.60],
        [0.20, 0.67], [0.39, 0.74], [0.66, 0.70], [0.97, 0.79],
        [0.08, 0.87], [0.28, 0.92], [0.56, 0.84], [0.81, 0.94],
        [0.15, 0.04], [0.93, 0.08], [0.42, 0.25], [0.69, 0.36],
        [0.30, 0.50], [0.57, 0.64], [0.84, 0.53], [0.04, 0.73],
        [0.24, 0.80], [0.47, 0.97], [0.75, 0.86], [0.99, 0.44],
    ];
    const areaConfig = {
        "thu-duc": {
            prefix: "Thủ Đức",
            start: 1,
            bounds: [59, 93, 14, 82],
        },
        "binh-thanh": {
            prefix: "Bình Thạnh",
            start: 1,
            bounds: [4, 40, 14, 82],
        },
    };

    Object.entries(areaConfig).forEach(([area, config]) => {
        for (let index = 0; index < 32; index += 1) {
            const number = String(config.start + index).padStart(2, "0");
            const marker = document.createElement("div");
            marker.className = "store-map-pin generated-store";
            const statusOffset = area === "thu-duc" ? 0 : 11;
            marker.dataset.visitStatus = statusOrder[(index * 7 + statusOffset) % statusOrder.length];
            marker.dataset.area = area;
            marker.dataset.modalTarget = "store-info-modal";
            marker.dataset.focus = `${area}-${number}`;
            marker.dataset.storeId = `${area}-${number}`;
            marker.dataset.storeName = `CH ${config.prefix} ${number}`;
            marker.dataset.storeCode = `CH${area === "thu-duc" ? "TD" : "BT"}${number}`;
            marker.dataset.storeAddress = `Khu vực ${config.prefix}, TP. Hồ Chí Minh`;
            marker.dataset.storeDistance = `${(1 + index * 0.2).toFixed(1).replace(".", ",")} km`;
            marker.setAttribute("role", "button");
            marker.tabIndex = 0;
            const [leftMin, leftMax, topMin, topMax] = config.bounds;
            const [scatterX, scatterY] = scatterPoints[index];
            const left = leftMin + (leftMax - leftMin) * scatterX;
            const top = topMin + (topMax - topMin) * scatterY;
            marker.style.left = `${left}%`;
            marker.style.top = `${top}%`;
            marker.innerHTML = '<span class="pin-core"><svg class="ico"><use href="#store" /></svg></span>';
            map.append(marker);
        }
    });
}

addMapStores();

function addMapEmployees() {
    const map = document.querySelector(".overview-page .map");
    if (!map || map.querySelector("[data-generated-employee]")) return;

    const employees = [
        ["Nguyễn Thị Mai", "thu-duc", 62, 17, "Mai"],
        ["Phạm Quốc Bảo", "thu-duc", 80, 31, "Bảo"],
        ["Võ Minh Tuấn", "binh-thanh", 25, 66, "Tuấn"],
    ];

    employees.forEach(([name, area, left, top, shortName], index) => {
        const marker = document.createElement("div");
        marker.className = "named-pin employee-pin generated-employee";
        marker.dataset.generatedEmployee = "";
        marker.dataset.area = area;
        marker.dataset.visitStatus = "in-progress";
        marker.dataset.modalTarget = "employee-info-modal";
        marker.dataset.focus = `employee-${index + 4}`;
        marker.dataset.name = name;
        marker.dataset.avatar = ["assets/images/avatar-an.svg", "assets/images/avatar-binh.svg", "assets/images/avatar-huy.svg"][index % 3];
        marker.dataset.status = "Đang làm việc";
        marker.dataset.statusClass = "blue";
        marker.dataset.store = `CH ${area === "thu-duc" ? "Thủ Đức" : "Bình Thạnh"} ${(index + 4).toString().padStart(2, "0")}`;
        marker.dataset.gps = `${String(9 + (index % 2)).padStart(2, "0")}:${String(10 + index * 2).padStart(2, "0")} (vừa cập nhật)`;
        marker.setAttribute("role", "button");
        marker.tabIndex = 0;
        marker.style.left = `${left}%`;
        marker.style.top = `${top}%`;
        marker.innerHTML = `<span class="pin-core"><svg class="ico"><use href="#person" /></svg></span><span class="pin-label">${name}</span>`;
        map.append(marker);
    });
}

addMapEmployees();

// Keep the map readable at every distance: 80 individual stores at close zoom,
// then groups of five, and finally one total per operational area.
function addMapStoreGroups() {
    const map = document.querySelector(".overview-page .map");
    if (!map || map.querySelector(".store-cluster.sub-cluster")) return;

    const groupPositions = {
        "thu-duc": [
            [63, 20], [73, 27], [84, 20], [92, 32],
            [64, 55], [76, 66], [87, 56], [92, 76],
        ],
        "binh-thanh": [
            [7, 21], [18, 31], [30, 20], [40, 33],
            [8, 57], [18, 72], [30, 58], [40, 76],
        ],
    };

    Object.entries(groupPositions).forEach(([area, positions]) => {
        positions.forEach(([left, top], index) => {
            const group = document.createElement("button");
            group.type = "button";
            group.className = "store-cluster sub-cluster";
            group.dataset.mapArea = area;
            group.style.left = `${left}%`;
            group.style.top = `${top}%`;
            group.setAttribute("aria-label", `Nhóm 5 cửa hàng ${index + 1} tại ${mapAreas[area].name}`);
            group.innerHTML = "<span>5</span>";
            map.append(group);
        });
    });
}

addMapStoreGroups();

function updateMapClusterCounts(map, selectedStatuses = new Set()) {
    map.querySelectorAll(".store-cluster[data-map-area]:not(.sub-cluster)").forEach((cluster) => {
        const total = [...map.querySelectorAll(`.store-map-pin[data-area="${cluster.dataset.mapArea}"]`)]
            .filter((store) => !selectedStatuses.size || selectedStatuses.has(store.dataset.visitStatus))
            .length;
        const count = cluster.querySelector("span");
        if (count) count.textContent = String(total);
        cluster.setAttribute("aria-label", `${total} cửa hàng tại ${mapAreas[cluster.dataset.mapArea]?.name || "khu vực"}`);
    });
}

document.querySelectorAll(".overview-page .map").forEach((map) => updateMapClusterCounts(map));

document.querySelectorAll(".store-map-pin[data-store-name]").forEach((marker) => {
    if (marker.querySelector(".store-pin-label")) return;
    const label = document.createElement("span");
    label.className = "pin-label store-pin-label";
    label.textContent = marker.dataset.storeName;
    marker.append(label);
});

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
    resetMapFocus(phone);
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

    updateMapClusterCounts(map, selectedStatuses);

    sheet.querySelectorAll("[data-map-status-filter]").forEach((chip) => {
        const isActive = selectedStatuses.has(chip.dataset.mapStatusFilter);
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));
    });
}

function focusMapArea(control) {
    const map = control.closest(".map");
    const areaKey = control.dataset.mapArea;
    const area = mapAreas[areaKey];
    if (!map || !area) return;

    const shouldClear = map.dataset.areaFocus === areaKey;
    if (shouldClear) {
        delete map.dataset.areaFocus;
        map.querySelectorAll(".store-map-pin, .employee-pin").forEach((marker) => marker.classList.remove("is-outside-area"));
        map.querySelectorAll("[data-map-area]").forEach((label) => label.classList.remove("is-active"));
        map.style.setProperty("--map-pan-x", "0px");
        map.style.setProperty("--map-pan-y", "0px");
        setMapAreaStats(map.closest(".phone"));
        setMapZoom(map, 12);
        return;
    }

    map.dataset.areaFocus = areaKey;
    map.querySelectorAll(".store-map-pin, .employee-pin").forEach((marker) => {
        marker.classList.toggle("is-outside-area", marker.dataset.area !== areaKey);
    });
    map.querySelectorAll("[data-map-area]").forEach((label) => {
        label.classList.toggle("is-active", label === control);
    });
    map.style.setProperty("--map-pan-x", areaKey === "binh-thanh" ? "72px" : "-72px");
    map.style.setProperty("--map-pan-y", "0px");
    setMapAreaStats(map.closest(".phone"), areaKey);
    setMapZoom(map, 16);
}

function getMapAreaKey(areaName = "") {
    const normalized = String(areaName)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("vi")
        .replace(/đ/g, "d")
        .trim();

    if (normalized.includes("binh thanh")) return "binh-thanh";
    if (normalized.includes("thu duc")) return "thu-duc";
    return "";
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
        status.classList.remove("green", "blue", "orange", "red");
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
    if (trigger.dataset.storeName) {
        fillStoreModal(modal, trigger);
        setMapAreaStats(phone, trigger.dataset.area);
    }

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
    setMapZoom(map, 16);

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

document.addEventListener("click", (event) => {
    const areaControl = event.target.closest("[data-map-area]");
    if (areaControl) {
        focusMapArea(areaControl);
        return;
    }

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
        if (navigation.hasAttribute("data-back")) {
            goBack(navigation.dataset.href);
            return;
        }
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

    const navigation = event.target.closest("[data-href], [data-back]");
    if (!navigation) return;
    event.preventDefault();
    if (navigation.hasAttribute("data-back")) {
        goBack(navigation.dataset.href);
        return;
    }
    location.href = navigation.dataset.href;
});

const pageParams = new URLSearchParams(location.search);

const workingEmployeeList = document.querySelector(".working-list-body .employee-list");
if (workingEmployeeList) {
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
    const showAllEmployees = pageParams.get("view") === "all";
    (showAllEmployees ? extraEmployees : []).forEach(([name, store, avatar, gps]) => {
        const card = document.createElement("article");
        card.className = "card active-card";
        card.dataset.employeeCard = "";
        card.dataset.employeeName = name;
        card.dataset.employeeStore = store;
        card.innerHTML = `<div class="card-head"><img class="avatar" src="${avatar}" alt="${name}" /><div><div class="person-name">${name}</div><span class="badge green">Đang IN</span></div><svg class="ico"><use href="#chevron" /></svg></div><div class="info-lines"><div class="info-line"><svg class="ico"><use href="#store" /></svg><span>Đang tại: ${store}</span></div><div class="info-line"><svg class="ico"><use href="#pin" /></svg><span>GPS cập nhật ${gps}</span></div><div class="info-line subtle"><svg class="ico"><use href="#report" /></svg><span>Còn 2 cửa hàng trong lộ trình</span></div></div>`;
        workingEmployeeList.insertBefore(card, workingEmployeeList.querySelector(".out-empty"));
    });
    if (!showAllEmployees) [...workingEmployeeList.querySelectorAll("[data-employee-card]")].slice(6).forEach((card) => card.remove());
    workingEmployeeList.closest(".working-list-body").querySelector("[data-employee-count]").textContent = showAllEmployees ? "21" : "6";
    const workingTitle = document.querySelector(".working-list-body").closest(".phone")?.querySelector(".appbar h1");
    if (workingTitle) workingTitle.textContent = showAllEmployees ? "Danh sách nhân viên" : "Nhân viên đang IN";
    workingEmployeeList.querySelectorAll("[data-employee-card]").forEach((card, index) => {
        const lines = card.querySelectorAll(".info-line span");
        const avatar = card.querySelector(".avatar");
        card.removeAttribute("data-href");
        card.dataset.modalTarget = "employee-info-modal";
        card.dataset.focus = `list-${index}`;
        card.dataset.name = card.dataset.employeeName || card.querySelector(".person-name")?.textContent.trim();
        card.dataset.store = card.dataset.employeeStore || lines[0]?.textContent.replace(/^Đang tại:\s*/, "").trim();
        card.dataset.gps = lines[1]?.textContent.replace(/^GPS cập nhật\s*/, "").trim() || "Chưa có dữ liệu";
        card.dataset.avatar = avatar?.getAttribute("src") || "assets/images/avatar-an.svg";
        card.dataset.status = "Đang làm việc";
        card.dataset.statusClass = "blue";
    });
}

const employeeSearch = document.querySelector("[data-employee-search]");
if (employeeSearch) {
    const employeeCards = [...document.querySelectorAll("[data-employee-card]")];
    const resultCount = document.querySelector("[data-employee-count]");
    const emptyState = document.querySelector(".out-empty");

    employeeSearch.addEventListener("input", () => {
        const query = employeeSearch.value.trim().toLocaleLowerCase("vi");
        const visibleCards = employeeCards.filter((card) => {
            const matches = `${card.dataset.employeeName} ${card.dataset.employeeStore}`
                .toLocaleLowerCase("vi")
                .includes(query);
            card.hidden = !matches;
            return matches;
        });

        if (resultCount) resultCount.textContent = String(visibleCards.length);
        if (emptyState) emptyState.hidden = visibleCards.length > 0;
    });
}

document.querySelectorAll(".map[data-zoom]").forEach((map) => {
    prepareMapZoomLayer(map);
    setMapZoom(map, pageParams.get("zoom") || map.dataset.zoom);
    enableMapPan(map);
});

const requestedArea = getMapAreaKey(pageParams.get("area"));
if (requestedArea) {
    const map = document.querySelector(".overview-page .map");
    const areaControl = map?.querySelector(`[data-map-area="${requestedArea}"]`);
    if (areaControl) focusMapArea(areaControl);
}

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

const filterForm = document.querySelector("[data-filter-form]");
const resetFilters = document.querySelector("[data-reset-filters]");
const applyFilters = document.querySelector("[data-apply-filters]");

if (filterForm && resetFilters) {
    resetFilters.addEventListener("click", () => {
        filterForm.reset();
        filterForm.querySelectorAll(".switch").forEach((toggle) => {
            toggle.classList.add("on");
            toggle.setAttribute("aria-pressed", "true");
        });
        const toast = filterForm.closest(".phone")?.querySelector(".toast");
        if (toast) {
            toast.textContent = "Đã đặt lại bộ lọc";
            toast.classList.add("show");
            window.setTimeout(() => toast.classList.remove("show"), 1500);
        }
    });
}

if (filterForm && applyFilters) {
    applyFilters.addEventListener("click", () => {
        const params = new URLSearchParams();
        new FormData(filterForm).forEach((value, key) => {
            if (String(value).trim()) params.set(key, String(value).trim());
        });
        location.href = `01-map-overview.html${params.size ? `?${params}` : ""}`;
    });
}

document.querySelectorAll("[data-filter-options]").forEach((input) => {
    const options = input.dataset.filterOptions.split("|");
    const list = document.createElement("ul");
    list.className = "filter-options";
    list.hidden = true;
    input.insertAdjacentElement("afterend", list);

    const renderOptions = () => {
        const query = input.value.trim().toLocaleLowerCase("vi");
        const matches = options.filter((option) =>
            option.toLocaleLowerCase("vi").includes(query),
        );
        list.replaceChildren();
        matches.forEach((option) => {
            const item = document.createElement("li");
            const choice = document.createElement("button");
            choice.type = "button";
            choice.textContent = option;
            choice.addEventListener("mousedown", (event) => event.preventDefault());
            choice.addEventListener("click", () => {
                input.value = option;
                list.hidden = true;
                input.focus();
            });
            item.append(choice);
            list.append(item);
        });
        list.hidden = matches.length === 0;
    };

    input.addEventListener("focus", renderOptions);
    input.addEventListener("input", renderOptions);
    input.addEventListener("blur", () => window.setTimeout(() => {
        list.hidden = true;
    }, 120));
});

document.querySelectorAll(".checkin-tabs button").forEach((tab) => {
    tab.addEventListener("click", () => {
        tab.closest(".checkin-tabs").querySelectorAll("button").forEach((item) => {
            item.classList.toggle("active", item === tab);
        });
    });
});

document.querySelectorAll(".rating-stars").forEach((rating) => {
    const stars = [...rating.querySelectorAll("button")];
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            stars.forEach((item, itemIndex) => {
                item.classList.toggle("selected", itemIndex <= index);
            });
        });
    });
});

const reportForm = document.querySelector("[data-report-form]");
const viewStoreReport = document.querySelector("[data-view-store-report]");
if (reportForm && viewStoreReport) {
    let selectedReportEmployee = "";
    let selectedReportChoice = null;
    const reportPhone = reportForm.closest(".phone");
    reportForm.querySelectorAll("[data-report-employee]").forEach((choice) => {
        choice.addEventListener("click", () => {
            selectedReportEmployee = choice.dataset.reportEmployee;
            selectedReportChoice = choice;
            reportForm.querySelectorAll("[data-report-employee]").forEach((item) => {
                const selected = item === choice;
                item.classList.toggle("is-selected", selected);
                item.setAttribute("aria-pressed", String(selected));
            });
            viewStoreReport.disabled = false;
        });
    });
    viewStoreReport.addEventListener("click", () => {
        const phone = reportForm.closest(".phone");
        const toast = phone?.querySelector(".toast");
        if (!selectedReportEmployee) {
            if (toast) {
                toast.textContent = "Vui lòng chọn nhân viên có hoạt động tại cửa hàng";
                toast.classList.add("show");
                window.setTimeout(() => toast.classList.remove("show"), 1600);
            }
            return;
        }
        phone.querySelector("[data-report-employee-name]").textContent = selectedReportEmployee;
        phone.querySelector("[data-report-context]").style.display = "none";
        phone.querySelector("[data-report-results]").hidden = false;
        phone.querySelector("[data-report-empty]").hidden = true;
        phone.querySelector("[data-report-empty]").style.display = "none";
        reportForm.hidden = true;
        reportForm.style.display = "none";
        phone.querySelector("[data-report-results]").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    reportPhone?.querySelector("[data-change-report]")?.addEventListener("click", () => {
        reportForm.hidden = false;
        reportForm.style.removeProperty("display");
        reportPhone.querySelector("[data-report-context]").style.removeProperty("display");
        reportPhone.querySelector("[data-report-results]").hidden = true;
        reportPhone.querySelector("[data-report-empty]").hidden = false;
        reportPhone.querySelector("[data-report-empty]").style.removeProperty("display");
        reportForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

const requestedReportEmployee = pageParams.get("employee")?.trim();
if (requestedReportEmployee && reportForm) {
    const reportPhone = reportForm.closest(".phone");
    const reportResults = reportPhone?.querySelector("[data-report-results]");
    if (reportResults) {
        reportPhone.querySelector("[data-report-employee-name]").textContent = requestedReportEmployee;
        reportPhone.querySelector("[data-report-context]").style.display = "none";
        reportForm.hidden = true;
        reportForm.style.display = "none";
        reportPhone.querySelector("[data-report-empty]").hidden = true;
        reportPhone.querySelector("[data-report-empty]").style.display = "none";
        reportResults.hidden = false;
        const changeEmployeeButton = reportResults.querySelector("[data-change-report]");
        if (changeEmployeeButton) changeEmployeeButton.style.display = "none";
        reportResults.querySelectorAll("[data-href]").forEach((record) => {
            const separator = record.dataset.href.includes("?") ? "&" : "?";
            record.dataset.href = `${record.dataset.href}${separator}employee=${encodeURIComponent(requestedReportEmployee)}`;
        });
    }
}

const activityDetail = document.querySelector("[data-activity-detail]");
if (activityDetail) {
    const activityType = pageParams.get("type") || "attendance";
    const activityItem = pageParams.get("item") || "1";
    const activityDetails = {
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
    const detail = activityDetails[activityType] || activityDetails.attendance;
    const statusClass = activityType === "attendance" ? "green" : "orange";
    const reportEmployee = pageParams.get("employee") || "Nguyễn Văn An";
    activityDetail.innerHTML = `<div class="activity-title"><span class="badge ${statusClass}">${detail.status}</span><h2>${detail.title}</h2><p>${detail.time}</p></div><div class="activity-proof"><svg class="ico"><use href="#camera" /></svg><span>Ảnh xác nhận và thông tin thực hiện</span></div><div class="activity-rows">${detail.rows.map(([label, value]) => `<div><span>${label}</span><b>${value === "Nguyễn Văn An" ? reportEmployee : value}</b></div>`).join("")}</div><button class="btn primary" type="button" data-back data-href="10-store-report.html">Quay lại báo cáo</button>`;
}

const requestedStore = pageParams.get("store")?.trim().toLocaleLowerCase("vi");
const completionProfiles = {
    mai: { name: "Nguyễn Thị Mai", initials: "NM", done: 3, total: 3, monthlyLimit: 80 },
    bao: { name: "Phạm Quốc Bảo", initials: "PB", done: 2, total: 2, monthlyLimit: 80 },
    tuan: { name: "Võ Minh Tuấn", initials: "VT", done: 4, total: 4, monthlyLimit: 80 },
};

document.querySelectorAll(".completed-card").forEach((card) => {
    const cardName = card.dataset.employeeName || "";
    const profileKey = cardName.includes("Bảo") ? "bao" : cardName.includes("Tuấn") ? "tuan" : "mai";
    const profile = completionProfiles[profileKey];
    const link = card.querySelector(".completed-total-link");
    if (link) {
        const stores = [
            ["CH An Phú", "an-phu"],
            ["CH Minh Khai", "minh-khai"],
            ["CH Hoàng Diệu", "hoang-dieu"],
            ["CH Nguyễn Văn Linh", "nguyen-van-linh"],
        ].slice(0, profile.total);
        const storeList = document.createElement("ul");
        storeList.className = "completed-store-inline-list";
        storeList.hidden = true;
        storeList.innerHTML = stores.map(([name, slug], index) =>
            `<li><button type="button" data-href="04-store-detail.html?store=${slug}&employee=${profileKey}"><i>${index + 1}</i><span>${name}</span><svg class="ico"><use href="#chevron" /></svg></button></li>`,
        ).join("");
        link.removeAttribute("data-href");
        link.setAttribute("aria-expanded", "false");
        link.setAttribute("aria-label", `Xem ${profile.done} cửa hàng đã hoàn thành của ${profile.name}`);
        link.querySelector("span").innerHTML = `<b>${profile.done}/${profile.total}</b> cửa hàng đã hoàn thành hôm nay`;
        link.insertAdjacentElement("afterend", storeList);
        link.addEventListener("click", () => {
            const willOpen = link.getAttribute("aria-expanded") !== "true";
            card.closest(".employee-list")?.querySelectorAll(".completed-total-link[aria-expanded='true']").forEach((openLink) => {
                openLink.setAttribute("aria-expanded", "false");
                openLink.nextElementSibling.hidden = true;
            });
            link.setAttribute("aria-expanded", String(willOpen));
            storeList.hidden = !willOpen;
        });
    }
});

const completedStorePage = document.querySelector(".completed-stores-page");
if (completedStorePage) {
    const profileKey = pageParams.get("employee") || "mai";
    const profile = completionProfiles[profileKey] || completionProfiles.mai;
    const stores = [
        ["CH An Phú", "an-phu"],
        ["CH Minh Khai", "minh-khai"],
        ["CH Hoàng Diệu", "hoang-dieu"],
        ["CH Nguyễn Văn Linh", "nguyen-van-linh"],
    ].slice(0, profile.total);
    const employeeHead = completedStorePage.querySelector(".completed-employee");
    employeeHead.querySelector(".completed-avatar").textContent = profile.initials;
    employeeHead.querySelector("b").textContent = profile.name;
    employeeHead.querySelector("small").textContent = `Đã hoàn thành ${profile.done}/${profile.total} cửa hàng hôm nay`;
    completedStorePage.querySelector(".completed-hint").textContent = "Cửa hàng hoàn thành có thể bấm để xem chi tiết.";
    const storeList = completedStorePage.querySelector(".completed-store-list");
    storeList.replaceChildren();
    stores.forEach(([name, slug], index) => {
        const completed = index < profile.done;
        const button = document.createElement("button");
        button.className = completed ? "is-complete" : "is-pending";
        if (completed) button.dataset.href = `04-store-detail.html?store=${slug}&employee=${profileKey}`;
        else button.disabled = true;
        button.innerHTML = `<i>${index + 1}</i><span><b>${name}</b><small>${completed ? "Đã hoàn thành lượt ghé" : "Chưa hoàn thành"}</small></span><svg class="ico"><use href="#chevron" /></svg>`;
        storeList.append(button);
    });
}
const storeDetail = document.querySelector(".store-panel");
if (storeDetail && requestedStore) {
    const storeDetails = {
        "an-phu": { name: "CH An Phú", code: "CH001", address: "Số 123 Nguyễn Văn Linh, P. Tân Phú, Q.7, TP. Hồ Chí Minh", distance: "30 m" },
        "minh-khai": { name: "CH Minh Khai", code: "CH002", address: "Số 58 Minh Khai, P. Vĩnh Tuy, Q. Hai Bà Trưng, Hà Nội", distance: "120 m" },
        "hoang-dieu": { name: "CH Hoàng Diệu", code: "CH003", address: "Số 86 Hoàng Diệu, P. Hải Châu, Q. Hải Châu, Đà Nẵng", distance: "65 m" },
    };
    const detail = storeDetails[requestedStore];
    if (detail) {
        const title = storeDetail.querySelector(".store-title .person-name");
        const code = storeDetail.querySelector(".store-title small");
        const lines = storeDetail.querySelectorAll(".info-line span");
        if (title) title.textContent = detail.name;
        if (code) code.textContent = `Mã CH: ${detail.code}`;
        if (lines[0]) lines[0].innerHTML = detail.address;
        if (lines[1]) lines[1].innerHTML = `Khoảng cách đến cửa hàng: <b>${detail.distance}</b>`;
    }
}
const requestedEmployee = pageParams.get("employee")?.trim().toLocaleLowerCase("vi");
if (storeDetail && completionProfiles[requestedEmployee]) {
    const completedProfile = completionProfiles[requestedEmployee];
    const heading = storeDetail.querySelector(".subheading");
    const employeeRows = storeDetail.querySelectorAll(":scope > .employee");
    employeeRows.forEach((row) => { row.remove(); });
    if (heading) {
        const otherWorkers = [
            { name: "Nguyễn Văn An", initials: "NA", status: "Đang làm việc", statusClass: "blue", time: "IN 08:02 · Đang làm" },
            { name: "Phạm Quốc Bảo", initials: "PB", status: "Hoàn thành", statusClass: "green", time: "IN 08:00 · OUT 09:05" },
            { name: "Lê Văn Huy", initials: "LH", status: "Hoàn thành", statusClass: "green", time: "IN 09:12 · OUT 09:38" },
        ].filter((worker) => worker.name !== completedProfile.name);
        const workers = [
            { name: completedProfile.name, initials: completedProfile.initials, status: "Hoàn thành", statusClass: "green", time: "IN 08:00 · OUT 09:05" },
            ...otherWorkers,
        ];

        heading.textContent = `Nhân viên đã làm tại cửa hàng (${workers.length})`;
        workers.slice().reverse().forEach((worker) => {
            const employee = document.createElement("div");
            employee.className = "employee";
            employee.dataset.employeeWorkStatus = worker.statusClass === "blue" ? "working" : "complete";
            employee.innerHTML = `<span class="avatar completed-avatar">${worker.initials}</span><div><b style="font-size: 10px">${worker.name}</b><br /><span class="badge ${worker.statusClass}">${worker.status}</span></div><small class="employee-time">${worker.time}</small><svg class="ico"><use href="#chevron" /></svg>`;
            heading.insertAdjacentElement("afterend", employee);
        });
    }
    const employeeReportButton = document.querySelector("[data-store-employee-report]");
    if (employeeReportButton) {
        employeeReportButton.dataset.href = `10-store-report.html?employee=${encodeURIComponent(completedProfile.name)}&store=${requestedStore || "an-phu"}`;
        employeeReportButton.innerHTML = '<svg class="ico"><use href="#chart" /></svg>Xem báo cáo nhân viên';
    }
}

function setupStoreEmployeeFilters(panel) {
    const heading = panel?.querySelector(".subheading");
    if (!heading || panel.querySelector(".store-employee-filters")) return;

    const times = {
        "Nguyễn Văn An": "IN 08:02 · Đang làm",
        "Phạm Quốc Bảo": "IN 08:00 · OUT 09:05",
        "Lê Văn Huy": "IN 09:12 · OUT 09:38",
        "Nguyễn Thị Mai": "IN 08:20 · OUT 09:05",
        "Võ Minh Tuấn": "IN 08:10 · OUT 09:00",
    };
    const employees = [...panel.querySelectorAll(":scope > .employee")];
    const filters = document.createElement("div");
    filters.className = "store-employee-filters";
    filters.setAttribute("role", "group");
    filters.setAttribute("aria-label", "Lọc trạng thái nhân viên");
    filters.innerHTML = '<button type="button" class="is-active working" data-store-employee-filter="working" aria-pressed="true">Đang làm việc</button><button type="button" class="is-active complete" data-store-employee-filter="complete" aria-pressed="true">Hoàn thành</button>';
    heading.insertAdjacentElement("afterend", filters);

    employees.forEach((employee) => {
        const badge = employee.querySelector(".badge");
        const status = employee.dataset.employeeWorkStatus || (badge?.classList.contains("blue") ? "working" : "complete");
        employee.dataset.employeeWorkStatus = status;
        if (!employee.querySelector(".employee-time")) {
            const name = employee.querySelector("b")?.textContent.trim();
            const time = document.createElement("small");
            time.className = "employee-time";
            time.textContent = times[name] || (status === "working" ? "IN 08:02 · Đang làm" : "IN 08:00 · OUT 09:05");
            employee.insertBefore(time, employee.querySelector(":scope > .ico"));
        }
    });

    const selected = new Set(["working", "complete"]);
    filters.addEventListener("click", (event) => {
        const filter = event.target.closest("[data-store-employee-filter]");
        if (!filter) return;
        const status = filter.dataset.storeEmployeeFilter;
        if (selected.has(status)) selected.delete(status);
        else selected.add(status);
        filters.querySelectorAll("[data-store-employee-filter]").forEach((button) => {
            const active = selected.has(button.dataset.storeEmployeeFilter);
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        employees.forEach((employee) => {
            employee.hidden = !selected.has(employee.dataset.employeeWorkStatus);
        });
    });
}

setupStoreEmployeeFilters(storeDetail);

if (requestedStore) {
    const matchingStores = [...document.querySelectorAll(".store-map-pin[data-store-name]")]
        .filter((store) => store.dataset.storeName.toLocaleLowerCase("vi").includes(requestedStore));
    const store = matchingStores[0];
    if (store) {
        store.classList.add("is-searched-store");
        const map = store.closest(".map");
        if (map?.dataset.zoom) setMapZoom(map, 16);
        window.setTimeout(() => openInfoModal(store), 180);
    }
}
