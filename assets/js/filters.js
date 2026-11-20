/* Gợi ý lựa chọn, đặt lại form và truyền điều kiện lọc qua URL. */
(() => {
    const app = (window.ViewMap ||= {});

    function initFilters() {
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
    }

    Object.assign(app, { initFilters });
})();
