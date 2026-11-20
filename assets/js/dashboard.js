/* Điều phối dashboard chỉ đọc: một bộ lọc dùng chung cho bản đồ, danh sách và báo cáo. */
(async () => {
    "use strict";
    const app = window.ViewMapDashboard;
    try { await app.loadData(); }
    catch (error) {
        document.getElementById("map-loading").textContent = error.message;
        document.getElementById("map-loading").setAttribute("role", "alert");
        document.body.dataset.loadState = "error";
        return;
    }
    const $ = selector => document.querySelector(selector);
    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
    const number = value => new Intl.NumberFormat("vi-VN").format(value);
    const money = value => `${number(value)}đ`;
    const dateLabel = value => value.split("-").reverse().join("/");
    const params = new URLSearchParams(location.search);
    const state = {
        region: Object.hasOwn(app.regions, params.get("region")) ? params.get("region") : "all",
        city: app.cities.some(city => city.id === params.get("city")) ? params.get("city") : "all",
        date: app.availableDates.includes(params.get("date")) ? params.get("date") : app.availableDates[0],
        query: params.get("q") || "", status: "all", object: "all", mode: "overview", selected: null, sup: "all", employee: "all", location: "all", page: 0,
    };
    let employeeSearch = "";
    let storeSearch = "";
    const todayParts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const todayPart = type => todayParts.find(part => part.type === type).value;
    const today = `${todayPart("year")}-${todayPart("month")}-${todayPart("day")}`;
    const historyRange = { from: today, to: today };
    const reportRange = { from: state.date, to: state.date };
    let reportCache;
    let reportBaseDate = state.date;
    const historySnapshots = new Map();
    let snapshot = app.getSnapshot(state.date);
    let searchTimer;
    let provider;
    let filtered = { stores: [], employees: [] };
    let filterClient = app.createFilterClient(snapshot);
    let filterRevision = 0;
    let listCache = {};
    const supervisorById = new Map(app.supervisors.map(row => [row.id, row]));
    const pageSize = 50;

    async function refresh({ fit = true } = {}) {
        const revision = ++filterRevision;
        $("#object-list").setAttribute("aria-busy", "true");
        $("#object-list").inert = true;
        const result = await filterClient.filter(state);
        if (revision !== filterRevision || !result) return;
        filtered = { stores: result.storeIds.map(id => snapshot.storeById.get(id)), employees: result.employeeIds.map(id => snapshot.employeeById.get(id)) };
        const scope = await filterClient.filter({ ...state, status: "all" });
        if (revision !== filterRevision || !scope) return;
        const counts = { all: scope.storeIds.length, pending: 0, working: 0, completed: 0, failed: 0 };
        scope.storeIds.forEach(id => counts[snapshot.storeById.get(id).status]++);
        document.querySelectorAll("[data-map-status]").forEach(button => {
            button.dataset.label ||= button.textContent;
            button.textContent = button.dataset.label + " · " + number(counts[button.dataset.mapStatus]);
        });
        render({ fit });
        $("#object-list").setAttribute("aria-busy", "false");
        $("#object-list").inert = false;
        document.body.dataset.loadState = "ready";
    }
    function gpsLabel(employee) {
        const cutoff = snapshot.asOf ? snapshot.asOf.slice(11, 16) : "—";
        return employee.gpsMinutes === null ? "Chưa có GPS" : `GPS mẫu · ${employee.gpsMinutes} phút trước mốc ${cutoff}`;
    }
    function statusPill(type, status) {
        return `<span class="status-pill ${status}">${escapeHtml((type === "employee" ? app.employeeLabels : app.visitLabels)[status])}</span>`;
    }
    function rowMarkup(type, row) {
        const employee = type === "employee";
        const meta = employee ? `${row.city} · ${app.employeeLabels[row.status]}` : `${row.code || row.id} · ${row.city}`;
        return `<button class="object-row" type="button" data-select-type="${type}" data-select-id="${row.id}" aria-label="Xem ${escapeHtml(row.name)} tại ${escapeHtml(row.city)}"><span class="object-avatar${employee ? "" : " store-avatar"}" aria-hidden="true">${employee ? escapeHtml(row.initials) : "▦"}</span><span><strong>${escapeHtml(row.name)}</strong><small${employee ? ` class="status-text ${row.status}"` : ""}>${escapeHtml(meta)}</small></span><span class="row-chevron" aria-hidden="true"></span></button>`;
    }
    function updateCities() {
        const cities = app.cities.filter(city => state.region === "all" || city.region === state.region);
        if (state.city !== "all" && !cities.some(city => city.id === state.city)) state.city = "all";
        $("#city-filter").innerHTML = '<option value="all">Tất cả địa điểm</option>' + cities.map(city => `<option value="${city.id}">${escapeHtml(city.name)}</option>`).join("");
        $("#city-filter").value = state.city;
    }
    function syncControls() {
        $("#region-filter").value = state.region;
        $("#search-query").value = state.query;
        $("#status-filter").value = state.status;
        $("#date-filter").value = state.date;
        updateCities();
        const supervisors = app.supervisors.filter(row => (state.region === "all" || row.regions.includes(state.region)) && (state.city === "all" || row.cityIds.includes(state.city)));
        if (state.sup !== "all" && !supervisors.some(row => row.id === state.sup)) state.sup = "all";
        $("#sup-filter").innerHTML = '<option value="all">Tất cả SUP</option>' + supervisors.map(row => '<option value="' + row.id + '">' + escapeHtml(row.name) + '</option>').join("");
        $("#sup-filter").value = state.sup;
        const employees = snapshot.employees.filter(row => (state.region === "all" || row.region === state.region) && (state.city === "all" || row.cityId === state.city) && (state.sup === "all" || row.supervisorId === state.sup));
        if (state.employee !== "all" && !employees.some(row => row.id === state.employee)) state.employee = "all";
        $("#employee-filter").innerHTML = '<option value="all">Tất cả nhân viên</option>' + employees.map(row => '<option value="' + row.id + '">' + escapeHtml(row.id + ' · ' + row.name) + '</option>').join("");
        $("#employee-filter").value = state.employee;
        $("#location-filter").value = state.location;
    }
    function updateUrl() {
        const url = new URL(location.href);
        url.search = "";
        if (state.region !== "all") url.searchParams.set("region", state.region);
        if (state.city !== "all") url.searchParams.set("city", state.city);
        if (state.query) url.searchParams.set("q", state.query);
        if (state.date !== app.availableDates[0]) url.searchParams.set("date", state.date);
        if (state.sup !== "all") url.searchParams.set("sup", state.sup);
        if (state.employee !== "all") url.searchParams.set("employee", state.employee);
        history.replaceState(null, "", url);
    }
    function renderSummary() {
        const items = [
            ["Cửa hàng", filtered.stores.length], ["Nhân viên", filtered.employees.length],
            ["Nhân viên đang IN", filtered.employees.filter(row => row.status === "working").length],
            ["CH thành công", filtered.stores.filter(row => row.status === "completed").length],
        ];
        $("#summary-grid").innerHTML = items.map(([label, value]) => `<div class="summary-item"><span>${label}</span><b>${number(value)}</b></div>`).join("");
        $("#panel-date").textContent = dateLabel(state.date).slice(0, 5);
        const shownCount = (state.object === "employees" ? 0 : filtered.stores.length) + (state.object === "stores" ? 0 : filtered.employees.length);
        $("#list-total").textContent = `${number(shownCount)} đối tượng`;
        document.querySelectorAll("[data-object]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.object === state.object)));
        const available = filtered.stores.filter(app.hasLocation).length;
        const review = filtered.stores.filter(row => row.locationStatus === "review").length;
        $("#data-quality-note").textContent = number(available) + " shop có vị trí · " + number(filtered.stores.length - available - review) + " thiếu tọa độ · " + number(review) + " cần kiểm tra";
        const employeeQuery = state.object === "stores" ? "" : app.normalize(employeeSearch.trim());
        const storeQuery = state.object === "employees" ? "" : app.normalize(storeSearch.trim());
        if (listCache.filtered !== filtered || listCache.object !== state.object || listCache.employeeSearch !== employeeSearch || listCache.storeSearch !== storeSearch) {
            const rows = [];
            const employees = state.object === "stores" || storeQuery && !employeeQuery ? [] : filtered.employees.filter(row => app.normalize(row.id + " " + row.name).includes(employeeQuery));
            const stores = state.object === "employees" || employeeQuery && !storeQuery ? [] : filtered.stores.filter(row => app.normalize((row.code || row.sourceId || row.id) + " " + row.name).includes(storeQuery));
            // Xen kẽ hai nhóm để trang Tất cả có cả nhân viên và shop ngay từ đầu.
            for (let index = 0; index < Math.max(employees.length, stores.length); index += 25) {
                rows.push(...employees.slice(index, index + 25).map(row => ({ type: "employee", row })));
                rows.push(...stores.slice(index, index + 25).map(row => ({ type: "store", row })));
            }
            listCache = { filtered, object: state.object, employeeSearch, storeSearch, rows };
        }
        $("#employee-list-search-wrap").hidden = state.object === "stores";
        $("#store-list-search-wrap").hidden = state.object === "employees";
        $("#list-search-active").hidden = !(employeeQuery || storeQuery);
        if (employeeQuery || storeQuery) $("#list-total").textContent = number(listCache.rows.length) + " kết quả";
        const pages = Math.max(1, Math.ceil(listCache.rows.length / pageSize));
        state.page = Math.max(0, Math.min(state.page, pages - 1));
        let list = "", previousType = "";
        for (const { type, row } of listCache.rows.slice(state.page * pageSize, (state.page + 1) * pageSize)) {
            if (type !== previousType) { list += '<div class="list-section-title">' + (type === "employee" ? "NHÂN VIÊN" : "CỬA HÀNG") + '</div>'; previousType = type; }
            list += rowMarkup(type, row);
        }
        $("#object-list").innerHTML = list || '<div class="empty-state"><strong>Không tìm thấy kết quả</strong><p>Thử đổi tên, vùng, SUP hoặc trạng thái.</p></div>';
        $("#list-page-label").textContent = "Trang " + number(state.page + 1) + "/" + number(pages);
        $('[data-list-page="previous"]').disabled = state.page === 0;
        $('[data-list-page="next"]').disabled = state.page >= pages - 1;
    }
    function metaRow(label, content) { return `<div><dt>${label}</dt><dd>${content}</dd></div>`; }
    function detailMarkup() {
        const { type, id } = state.selected;
        const employee = type === "employee";
        const row = (employee ? snapshot.employeeById : snapshot.storeById).get(id);
        const owner = employee ? row : snapshot.employeeById.get(row.employeeId);
        const currentStore = snapshot.storeById.get(owner.currentStoreId);
        const linkedStore = currentStore ? `<button type="button" class="detail-link" data-select-type="store" data-select-id="${currentStore.id}">${escapeHtml(currentStore.name)} · ${escapeHtml(currentStore.code || currentStore.sourceId)}</button>` : "Không có điểm ghé";
        let metadata = metaRow("Khu vực", app.regions[row.region] + " · " + escapeHtml(row.city));
        metadata += metaRow("SUP phụ trách", escapeHtml(supervisorById.get(row.supervisorId)?.name || "Chưa phân SUP"));
        if (employee) metadata += metaRow("Danh mục phụ trách", number(row.portfolio.length) + " shop · " + row.route.length + " điểm dự kiến trong ngày");
        metadata += employee
            ? metaRow(row.status === "idle" ? "Điểm ghé dự kiến đầu tiên" : row.status === "completed" ? "Điểm ghé cuối cùng" : "Điểm ghé gần nhất", linkedStore) + metaRow("Ca làm việc", row.shift) + metaRow("Cập nhật vị trí mẫu", escapeHtml(gpsLabel(row)))
            : metaRow("Mã cửa hàng nguồn", escapeHtml(row.code || row.sourceId)) + metaRow("Địa chỉ nguồn", escapeHtml(row.address || "Chưa có địa chỉ")) + metaRow("Nhân viên phụ trách", `<button type="button" class="detail-link" data-select-type="employee" data-select-id="${owner.id}">${escapeHtml(owner.name)}</button>`) + metaRow("Lượt ghé trong ngày", escapeHtml(row.visitTime));
        metadata += metaRow(employee ? "Vị trí nhân viên mô phỏng" : "Tọa độ shop nguồn", app.hasLocation(row) ? row.lat.toFixed(5) + ", " + row.lng.toFixed(5) : row.locationStatus === "review" ? "Cần kiểm tra tọa độ nguồn; chưa đặt lên bản đồ" : "Chưa có tọa độ hợp lệ; chưa đặt lên bản đồ");
        const warning = employee && row.gpsMinutes > 30 ? '<p class="detail-warning">Vị trí GPS đã quá 30 phút so với thời điểm dữ liệu.</p>' : "";
        let route = "";
        if (employee) {
            const stops = row.route.map(storeId => snapshot.storeById.get(storeId));
            const distances = stops.slice(0, -1).map((store, index) => app.distanceBetween(store, stops[index + 1]));
            const formatDistance = distance => "~ " + new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(distance / 1000) + " km";
            route = '<section class="detail-section"><h3>Lộ trình trong ngày</h3><ol class="route-list">' + stops.map((store, index) => {
                const leg = index < stops.length - 1 ? '<div class="route-leg">' + (distances[index] === null ? '<span>Khoảng cách: <b>Chưa có tọa độ</b></span>' : '<button type="button" class="route-distance-button" data-route-leg="' + index + '" aria-label="Xem khoảng cách giữa ' + escapeHtml(store.name) + ' và ' + escapeHtml(stops[index + 1].name) + '">Khoảng cách: <b>' + formatDistance(distances[index]) + '</b></button>') + '</div>' : "";
                return '<li><button class="route-stop" type="button" data-select-type="store" data-select-id="' + store.id + '"><span class="route-number">' + (index + 1) + '</span><span><strong>' + escapeHtml(store.name) + '</strong><small>' + app.visitLabels[store.status] + ' · ' + escapeHtml(store.visitTime) + '</small></span></button>' + leg + '</li>';
            }).join("") + '</ol>';
            if (distances.length) route += '<div class="route-total">' + (distances.every(value => value === null) ? "Chưa đủ tọa độ để tính khoảng cách" : (distances.some(value => value === null) ? "Tổng đoạn có tọa độ: " : "Tổng khoảng cách: ") + formatDistance(distances.reduce((sum, distance) => sum + (distance ?? 0), 0))) + '</div>';
            route += '<p>Đường nối và khoảng cách đường thẳng để tham khảo; không phải quãng đường đường bộ.</p></section>';
        }
        return `<button type="button" class="back-button" data-action="overview">Về tổng quan</button><p class="detail-eyebrow">${employee ? "THÔNG TIN NHÂN VIÊN" : "THÔNG TIN CỬA HÀNG"}</p><div class="detail-profile"><span class="object-avatar${employee ? "" : " store-avatar"}" aria-hidden="true">${employee ? escapeHtml(row.initials) : "▦"}</span><div><h2>${escapeHtml(row.name)}</h2>${statusPill(type, row.status)}</div></div><dl class="detail-meta">${metadata}</dl>${warning}${route}<button type="button" class="primary-button" data-action="report">${employee ? "Xem báo cáo ngày" : "Xem báo cáo cửa hàng"}</button><p class="report-values-note">Dữ liệu minh họa ngày ${dateLabel(state.date)}. Check-in và đánh giá được thực hiện trên ứng dụng riêng.</p>`;
    }
    function visitEvidence(record, person) {
        const visit = record.visit || {};
        const formatTime = value => value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)) : null;
        const slots = [ ["IN", visit.inAt, visit.inPhoto, "Chưa check-in"], ["OUT", visit.outAt, visit.outPhoto, "Chưa check-out"] ].map(([label, time, photo, missing]) => {
            let src = "";
            if (photo) {
                try { const url = new URL(photo, document.baseURI); if (["http:", "https:"].includes(url.protocol)) src = url.href; } catch { /* Nguồn ảnh không hợp lệ dùng khung chờ. */ }
            }
            const caption = `Ảnh ${label} · ${person?.name || "Nhân viên"} tại ${record.name}`;
            return `<section class="visit-evidence-slot"><h5>${label}</h5><p class="visit-evidence-time">${formatTime(time) || missing}</p>${src ? `<button type="button" class="visit-photo" data-visit-photo="${escapeHtml(src)}" data-photo-caption="${escapeHtml(caption)}" aria-label="Xem lớn ${escapeHtml(caption)}"><img src="${escapeHtml(src)}" alt="${escapeHtml(caption)}" loading="lazy" /></button>` : '<div class="visit-photo-empty"><span aria-hidden="true">▧</span><span>Chưa có ảnh</span></div>'}</section>`;
        }).join("");
        const elapsed = Date.parse(visit.outAt) - Date.parse(visit.inAt);
        const duration = Number.isFinite(elapsed) && elapsed > 0 ? `Thời gian tại CH: <strong>${number(Math.round(elapsed / 60000))} phút</strong>` : visit.inAt ? "Đang tại cửa hàng" : "Chưa ghé cửa hàng";
        return `<div class="visit-evidence">${slots}</div><p class="visit-duration">${duration}</p>`;
    }
    function reportSnapshot(date) { if (date === state.date) return snapshot; if (!historySnapshots.has(date)) historySnapshots.set(date, app.getSnapshot(date)); return historySnapshots.get(date); }
    function rangeReport() {
        if (reportBaseDate !== state.date) {
            reportBaseDate = state.date;
            reportRange.from = reportRange.to = state.date;
        }
        const key = JSON.stringify([reportRange, state.region, state.city, state.sup, state.employee, state.status, state.location, state.query, state.date]);
        if (reportCache?.key === key) return reportCache.result;
        const result = app.summarizeReport({ getSnapshot: reportSnapshot }, state, reportRange);
        reportCache = { key, result }; return result;
    }
    function reportMarkup() {
        const selected = state.mode !== "summary-report" && state.selected;
        const row = selected ? (selected.type === "employee" ? snapshot.employeeById : snapshot.storeById).get(selected.id) : null;
        const ranged = selected ? app.summarizeReport({ getSnapshot: reportSnapshot }, state, historyRange, selected) : rangeReport();
        const range = selected ? historyRange : reportRange;
        const days = app.availableDates.filter(date => date >= range.from && date <= range.to);
        const matchesVisit = record => record?.report.visits && (state.status === "all" || record.status === state.status) && (state.location === "all" || (state.location === "available" ? app.hasLocation(record) : state.location === "review" ? record.locationStatus === "review" : !app.hasLocation(record)));
        const stores = selected?.type === "store" ? [row] : ranged.stores.filter(store => days.some(date => matchesVisit(reportSnapshot(date).storeById.get(store.id))));
        const total = ranged.total;
        const attendance = ranged.attendance;
        const title = row ? row.name : "Tổng quan báo cáo";
        const values = [
            { key: "plan", label: range.from !== range.to ? "Plan" : "Plan ngày", value: number(attendance.plan), unit: "công" },
            { key: "actual-atd", label: "Actual ATD", value: number(attendance.actualAtd), unit: "công" },
            { key: "sold", label: "Đã bán", value: number(total.sold), unit: "bao" },
            { key: "stock", label: ranged ? "Tồn kho cuối kỳ" : "Tồn kho mẫu", value: total.stock === null ? "—" : number(total.stock), unit: "bao" },
            { key: "revenue", label: "Doanh thu", value: number(total.revenue), unit: "đồng" },
        ];
        let breakdown;
        if (!selected) {
            const cityRows = app.cities.map(city => {
                const count = ranged.cities.get(city.id);
                if (!count) return "";
                return `<tr><th scope="row"><button type="button" data-scope-city="${city.id}">${escapeHtml(city.name)}</button></th><td>${number(count.plan)}</td><td>${number(count.actualAtd)}</td><td>${number(count.shops.size)}</td></tr>`;
            }).join("");
            breakdown = cityRows ? `<table class="report-locations"><caption class="sr-only">Plan và Actual ATD theo địa điểm từ ${dateLabel(reportRange.from)} đến ${dateLabel(reportRange.to)}</caption><colgroup><col class="location-name-column" /><col /><col /><col /></colgroup><thead><tr><th scope="col">Địa điểm</th><th scope="col">Plan</th><th scope="col">ATD</th><th scope="col">Shop</th></tr></thead><tbody>${cityRows}</tbody></table>` : '<p>Không có dữ liệu trong bộ lọc này.</p>';
        } else {
            const cards = stores.map(store => {
                const days = app.availableDates.filter(date => date >= historyRange.from && date <= historyRange.to).sort().reverse();
                const visits = days.flatMap(date => {
                    let day = snapshot;
                    if (date !== state.date) {
                        if (!historySnapshots.has(date)) historySnapshots.set(date, app.getSnapshot(date));
                        day = historySnapshots.get(date);
                    }
                    const record = day.storeById.get(store.id);
                    if (!matchesVisit(record)) return [];
                    const person = day.employeeById.get(record.employeeId);
                    if (state.employee !== "all" && person?.id !== state.employee) return [];
                    if (state.sup !== "all" && person?.supervisorId !== state.sup) return [];
                    const sup = supervisorById.get(person?.supervisorId);
                    return [`<details class="visit-card"><summary><span class="visit-date">${dateLabel(date)}<small>${escapeHtml(record.visitTime)}</small></span>${statusPill("store", record.status)}<span class="visit-person">${escapeHtml(person ? person.id + " · " + person.name : "Chưa phân công")}<small>${escapeHtml(sup?.name || "Chưa phân SUP")}</small></span><span class="visit-expand">Xem số liệu</span></summary>${visitEvidence(record, person)}<dl class="visit-values"><div><dt>Đã bán · bao</dt><dd>${number(record.report.sold)}</dd></div><div><dt>Tồn kho · bao</dt><dd>${number(record.report.stock)}</dd></div><div class="visit-wide"><dt>Doanh thu · đồng</dt><dd>${number(record.report.revenue)}</dd></div><div class="visit-wide"><dt>Giá bán · đồng/bao</dt><dd>${number(record.report.price)}</dd></div></dl></details>`];
                });
                return `<article class="shop-visits"><h4>${escapeHtml(store.name)}</h4><p class="shop-code">${escapeHtml(store.code || store.sourceId)}</p><div class="visit-timeline">${visits.join("") || '<p class="visit-empty">Chưa có lượt ghé trong dữ liệu và phạm vi nhân viên/SUP này.</p>'}</div></article>`;
            }).join("");
            breakdown = cards || '<p class="visit-empty">Chưa có lượt ghé trong khoảng ngày và bộ lọc này.</p>';

        }
        const boundKind = selected ? "history" : "report";
        const rangeControls = `<div class="history-date-range report-date-range"><label>Từ ngày<input type="date" data-${boundKind}-bound="from" aria-label="Báo cáo từ ngày" value="${range.from}" max="${range.to}"></label><label>Đến ngày<input type="date" data-${boundKind}-bound="to" aria-label="Báo cáo đến ngày" value="${range.to}" min="${range.from}"></label></div>`;
        const dataTime = ranged.asOf ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short", hour12: false }).format(new Date(ranged.asOf)) : "";
        const loaded = app.loadedAt ? new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "medium", hour12: false }).format(new Date(app.loadedAt)) : "Chưa xác định";
        return `<button type="button" class="back-button" data-action="${selected ? "detail" : "overview"}">${selected ? "Về thông tin chi tiết" : "Về tổng quan"}</button><div class="report-heading"><h2>${escapeHtml(title)}</h2></div><p class="report-updated">Nạp dữ liệu: <time datetime="${app.loadedAt || ""}">${escapeHtml(loaded)}</time></p>${dataTime ? `<p class="report-updated">Dữ liệu đến: <time datetime="${ranged.asOf}">${dataTime}</time></p>` : ""}${rangeControls}<div class="report-grid">${values.map(({ key, label, value, unit }) => `<div class="report-value${key === "revenue" ? " report-value-wide" : ""}" data-metric="${key}"><span class="report-label">${label}</span><strong>${value}</strong><small class="report-unit">ĐVT: ${unit}</small></div>`).join("")}</div><section class="detail-section report-breakdown"><h3>${selected ? "Phiếu theo cửa hàng" : "Phân bổ theo địa điểm"}</h3>${breakdown}</section>`;
    }

    function render({ fit = false, focus = false } = {}) {
        $("#back-full-route").hidden = true;
        renderSummary();
        document.querySelectorAll("[data-map-status]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mapStatus === state.status)));
        document.querySelectorAll("[data-map-object]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mapObject === state.object)));
        const stores = state.object === "employees" ? [] : filtered.stores;
        const employees = state.object === "stores" ? [] : filtered.employees;
        $("#overview-panel").hidden = state.mode !== "overview";
        $("#detail-panel").hidden = state.mode === "overview";
        if (state.mode !== "overview") $("#detail-panel").innerHTML = state.mode === "detail" ? detailMarkup() : reportMarkup();
        const reportMode = state.mode === "report" || state.mode === "summary-report";
        document.querySelectorAll("[data-nav]").forEach(button => { const active = (button.dataset.nav === "reports") === reportMode; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
        provider.update(stores, employees, state.selected, state.status);
        const route = state.selected?.type === "employee" ? snapshot.employeeById.get(state.selected.id).route.map(id => snapshot.storeById.get(id)) : [];
        provider.route(route);
        $("#route-note").textContent = "Lộ trình mô phỏng nối các điểm";
        $("#route-note").hidden = !route.length;
        if (fit) provider.fit();
        if (focus && state.selected) provider.focus(state.selected.type, state.selected.id);
        $("#dashboard-announcement").textContent = `${filtered.stores.length} cửa hàng và ${filtered.employees.length} nhân viên khớp bộ lọc.`;
        updateUrl();
    }
    async function select(type, id) {
        const rows = snapshot[type === "employee" ? "employees" : "stores"];
        if (!rows.some(row => row.id === id)) return;
        const visible = filtered[type === "employee" ? "employees" : "stores"].some(row => row.id === id);
        if (!visible) { state.query = ""; state.status = "all"; state.location = "all"; state.employee = "all"; }
        state.object = "all";
        state.selected = { type, id };
        state.mode = "detail";
        syncControls();
        if (!visible) await refresh({ fit: false });
        render({ focus: true });
        $("#detail-panel").scrollTop = 0;
        if (matchMedia("(max-width: 760px)").matches) $("#monitor-panel").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
    function applyFilters() {
        clearTimeout(searchTimer);
        state.selected = null;
        state.mode = "overview";
        state.page = 0;
        refresh({ fit: true });
        $("#overview-panel").scrollTop = 0;
    }

    provider = app.createMapProvider($("#dashboard-map"), {
        onSelect: select,
        onHealth(status) { $("#map-loading").hidden = true; $("#map-network-note").hidden = status === "ready"; },
    });
    syncControls();
    if (app.supervisors.some(row => row.id === params.get("sup"))) state.sup = params.get("sup");
    if (snapshot.employeeById.has(params.get("employee"))) state.employee = params.get("employee");
    syncControls();
    await refresh({ fit: true });
    $("#map-loading").hidden = true;
    $("#dashboard-filters").inert = false;
    $("#dashboard-filters").setAttribute("aria-busy", "false");
    $("#dashboard-filters").addEventListener("submit", event => { event.preventDefault(); clearTimeout(searchTimer); state.query = $("#search-query").value; applyFilters(); });
    $("#search-query").addEventListener("input", event => { state.query = event.target.value; clearTimeout(searchTimer); searchTimer = setTimeout(applyFilters, 180); });
    $("#region-filter").addEventListener("change", event => { state.region = event.target.value; state.city = "all"; state.sup = "all"; state.employee = "all"; syncControls(); applyFilters(); });
    $("#city-filter").addEventListener("change", event => { state.city = event.target.value; state.sup = "all"; state.employee = "all"; syncControls(); applyFilters(); });
    $("#sup-filter").addEventListener("change", event => { state.sup = event.target.value; state.employee = "all"; syncControls(); applyFilters(); });
    $("#employee-filter").addEventListener("change", event => { state.employee = event.target.value; applyFilters(); });
    $("#location-filter").addEventListener("change", event => { state.location = event.target.value; applyFilters(); });
    $("#status-filter").addEventListener("change", event => { state.status = event.target.value; applyFilters(); });
    $("#date-filter").addEventListener("change", event => { state.date = event.target.value; snapshot = app.getSnapshot(state.date); filterClient.destroy(); filterClient = app.createFilterClient(snapshot); syncControls(); applyFilters(); });
    $("#reset-filters").addEventListener("click", () => { employeeSearch = ""; storeSearch = ""; reportRange.from = reportRange.to = app.availableDates[0]; $("#employee-list-search").value = ""; $("#store-list-search").value = ""; Object.assign(state, { region: "all", city: "all", query: "", status: "all", date: app.availableDates[0], object: "all", sup: "all", employee: "all", location: "all", page: 0 }); snapshot = app.getSnapshot(state.date); filterClient.destroy(); filterClient = app.createFilterClient(snapshot); syncControls(); applyFilters(); });
    $("#toggle-filters").disabled = false;
    $("#toggle-filters").addEventListener("click", () => {
        const expanded = $("#dashboard-filters").hidden;
        $("#dashboard-filters").hidden = !expanded;
        $("#toggle-filters").setAttribute("aria-expanded", String(expanded));
        $("#toggle-filters").setAttribute("aria-label", expanded ? "Thu gọn bộ lọc" : "Bộ lọc");
        $("#toggle-filters").title = expanded ? "Thu gọn bộ lọc" : "Bộ lọc";
    });
    $("#toggle-list-search").addEventListener("click", () => {
        const expanded = $("#list-search-fields").hidden;
        $("#list-search-fields").hidden = !expanded;
        $("#toggle-list-search").setAttribute("aria-expanded", String(expanded));
        if (expanded) $(state.object === "stores" ? "#store-list-search" : "#employee-list-search").focus({ preventScroll: true });
    });
    $("#employee-list-search").addEventListener("input", event => {
        employeeSearch = event.target.value; state.page = 0; renderSummary();
    });
    $("#store-list-search").addEventListener("input", event => {
        storeSearch = event.target.value; state.page = 0; renderSummary();
    });
    document.addEventListener("change", event => {
        const reportBound = event.target.dataset.reportBound;
        if (reportBound) {
            const value = event.target.value;
            if (!value || (reportBound === "from" ? value > reportRange.to : value < reportRange.from)) {
                event.target.value = reportRange[reportBound]; return;
            }
            reportRange[reportBound] = value; render(); return;
        }
        const bound = event.target.dataset.historyBound;
        if (!bound) return;
        const value = event.target.value;
        if (!value || (bound === "from" ? value > historyRange.to : value < historyRange.from)) {
            event.target.value = historyRange[bound]; return;
        }
        historyRange[bound] = value; render();
    });
    const photoDialog = document.createElement("dialog");
    photoDialog.className = "visit-photo-dialog";
    photoDialog.setAttribute("aria-labelledby", "visit-photo-caption");
    photoDialog.innerHTML = '<form method="dialog"><button type="submit" aria-label="Đóng ảnh">Đóng</button></form><p id="visit-photo-caption"></p><img alt="" />';
    document.body.append(photoDialog);
    photoDialog.addEventListener("close", () => photoDialog.querySelector("img").removeAttribute("src"));
    document.addEventListener("error", event => {
        if (!event.target.matches?.(".visit-photo img")) return;
        const placeholder = document.createElement("div");
        placeholder.className = "visit-photo-empty"; placeholder.textContent = "Không tải được ảnh";
        event.target.closest("button").replaceWith(placeholder);
    }, true);
    document.addEventListener("click", event => {
        const target = event.target.closest("button");
        if (!target) return;
        if (target.dataset.routeLeg !== undefined && state.selected?.type === "employee" && state.mode === "detail") {
            const stops = snapshot.employeeById.get(state.selected.id).route.map(id => snapshot.storeById.get(id));
            const index = Number(target.dataset.routeLeg);
            if (Number.isInteger(index) && index >= 0 && index < stops.length - 1 && provider.showLeg(stops[index], stops[index + 1])) {
                $("#back-full-route").hidden = false;
                $("#route-note").textContent = stops[index].name + " → " + stops[index + 1].name;
                $("#dashboard-announcement").textContent = "Đang xem hai cửa hàng " + stops[index].name + " và " + stops[index + 1].name;
            }
            return;
        }
        if (target.id === "back-full-route") {
            render();
            const stops = state.selected?.type === "employee" ? snapshot.employeeById.get(state.selected.id).route.map(id => snapshot.storeById.get(id)) : [];
            provider.fitRoute(stops); return;
        }
        if (target.dataset.visitPhoto) {
            photoDialog.querySelector("img").src = target.dataset.visitPhoto;
            photoDialog.querySelector("img").alt = target.dataset.photoCaption;
            photoDialog.querySelector("p").textContent = target.dataset.photoCaption;
            photoDialog.showModal(); return;
        }
        if (target.dataset.mapStatus) { state.status = target.dataset.mapStatus; syncControls(); applyFilters(); return; }
        if (target.dataset.mapObject) { state.object = target.dataset.mapObject; state.selected = null; state.mode = "overview"; state.page = 0; render({ fit: true }); return; }
        if (target.dataset.listPage) { state.page += target.dataset.listPage === "next" ? 1 : -1; renderSummary(); $("#overview-panel").scrollTop = $(".list-filters-sticky").offsetTop; return; }
        if (target.dataset.selectType) return select(target.dataset.selectType, target.dataset.selectId);
        if (target.dataset.object) { state.object = target.dataset.object; state.page = 0; state.selected = null; state.mode = "overview"; render({ fit: true }); $("#overview-panel").scrollTop = 0; return; }
        if (target.dataset.nav) { state.mode = target.dataset.nav === "reports" ? "summary-report" : "overview"; state.selected = null; render(); }
        if (target.dataset.action) { state.mode = target.dataset.action; if (state.mode === "overview") state.selected = null; render(); $("#detail-panel").scrollTop = 0; }
        if (target.dataset.scopeCity) {
            const city = app.cities.find(item => item.id === target.dataset.scopeCity);
            Object.assign(state, { region: city.region, city: city.id, query: "", status: "all", object: "all", sup: "all", employee: "all", location: "all" });
            syncControls(); applyFilters();
        }
    });
    new ResizeObserver(() => provider.resize()).observe($(".map-panel"));
})();
