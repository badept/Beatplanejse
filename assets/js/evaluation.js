/* Lựa chọn mức đánh giá SA. */
(() => {
    const app = (window.ViewMap ||= {});

    function initEvaluation() {
        document.querySelectorAll(".rating-stars").forEach((rating) => {
            const stars = [...rating.querySelectorAll("button")];
            stars.forEach((star, index) => {
                star.addEventListener("click", () => {
                    stars.forEach((item, itemIndex) => {
                        item.classList.toggle("selected", itemIndex <= index);
                    });
                });
            });
        });
    }

    Object.assign(app, { initEvaluation });
})();
