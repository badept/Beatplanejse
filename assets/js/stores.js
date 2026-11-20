/* Danh sách hoàn thành, chi tiết cửa hàng và liên kết báo cáo. */
(() => {
    const app = (window.ViewMap ||= {});

    function initStores() {
        const { pageParams, completionProfiles, storeDetails } = app;
        const requestedStore = pageParams.get("store")?.trim().toLocaleLowerCase("vi");

        document.querySelectorAll(".completed-card").forEach((card) => {
            const cardName = card.dataset.employeeName || "";
            const profileKey = cardName.includes("Bảo") ? "bao" : cardName.includes("Tuấn") ? "tuan" : "mai";
            const profile = completionProfiles[profileKey];
            const link = card.querySelector(".completed-total-link");
            if (link) {
                link.dataset.href = `12-completed-stores.html?employee=${profileKey}`;
                link.querySelector("span").innerHTML = `<b>${profile.done}/${profile.total}</b> cửa hàng đã hoàn thành`;
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
                heading.textContent = "Nhân viên hoàn thành tại cửa hàng (1)";
                const completedEmployee = document.createElement("div");
                completedEmployee.className = "employee";
                completedEmployee.innerHTML = `<span class="avatar completed-avatar">${completedProfile.initials}</span><div><b class="employee-name">${completedProfile.name}</b><br /><span class="badge orange">Hoàn thành</span></div><svg class="ico"><use href="#chevron" /></svg>`;
                heading.insertAdjacentElement("afterend", completedEmployee);
            }
            const employeeReportButton = document.querySelector("[data-store-employee-report]");
            if (employeeReportButton) {
                employeeReportButton.dataset.href = `10-store-report.html?employee=${encodeURIComponent(completedProfile.name)}&store=${requestedStore || "an-phu"}`;
                employeeReportButton.innerHTML = '<svg class="ico"><use href="#chart" /></svg>Xem báo cáo nhân viên';
            }
        }
        if (requestedStore) {
            const matchingStores = [...document.querySelectorAll(".store-map-pin[data-store-name]")]
                .filter((store) => store.dataset.storeName.toLocaleLowerCase("vi").includes(requestedStore));
            const store = matchingStores[0];
            if (store) {
                store.classList.add("is-searched-store");
                const map = store.closest(".map");
                if (map?.dataset.zoom) app.setMapZoom(map, 16);
                window.setTimeout(() => app.openInfoModal(store), 180);
            }
        }
    }

    Object.assign(app, { initStores });
})();
