/* Mô hình dùng chung cho UI, Web Worker và kiểm thử; không phụ thuộc DOM. */
((scope) => {
    const app = (scope.ViewMapDashboard ||= {});
    const regions = { north: "Miền Bắc", central: "Miền Trung", south: "Miền Nam", unassigned: "Chưa xác định vùng" };
    const visitLabels = { pending: "Chưa thực hiện", working: "Đang thực hiện", completed: "Thành công", failed: "Không thành công" };
    const employeeLabels = { working: "Đang làm việc", completed: "Hoàn thành", idle: "Chưa làm việc" };
    const availableDates = ["2026-11-19", "2026-11-18", "2026-11-17"];
    const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLocaleLowerCase("vi");
    const hasLocation = row => Boolean(row && row.locationStatus === "available" && Number.isFinite(row.lat) && Number.isFinite(row.lng));
    const hash = value => { let result = 2166136261; for (const char of String(value)) result = Math.imul(result ^ char.charCodeAt(0), 16777619); return result >>> 0; };

    // Mỗi nhân viên tối đa 1 ngày công trong ngày được chọn; không tính theo lượt ghé.
    function attendanceTotals(employees, date) {
        const planned = new Set(), attended = new Set();
        for (const employee of employees) {
            if (employee.schedule?.date === date && employee.schedule.isScheduled === true) planned.add(employee.id);
            const attendance = employee.attendance;
            if (attendance?.date !== date || !attendance.inAt || !attendance.outAt) continue;
            const start = Date.parse(attendance.inAt), end = Date.parse(attendance.outAt);
            if (Number.isFinite(start) && Number.isFinite(end) && end > start) attended.add(employee.id);
        }
        return { plan: planned.size, actualAtd: attended.size };
    }

    function distanceBetween(a, b) {
        if (!hasLocation(a) || !hasLocation(b)) return null;
        const radians = degrees => degrees * Math.PI / 180;
        const lat = radians(b.lat - a.lat), lng = radians(b.lng - a.lng);
        const h = Math.sin(lat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(lng / 2) ** 2;
        return 6371008.8 * 2 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, h))));
    }
    function allocate(buckets, total) {
        if (buckets.length > total) throw new Error("Số nhóm địa lý lớn hơn số nhân viên cần phân bổ");
        const remaining = total - buckets.length;
        const weight = buckets.reduce((sum, bucket) => sum + bucket.stores.length - 1, 0);
        const shares = buckets.map((bucket, index) => {
            const exact = weight ? remaining * (bucket.stores.length - 1) / weight : 0;
            return { index, count: 1 + Math.floor(exact), fraction: exact % 1 };
        });
        let left = total - shares.reduce((sum, row) => sum + row.count, 0);
        for (const row of [...shares].sort((a, b) => b.fraction - a.fraction || a.index - b.index)) if (left-- > 0) row.count++;
        return shares.map(row => row.count);
    }
    function createModel(source, employeeCount = 900) {
        if (!source || source.schemaVersion !== 1 || !Array.isArray(source.stores) || source.stores.length < employeeCount) throw new Error("Bộ dữ liệu shop không hợp lệ");
        const baseStores = source.stores.map(store => ({ ...store }));
        const byGroup = new Map();
        for (const store of baseStores) {
            const key = store.supervisorId + ":" + store.cityId;
            if (!byGroup.has(key)) byGroup.set(key, { stores: [] });
            byGroup.get(key).stores.push(store);
        }
        const buckets = [...byGroup.values()];
        const counts = allocate(buckets, employeeCount);
        const employees = [];
        const family = ["Nguyễn", "Trần", "Lê", "Phạm", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Vũ", "Phan", "Huỳnh", "Hoàng", "Dương", "Đinh", "Trương", "Lý", "Mai", "Tạ", "Cao"];
        const middle = ["Minh", "Ngọc", "Thanh"];
        const given = ["An", "Bình", "Huy", "Mai", "Bảo", "Linh", "Nam", "Vy", "Anh", "Tâm", "Khánh", "Hà", "Phúc", "Trang", "Duy"];
        buckets.forEach((bucket, bucketIndex) => {
            // Các danh mục liền nhau theo quận/huyện và tọa độ, không random xuyên vùng.
            bucket.stores.sort((a, b) => a.district.localeCompare(b.district, "vi") || Number(hasLocation(b)) - Number(hasLocation(a)) || (a.lat ?? 0) - (b.lat ?? 0) || (a.lng ?? 0) - (b.lng ?? 0) || a.id.localeCompare(b.id));
            const count = counts[bucketIndex];
            for (let part = 0; part < count; part++) {
                const portfolio = bucket.stores.slice(Math.floor(part * bucket.stores.length / count), Math.floor((part + 1) * bucket.stores.length / count));
                const number = employees.length;
                const name = `${family[number % 20]} ${middle[Math.floor(number / 20) % 3]} ${given[Math.floor(number / 60) % given.length]}`;
                const first = portfolio[0];
                const employee = { id: `NV${String(number + 1).padStart(4, "0")}`, name, initials: name.split(" ").slice(-2).map(word => word[0]).join(""), cityId: first.cityId, city: first.city, region: first.region, supervisorId: first.supervisorId, role: "Nhân viên mẫu", shift: "08:00 – 17:00", portfolio: portfolio.map(store => store.id) };
                for (const store of portfolio) store.employeeId = employee.id;
                employees.push(employee);
            }
        });
        const ranks = new Map([...employees].sort((a, b) => hash(a.id + ":status") - hash(b.id + ":status")).map((row, index) => [row.id, index]));

        const snapshots = new Map();
        const chronologicalDates = [...availableDates].sort();
        const atMinute = (date, minute) => `${date}T${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}:00+07:00`;
        function buildSnapshot(date, previous) {
            const day = chronologicalDates.indexOf(date);
            const live = date === availableDates[0];
            const asOfMinute = live ? 630 : 1050;
            const stores = baseStores.map((store, index) => {
                const openingStock = previous ? previous.storeById.get(store.id).report.stock : 100 + hash(store.id + ":opening") % 121;
                const received = openingStock < 70 ? 100 : 0;
                return { ...store, date, status: "pending", planned: false, visitTime: "Chưa ghé", visit: { id: `${date}:${store.id}`, employeeId: store.employeeId, inAt: null, outAt: null, inPhoto: null, outPhoto: null }, report: { openingStock, received, sold: 0, price: 18000 + index % 8 * 2000, revenue: 0, stock: openingStock + received, visits: 0 } };
            });
            const storeById = new Map(stores.map(row => [row.id, row]));
            const employeeRows = employees.map(employee => {
                const rank = (ranks.get(employee.id) + day * 137) % employeeCount;
                const scheduled = rank < Math.round(employeeCount * .9);
                const absent = scheduled && rank >= Math.round(employeeCount * .85);
                const early = live && rank >= Math.round(employeeCount * .6) && rank < Math.round(employeeCount * .85);
                const shiftStart = early ? 360 : 480, shiftEnd = early ? 600 : 1020;
                const active = scheduled && !absent;
                const status = !active ? "idle" : asOfMinute >= shiftEnd ? "completed" : "working";
                const schedule = { date, isScheduled: scheduled, start: atMinute(date, shiftStart).slice(11, 16), end: atMinute(date, shiftEnd).slice(11, 16) };
                const attendance = { date, inAt: active ? atMinute(date, shiftStart) : null, outAt: active && status === "completed" ? atMinute(date, shiftEnd) : null };
                const portfolio = employee.portfolio.map(id => storeById.get(id));
                const located = portfolio.filter(hasLocation);
                const candidates = located.length ? located : portfolio;
                const start = hash(employee.id + date + ":route") % candidates.length;
                let pool = candidates.slice(start).concat(candidates.slice(0, start));
                const route = [];
                let cursor = shiftStart + 10;
                const targetCount = Math.min(candidates.length, 3 + hash(employee.id + ":visits") % 4);
                while (scheduled && pool.length && route.length < targetCount) {
                    const last = route.at(-1);
                    if (last) pool.sort((a, b) => (distanceBetween(last, a) ?? Infinity) - (distanceBetween(last, b) ?? Infinity) || a.id.localeCompare(b.id));
                    const store = pool.shift();
                    const meters = last ? distanceBetween(last, store) : 0;
                    const travel = last ? meters === null ? 20 : Math.max(5, Math.ceil(meters / 35000 * 60)) : 0;
                    const plannedIn = cursor + travel;
                    const duration = 15 + hash(store.id + date + ":duration") % 11;
                    const plannedOut = plannedIn + duration;
                    if (plannedOut > shiftEnd - 10) break;
                    store.planned = true;
                    store.visit = { ...store.visit, plannedInAt: atMinute(date, plannedIn), plannedOutAt: atMinute(date, plannedOut) };
                    if (active && plannedIn <= asOfMinute) {
                        const ended = plannedOut <= asOfMinute;
                        store.status = ended ? hash(store.id + date + ":outcome") % 17 === 0 ? "failed" : "completed" : "working";
                        store.visit.inAt = atMinute(date, plannedIn);
                        store.visit.outAt = ended ? atMinute(date, plannedOut) : null;
                        store.visitTime = store.visit.inAt.slice(11, 16);
                        const sold = store.status === "completed" ? Math.min(store.report.stock, 12 + hash(store.id + date + ":sold") % 29) : 0;
                        store.report = { ...store.report, sold, revenue: sold * store.report.price, stock: store.report.stock - sold, visits: 1 };
                    }
                    route.push(store); cursor = plannedOut;
                }
                const visited = route.filter(store => store.visit.inAt);
                const current = active ? visited.at(-1) : route[0];
                const locatedEmployee = active && hasLocation(current);
                return { ...employee, date, status, schedule, attendance, shift: scheduled ? `${schedule.start} – ${schedule.end}` : "Không có lịch", route: route.map(store => store.id), currentStoreId: current?.id || null, lat: locatedEmployee ? current.lat : null, lng: locatedEmployee ? current.lng : null, locationStatus: locatedEmployee ? "available" : "missing", gpsMinutes: locatedEmployee ? 2 + hash(employee.id + date) % 13 : null };
            });
            return { stores, employees: employeeRows, date, asOf: atMinute(date, asOfMinute), storeById, employeeById: new Map(employeeRows.map(row => [row.id, row])) };
        }
        function getSnapshot(date = availableDates[0]) {
            if (!availableDates.includes(date)) throw new Error("Ngày không có dữ liệu mẫu");
            for (const workDate of chronologicalDates) {
                if (!snapshots.has(workDate)) {
                    const previous = snapshots.get(chronologicalDates[chronologicalDates.indexOf(workDate) - 1]);
                    snapshots.set(workDate, buildSnapshot(workDate, previous));
                }
                if (workDate === date) break;
            }
            // Callers cannot mutate the deterministic ledger cached inside the model.
            const cached = snapshots.get(date);
            const stores = cached.stores.map(store => ({ ...store, visit: { ...store.visit }, report: { ...store.report } }));
            const employeeRows = cached.employees.map(employee => ({ ...employee, portfolio: [...employee.portfolio], route: [...employee.route], schedule: { ...employee.schedule }, attendance: { ...employee.attendance } }));
            return { date, asOf: cached.asOf, stores, employees: employeeRows, storeById: new Map(stores.map(row => [row.id, row])), employeeById: new Map(employeeRows.map(row => [row.id, row])) };
        }

        return { getSnapshot, cities: source.cities, supervisors: source.supervisors, quality: source.quality, source: source.source };
    }
    function createFilterEngine(snapshot) {
        const employeeById = snapshot.employeeById;
        const search = new Map(snapshot.stores.map(store => {
            const employee = employeeById.get(store.employeeId);
            return [store.id, normalize(`${store.id} ${store.sourceId} ${store.code} ${store.name} ${store.city} ${store.district} ${employee.name} ${employee.id}`)];
        }));
        return function filter(state) {
            const query = normalize(state.query.trim());
            const scopeMatches = row => (state.region === "all" || row.region === state.region) && (state.city === "all" || row.cityId === state.city) && (state.sup === "all" || row.supervisorId === state.sup);
            const stores = snapshot.stores.filter(store => scopeMatches(store) && (state.employee === "all" || store.employeeId === state.employee) && (state.status === "all" || store.status === state.status) && (state.location === "all" || (state.location === "available" ? hasLocation(store) : state.location === "review" ? store.locationStatus === "review" : !hasLocation(store))) && (!query || search.get(store.id).includes(query)));
            const owners = new Set(stores.map(row => row.employeeId));
            const employees = snapshot.employees.filter(employee => scopeMatches(employee) && (state.employee === "all" || employee.id === state.employee) && (state.status === "all" && state.location === "all" || owners.has(employee.id)) && (!query || owners.has(employee.id) || normalize(`${employee.id} ${employee.name} ${employee.city}`).includes(query)));
            return { storeIds: stores.map(row => row.id), employeeIds: employees.map(row => row.id) };
        };
    }
    function summarizeReport(model, state, range, selection = null) {
        const total = { sold: 0, revenue: 0, stock: null, openingStock: 0, received: 0, visits: 0 };
        const attendance = { plan: 0, actualAtd: 0 };
        const cities = new Map(), stores = new Map();
        let asOf = null;
        const days = availableDates.filter(date => date >= range.from && date <= range.to).sort();
        for (const date of days) {
            const day = model.getSnapshot(date);
            asOf = day.asOf;
            const filter = createFilterEngine(day);
            const shopIds = filter(state).storeIds;
            // Shop outcome/location must not change the employee workday denominator.
            const peopleIds = filter({ ...state, status: "all", location: "all" }).employeeIds;
            const selectedStore = selection?.type === "store" ? day.storeById.get(selection.id) : null;
            const matchesStore = store => !selection || (selection.type === "store" ? store.id === selection.id : store.employeeId === selection.id);
            const matchesPerson = person => !selection || person.id === (selection.type === "employee" ? selection.id : selectedStore?.employeeId);
            const scopedStores = shopIds.map(id => day.storeById.get(id)).filter(matchesStore);
            const people = peopleIds.map(id => day.employeeById.get(id)).filter(matchesPerson);
            const counts = attendanceTotals(people, date);
            attendance.plan += counts.plan; attendance.actualAtd += counts.actualAtd;
            if (date === range.to) total.stock = 0;
            for (const store of scopedStores) {
                stores.set(store.id, store);
                total.sold += store.report.sold; total.revenue += store.report.revenue;
                total.received += store.report.received; total.visits += store.report.visits;
                if (date === days[0]) total.openingStock += store.report.openingStock;
                if (date === range.to) total.stock += store.report.stock;
                const city = cities.get(store.cityId) || { plan: 0, actualAtd: 0, shops: new Set() };
                city.shops.add(store.id); cities.set(store.cityId, city);
            }
            for (const person of people) {
                const city = cities.get(person.cityId) || { plan: 0, actualAtd: 0, shops: new Set() };
                const count = attendanceTotals([person], date);
                city.plan += count.plan; city.actualAtd += count.actualAtd; cities.set(person.cityId, city);
            }
        }
        return { total, attendance, cities, stores: [...stores.values()], hasData: days.length > 0, asOf };
    }
    Object.assign(app, { regions, visitLabels, employeeLabels, availableDates, normalize, hasLocation, distanceBetween, attendanceTotals, createModel, createFilterEngine, summarizeReport });
})(globalThis);
