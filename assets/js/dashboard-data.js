/* Nạp shop nguồn qua HTTP và tạo bộ lọc nền. Cần chạy node serve.cjs. */
(() => {
    const app = window.ViewMapDashboard;
    async function loadData() {
        if (location.protocol === "file:") throw new Error("Hãy chạy node serve.cjs và mở http://127.0.0.1:8080/dashboard.html để nạp bộ dữ liệu lớn.");
        const response = await fetch(new URL("assets/data/shops.json", document.baseURI));
        if (!response.ok) throw new Error("Không tải được dữ liệu shop (HTTP " + response.status + ")");
        const model = app.createModel(await response.json());
        Object.assign(app, model);
        app.loadedAt = new Date().toISOString();
        return model;
    }
    function createFilterClient(snapshot) {
        let worker;
        let engine;
        let counter = 0;
        const pending = new Map();
        const fallback = () => {
            worker?.terminate(); worker = null;
            engine ||= app.createFilterEngine(snapshot);
            for (const { state, resolve } of pending.values()) resolve(engine(state));
            pending.clear();
        };
        try {
            worker = new Worker(new URL("assets/js/dashboard-data-worker.js", document.baseURI));
            worker.onmessage = event => {
                if (event.data.error) return fallback();
                const request = pending.get(event.data.id);
                if (request) { pending.delete(event.data.id); request.resolve(event.data.result); }
            };
            worker.onerror = event => { event.preventDefault(); fallback(); };
            const stores = snapshot.stores.map(({ id, sourceId, code, name, city, district, cityId, region, supervisorId, employeeId, status, locationStatus, lat, lng }) => ({ id, sourceId, code, name, city, district, cityId, region, supervisorId, employeeId, status, locationStatus, lat, lng }));
            worker.postMessage({ type: "init", snapshot: { stores, employees: snapshot.employees } });
        } catch { fallback(); }
        return {
            filter(state) {
                if (!worker) return Promise.resolve(engine(state));
                return new Promise(resolve => {
                    const id = ++counter;
                    pending.set(id, { resolve, state: { ...state } });
                    worker.postMessage({ type: "filter", id, state: { ...state } });
                });
            },
            destroy() { worker?.terminate(); for (const { resolve } of pending.values()) resolve(null); pending.clear(); },
        };
    }
    Object.assign(app, { loadData, createFilterClient });
})();
