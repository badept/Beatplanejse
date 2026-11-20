/* Chọn nhân viên, hiển thị báo cáo và phiếu hoạt động từ URL. */
(() => {
    const app = (window.ViewMap ||= {});

    function initReports() {
        const { pageParams, buildActivityDetails } = app;
        const reportForm = document.querySelector("[data-report-form]");
        const viewStoreReport = document.querySelector("[data-view-store-report]");
        if (reportForm && viewStoreReport) {
            let selectedReportEmployee = "";
            const reportPhone = reportForm.closest(".phone");
            reportForm.querySelectorAll("[data-report-employee]").forEach((choice) => {
                choice.addEventListener("click", () => {
                    selectedReportEmployee = choice.dataset.reportEmployee;
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
            const activityDetails = buildActivityDetails(activityItem);
            const detail = activityDetails[activityType] || activityDetails.attendance;
            const statusClass = activityType === "attendance" ? "green" : "orange";
            const reportEmployee = pageParams.get("employee") || "Nguyễn Văn An";
            activityDetail.innerHTML = `<div class="activity-title"><span class="badge ${statusClass}">${detail.status}</span><h2>${detail.title}</h2><p>${detail.time}</p></div><div class="activity-proof"><svg class="ico"><use href="#camera" /></svg><span>Ảnh xác nhận và thông tin thực hiện</span></div><div class="activity-rows">${detail.rows.map(([label, value]) => `<div><span>${label}</span><b>${value === "Nguyễn Văn An" ? reportEmployee : value}</b></div>`).join("")}</div><button class="btn primary" type="button" data-back data-href="10-store-report.html">Quay lại báo cáo</button>`;
        }
    }

    Object.assign(app, { initReports });
})();
