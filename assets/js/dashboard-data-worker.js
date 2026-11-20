/* Chỉ xử lý dữ liệu, không truy cập DOM hoặc nguồn mạng. */
importScripts("dashboard-model.js");
let filter;
self.onmessage = event => {
    const message = event.data;
    try {
        if (message.type === "init") {
            const snapshot = message.snapshot;
            snapshot.employeeById = new Map(snapshot.employees.map(row => [row.id, row]));
            filter = self.ViewMapDashboard.createFilterEngine(snapshot);
        } else if (message.type === "filter") self.postMessage({ id: message.id, result: filter(message.state) });
    } catch (error) { self.postMessage({ id: message.id, error: error.message }); }
};
