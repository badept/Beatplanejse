/* Danh sách nhân viên, chuẩn bị dữ liệu modal và tìm kiếm. */
(() => {
    const app = (window.ViewMap ||= {});

    function initEmployees() {
        const { pageParams, extraEmployees } = app;
        const workingEmployeeList = document.querySelector(".working-list-body .employee-list");
        if (workingEmployeeList) {

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
                card.dataset.statusClass = "green";
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
    }

    Object.assign(app, { initEmployees });
})();
