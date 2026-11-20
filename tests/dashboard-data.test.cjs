const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../assets/js/dashboard-model.js"), "utf8"), context);
const app = context.ViewMapDashboard;
const source = JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/data/shops.json"), "utf8"));
const model = app.createModel(source);
const defaults = { region: "all", city: "all", sup: "all", employee: "all", status: "all", location: "all", query: "" };

test("Sổ tồn nối ngày; chỉ lượt chốt mới có doanh thu; giờ ghé không chồng và không vượt ca/mốc dữ liệu", () => {
    let previous;
    for (const date of [...app.availableDates].sort()) {
        const day = model.getSnapshot(date);
        for (const store of day.stores) {
            const report = store.report;
            assert.equal(report.stock, report.openingStock + report.received - report.sold);
            assert.ok(report.stock >= 0);
            if (previous) assert.equal(report.openingStock, previous.storeById.get(store.id).report.stock);
            assert.equal(report.revenue, report.sold * report.price);
            if (store.status !== "completed") assert.equal(report.revenue, 0);
            if (report.sold) assert.ok(store.visit.outAt);
        }
        for (const person of day.employees) {
            if (!person.schedule.isScheduled) { assert.equal(person.route.length, 0); assert.equal(person.attendance.inAt, null); }
            let lastOut = -Infinity;
            for (const id of person.route) {
                const store = day.storeById.get(id), visit = store.visit;
                assert.equal(visit.employeeId, person.id);
                if (!visit.inAt) continue;
                assert.ok(Date.parse(visit.inAt) >= Date.parse(person.attendance.inAt));
                assert.ok(Date.parse(visit.inAt) >= lastOut);
                assert.ok(Date.parse(visit.inAt) <= Date.parse(day.asOf));
                if (visit.outAt) {
                    assert.ok(Date.parse(visit.outAt) <= Date.parse(day.asOf));
                    if (person.attendance.outAt) assert.ok(Date.parse(visit.outAt) <= Date.parse(person.attendance.outAt));
                    lastOut = Date.parse(visit.outAt);
                } else lastOut = Infinity;
            }
        }
        previous = day;
    }
});

test("Báo cáo khoảng ngày khớp sổ shop; SUP cộng bằng tổng; trạng thái shop không làm nhảy công", () => {
    const snapshots = new Map(app.availableDates.map(date => [date, model.getSnapshot(date)]));
    const provider = { getSnapshot: date => snapshots.get(date) };
    const range = { from: "2026-11-17", to: "2026-11-19" };
    const report = app.summarizeReport(provider, defaults, range);
    let sold = 0, revenue = 0;
    for (const day of snapshots.values()) for (const shop of day.stores) { sold += shop.report.sold; revenue += shop.report.revenue; }
    assert.equal(report.total.sold, sold); assert.equal(report.total.revenue, revenue);
    assert.equal(report.total.stock, report.total.openingStock + report.total.received - report.total.sold);
    assert.equal(report.attendance.plan, 2430); assert.equal(report.attendance.actualAtd, 1755);
    const sums = { sold: 0, revenue: 0, stock: 0, plan: 0, actualAtd: 0 };
    for (const sup of source.supervisors) {
        const part = app.summarizeReport(provider, { ...defaults, sup: sup.id }, range);
        for (const key of ["sold", "revenue", "stock"]) sums[key] += part.total[key];
        sums.plan += part.attendance.plan; sums.actualAtd += part.attendance.actualAtd;
    }
    assert.equal(sums.sold, report.total.sold); assert.equal(sums.revenue, report.total.revenue); assert.equal(sums.stock, report.total.stock);
    assert.equal(sums.plan, report.attendance.plan); assert.equal(sums.actualAtd, report.attendance.actualAtd);
    for (const status of ["working", "pending", "completed", "failed"]) {
        const part = app.summarizeReport(provider, { ...defaults, status }, range);
        assert.equal(part.attendance.plan, report.attendance.plan);
        assert.equal(part.attendance.actualAtd, report.attendance.actualAtd);
        if (status !== "completed") assert.equal(part.total.revenue, 0);
    }
    const missing = app.summarizeReport(provider, defaults, { from: "2026-11-20", to: "2026-11-20" });
    assert.equal(missing.total.stock, null); assert.equal(missing.total.revenue, 0); assert.equal(missing.attendance.plan, 0);
});

test("IN/OUT từng lượt ghé độc lập chấm công ngày; chỉ lượt kết thúc có OUT", () => {
    const snapshot = model.getSnapshot();
    for (const store of snapshot.stores) {
        const visit = store.visit;
        assert.equal(visit.inPhoto, null);
        assert.equal(visit.outPhoto, null);
        if (store.status === "pending") { assert.equal(visit.inAt, null); assert.equal(visit.outAt, null); continue; }
        assert.ok(Number.isFinite(Date.parse(visit.inAt)));
        if (store.status === "working") assert.equal(visit.outAt, null);
        else { assert.ok(Date.parse(visit.outAt) > Date.parse(visit.inAt)); assert.ok((Date.parse(visit.outAt) - Date.parse(visit.inAt)) / 60000 <= 25); }
        assert.notEqual(visit, snapshot.employeeById.get(store.employeeId).attendance);
    }
});

test("Giữ đủ 26.219 shop nguồn, 39 SUP và không đặt tọa độ thiếu/cần kiểm tra lên bản đồ", () => {
    assert.equal(source.stores.length, 26219);
    assert.equal(new Set(source.stores.map(row => row.id)).size, 26219);
    assert.equal(source.supervisors.filter(row => row.id !== "unassigned").length, 39);
    assert.equal(source.stores.filter(app.hasLocation).length, 8877);
    assert.equal(source.stores.filter(row => row.locationStatus === "missing").length, 17270);
    assert.equal(source.stores.filter(row => row.locationStatus === "review").length, 72);
    assert.equal(source.stores.filter(row => row.supervisorId === "unassigned").length, 418);
    assert.equal(source.supervisorMapping, "manager-is-sup-confirmed");
    for (const store of source.stores) if (!app.hasLocation(store)) { assert.equal(store.lat, null); assert.equal(store.lng, null); }
});

test("Đúng 900 NV; mỗi shop được giao một lần và cùng SUP/tỉnh-thành với NV", () => {
    const snapshot = model.getSnapshot();
    assert.equal(snapshot.employees.length, 900);
    const portfolios = snapshot.employees.flatMap(employee => employee.portfolio);
    assert.equal(portfolios.length, snapshot.stores.length);
    assert.equal(new Set(portfolios).size, snapshot.stores.length);
    for (const employee of snapshot.employees) {
        for (const id of employee.portfolio) {
            const store = snapshot.storeById.get(id);
            assert.equal(store.employeeId, employee.id);
            assert.equal(store.supervisorId, employee.supervisorId);
            assert.equal(store.cityId, employee.cityId);
        }
        assert.ok(employee.route.length <= 6);
        assert.ok(employee.route.every(id => employee.portfolio.includes(id)));
        if (employee.currentStoreId) assert.ok(employee.route.includes(employee.currentStoreId));
        if (!employee.schedule.isScheduled) assert.equal(employee.route.length, 0);
    }
});

test("Trạng thái theo thời điểm dữ liệu: ngày cũ đã kết ca, ngày mới có ca sớm và ca đang làm", () => {
    for (const date of app.availableDates) {
        const snapshot = model.getSnapshot(date);
        assert.equal(snapshot.employees.filter(row => row.status === "working").length, date === app.availableDates[0] ? 540 : 0);
        assert.equal(snapshot.employees.filter(row => row.status === "completed").length, date === app.availableDates[0] ? 225 : 765);
        assert.equal(snapshot.employees.filter(row => row.status === "idle").length, 135);
        for (const store of snapshot.stores) {
            assert.ok(Object.hasOwn(app.visitLabels, store.status));
            assert.equal(store.report.revenue, store.report.sold * store.report.price);
            if (store.status !== "completed") assert.equal(store.report.sold, 0);
        }
    }
    const first = model.getSnapshot(), other = model.getSnapshot();
    assert.equal(JSON.stringify(first.employees), JSON.stringify(other.employees));
    first.stores[0].report.sold = -1;
    assert.ok(model.getSnapshot().stores[0].report.sold >= 0);
    assert.throws(() => model.getSnapshot("2030-01-01"), /Ngày không có dữ liệu mẫu/);
});

test("Khoảng cách thẳng chính xác, đối xứng; điểm thiếu tọa độ trả null, hai shop cùng vị trí là 0", () => {
    const a = { lat: 0, lng: 0, locationStatus: "available" };
    const b = { lat: 0, lng: 1, locationStatus: "available" };
    assert.ok(Math.abs(app.distanceBetween(a, b) - 111195.08) < 1);
    assert.equal(app.distanceBetween(a, a), 0);
    assert.equal(app.distanceBetween(a, b), app.distanceBetween(b, a));
    assert.equal(app.distanceBetween(a, { ...b, locationStatus: "missing" }), null);
    assert.equal(app.distanceBetween(a, { ...b, locationStatus: "review" }), null);
});

test("Bộ lọc SUP/NV/tọa độ giữ đúng quan hệ và tìm mã shop nguồn", () => {
    const snapshot = model.getSnapshot();
    const filter = app.createFilterEngine(snapshot);
    const all = filter(defaults);
    assert.equal(all.storeIds.length, 26219);
    assert.equal(all.employeeIds.length, 900);
    const owner = snapshot.employees.find(row => row.supervisorId !== "unassigned");
    const own = filter({ ...defaults, sup: owner.supervisorId, employee: owner.id });
    assert.equal(own.employeeIds.length, 1);
    assert.equal(own.storeIds.length, owner.portfolio.length);
    for (const id of own.storeIds) assert.equal(snapshot.storeById.get(id).employeeId, owner.id);
    assert.equal(filter({ ...defaults, location: "available" }).storeIds.length, 8877);
    assert.equal(filter({ ...defaults, location: "review" }).storeIds.length, 72);
    assert.equal(filter({ ...defaults, location: "unlocated" }).storeIds.length, 17342);
    const store = snapshot.stores[0];
    assert.ok(filter({ ...defaults, query: store.code }).storeIds.includes(store.id));
    assert.equal(filter({ ...defaults, query: "zzzz-no-shop-zzzz" }).storeIds.length, 0);
    assert.equal(app.normalize("Đặng Ngọc Ánh"), "dang ngoc anh");
});

test("Plan theo lịch; Actual ATD chỉ tính đủ IN/OUT và không nhân lên theo số shop", () => {
    const date = "2026-11-19";
    const record = (id, scheduled, inAt, outAt, workDate = date) => ({ id, schedule: { date: workDate, isScheduled: scheduled }, attendance: { date: workDate, inAt, outAt } });
    const start = date + "T08:00:00+07:00", end = date + "T17:00:00+07:00";
    const records = [record("A", true, start, end), record("A", true, start, end), record("B", true, start, null), record("C", true, null, end), record("D", true, null, null), record("E", false, start, end), record("F", true, start, end, "2026-11-18"), record("G", true, "not-a-date", end), record("H", true, end, start)];
    const total = app.attendanceTotals(records, date);
    assert.equal(total.plan, 6);
    assert.equal(total.actualAtd, 2);
    // A night shift can end the next calendar day; its assigned work date owns the công.
    const overnight = record("NIGHT", true, date + "T22:00:00+07:00", "2026-11-20T06:00:00+07:00");
    assert.equal(app.attendanceTotals([overnight], date).actualAtd, 1);
});

test("Plan/ATD khớp ngày, SUP và NV trong bộ lọc; không suy từ số lượt ghé", () => {
    for (const date of app.availableDates) {
        const snapshot = model.getSnapshot(date);
        const counts = app.attendanceTotals(snapshot.employees, date);
        assert.equal(counts.plan, 810);
        assert.equal(counts.actualAtd, date === app.availableDates[0] ? 225 : 765);
        assert.equal(snapshot.employees.filter(row => row.attendance.inAt && !row.attendance.outAt).length, date === app.availableDates[0] ? 540 : 0);
        const filter = app.createFilterEngine(snapshot);
        const supervisor = source.supervisors.find(row => row.id !== "unassigned");
        const result = filter({ ...defaults, sup: supervisor.id });
        const filteredPeople = result.employeeIds.map(id => snapshot.employeeById.get(id));
        const independent = snapshot.employees.filter(row => row.supervisorId === supervisor.id);
        assert.equal(app.attendanceTotals(filteredPeople, date).plan, independent.filter(row => row.schedule.isScheduled).length);
        assert.equal(app.attendanceTotals(filteredPeople, date).actualAtd, independent.filter(row => row.attendance.inAt && row.attendance.outAt).length);
        const inOnly = snapshot.employees.find(row => row.status === "working");
        if (inOnly) {
            assert.equal(app.attendanceTotals([inOnly], date).plan, 1);
            assert.equal(app.attendanceTotals([inOnly], date).actualAtd, 0);
        }
        const complete = snapshot.employees.find(row => row.status === "completed");
        assert.equal(app.attendanceTotals([complete], date).actualAtd, 1);
    }
});
