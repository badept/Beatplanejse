/* Adapter Leaflet riêng cho dashboard; không thay bản đồ mô phỏng của các trang cũ. */
(() => {
    const app = (window.ViewMapDashboard ||= {});
    const config = { tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' };

    function createMapProvider(container, { onSelect, onHealth }) {
        if (!window.L || !L.markerClusterGroup) {
            container.replaceChildren();
            const message = document.createElement("p");
            message.className = "map-unavailable";
            message.textContent = "Không tải được thư viện bản đồ. Bạn vẫn có thể xem danh sách và báo cáo bên phải.";
            container.append(message);
            onHealth("error");
            return { update() {}, focus() {}, route() {}, fit() {}, resize() {}, zoom() {}, destroy() {} };
        }
        const map = L.map(container, { zoomControl: false, minZoom: 4, maxZoom: 18, preferCanvas: true }).setView([16.1, 106.4], 6);
        L.control.zoom({ position: "bottomleft" }).addTo(map);
        L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);
        if (app.geography) {
            map.createPane("geography-fallback").style.zIndex = "150";
            L.geoJSON(app.geography, { pane: "geography-fallback", renderer: L.svg({ pane: "geography-fallback" }), interactive: false, style: feature => ({ color: "#adc4b6", weight: 1, fillColor: feature.properties.name === "Vietnam" ? "#d4e8d8" : "#e9eee8", fillOpacity: 1 }) }).addTo(map);
            map.attributionControl.addAttribution('Nền tổng quan: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>');
        }
        const tiles = L.tileLayer(config.tileUrl, { attribution: config.attribution, maxZoom: 19 });
        let tileErrors = 0;
        let loadedTiles = 0;
        const healthTimer = window.setTimeout(() => { if (!loadedTiles) onHealth("offline"); }, 10000);
        tiles.on("tileload", () => { loadedTiles++; clearTimeout(healthTimer); onHealth("ready"); });
        tiles.on("tileerror", () => { tileErrors++; if (tileErrors >= 3) onHealth("offline"); });
        tiles.on("loading", () => { tileErrors = 0; });
        tiles.addTo(map);

        // Không giữ animation/callback của marker cũ khi người dùng lọc hoặc chọn liên tục.
        let activeStatus = "all";
        const displayStatus = status => activeStatus !== "all" ? activeStatus : status === "idle" ? "pending" : status;
        const cluster = L.markerClusterGroup({ maxClusterRadius: 48, showCoverageOnHover: false, spiderfyOnMaxZoom: true, animate: false, iconCreateFunction(group) {
            const statuses = new Set(group.getAllChildMarkers().map(marker => marker.options.dashboardStatus));
            const status = statuses.size === 1 ? [...statuses][0] : "mixed";
            return L.divIcon({ html: `<span>${group.getChildCount()}</span>`, className: "dashboard-cluster cluster-" + status, iconSize: [42, 42] });
        } }).addTo(map);
        const routeLayer = L.layerGroup().addTo(map);
        const selectionLayer = L.layerGroup().addTo(map);
        const legLayer = L.layerGroup().addTo(map);
        let markers = new Map();
        let visiblePoints = [];
        let selectedKey = "";
        let lastStores, lastEmployees, batchTimer, generation = 0;
        let records = new Map();

        function markerIcon(type, status, selected) {
            status = displayStatus(status);
            return L.divIcon({ className: "dashboard-marker-wrapper", html: `<span class="dashboard-marker marker-${type} marker-${status}${selected ? " is-selected" : ""}"><span aria-hidden="true">${type === "employee" ? "●" : "▦"}</span></span>`, iconSize: [30, 30], iconAnchor: [15, 15] });
        }
        function update(stores, employees, selected, status = "all") {
            legLayer.clearLayers();
            if (!map.hasLayer(cluster)) map.addLayer(cluster);
            const sameStatus = activeStatus === status;
            activeStatus = status;
            const nextKey = selected ? `${selected.type}:${selected.id}` : "";
            if (nextKey !== selectedKey) {
                selectionLayer.clearLayers();
                const previous = markers.get(selectedKey);
                if (previous) previous.marker.setIcon(markerIcon(previous.type, previous.row.status, false));
                selectedKey = nextKey;
            }
            const sameStores = lastStores === stores || lastStores?.length === 0 && stores.length === 0;
            const sameEmployees = lastEmployees === employees || lastEmployees?.length === 0 && employees.length === 0;
            if (sameStores && sameEmployees && sameStatus) return;
            lastStores = stores; lastEmployees = employees;
            const ticket = ++generation;
            clearTimeout(batchTimer);
            cluster.clearLayers();
            selectionLayer.clearLayers();
            markers = new Map();
            records = new Map();
            const items = [];
            for (const [type, rows] of [["store", stores], ["employee", employees]]) {
                for (const row of rows) {
                    if (!app.hasLocation(row)) continue;
                    const key = `${type}:${row.id}`;
                    records.set(key, { type, row });
                    items.push({ type, row, key });
                }
            }
            visiblePoints = items.map(({ row }) => [row.lat, row.lng]);
            container.dataset.markerState = "loading";
            container.dataset.markerCount = String(items.length);
            let index = 0;
            function addBatch() {
                if (ticket !== generation) return;
                const next = [];
                const end = Math.min(items.length, index + 350);
                while (index < end) {
                    const { type, row } = items[index++];
                    const key = `${type}:${row.id}`;
                    const label = type === "employee" ? `${row.name} · ${row.city}` : `${row.code || row.id} · ${row.name} · ${row.city}`;
                    const marker = L.marker([row.lat, row.lng], { icon: markerIcon(type, row.status, key === selectedKey), dashboardStatus: displayStatus(row.status), title: label, alt: label, keyboard: true });
                    const tooltip = document.createElement("span"); tooltip.textContent = label;
                    marker.bindTooltip(tooltip, { direction: "top" }).on("click", () => onSelect(type, row.id));
                    markers.set(key, { marker, type, row }); next.push(marker);
                }
                cluster.addLayers(next);
                if (index < items.length) batchTimer = setTimeout(addBatch, 8);
                else container.dataset.markerState = "ready";
            }
            addBatch();
        }
        function fit() {
            if (visiblePoints.length) map.fitBounds(L.latLngBounds(visiblePoints), { padding: [45, 45], maxZoom: 12, animate: false });
            else map.setView([16.1, 106.4], 6, { animate: false });
        }
        function focus(type, id) {
            const item = records.get(`${type}:${id}`);
            if (!item) return;
            const point = [item.row.lat, item.row.lng];
            map.setView(point, 16, { animate: false });
            selectionLayer.clearLayers();
            L.circleMarker(point, { radius: 23, color: "#087b51", weight: 2, fill: false, interactive: false }).addTo(selectionLayer);
            const label = document.createElement("span"); label.textContent = item.row.name;
            L.marker(point, { icon: markerIcon(type, item.row.status, true), zIndexOffset: 1000, title: item.row.name }).bindTooltip(label).on("click", () => onSelect(type, id)).addTo(selectionLayer).openTooltip();
        }
        function route(stores) {
            routeLayer.clearLayers();
            for (let index = 0; index < stores.length - 1; index++) {
                const a = stores[index], b = stores[index + 1];
                if (!app.hasLocation(a) || !app.hasLocation(b)) continue;
                const completed = [a, b].every(store => ["completed", "working"].includes(store.status));
                L.polyline([[a.lat, a.lng], [b.lat, b.lng]], { color: completed ? "#087b51" : "#8c9d92", weight: completed ? 4 : 3, dashArray: completed ? null : "7 7", interactive: false }).addTo(routeLayer);
            }
        }
        function fitRoute(stores) {
            const points = stores.filter(app.hasLocation).map(store => [store.lat, store.lng]);
            if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [65, 65], maxZoom: 18, animate: false });
        }
        function showLeg(a, b) {
            if (!app.hasLocation(a) || !app.hasLocation(b)) return false;
            generation++; clearTimeout(batchTimer); lastStores = undefined; lastEmployees = undefined;
            map.removeLayer(cluster); selectionLayer.clearLayers(); routeLayer.clearLayers(); legLayer.clearLayers();
            [a, b].forEach((store, index) => {
                const label = document.createElement("span"); label.textContent = (index ? "B · " : "A · ") + store.name;
                L.marker([store.lat, store.lng], { icon: markerIcon("store", store.status, false), title: label.textContent, keyboard: false }).bindTooltip(label, { permanent: true, direction: index ? "right" : "left" }).addTo(legLayer);
            });
            L.polyline([[a.lat, a.lng], [b.lat, b.lng]], { color: "#087b51", weight: 4, interactive: false }).addTo(legLayer);
            fitRoute([a, b]); container.dataset.markerState = "ready"; container.dataset.markerCount = "2";
            return true;
        }
        return { update, focus, route, fit, showLeg, fitRoute, resize: () => map.invalidateSize(), zoom: delta => map.setZoom(map.getZoom() + delta), destroy: () => { generation++; clearTimeout(batchTimer); clearTimeout(healthTimer); map.remove(); } };
    }
    Object.assign(app, { createMapProvider });
})();
