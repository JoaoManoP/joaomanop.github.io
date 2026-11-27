(() => {
  const filters = document.querySelectorAll(".filter-button");
  const cards = document.querySelectorAll(".project-card");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;

      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      cards.forEach((card) => {
        const visible = selected === "all" || card.dataset.category === selected;
        card.classList.toggle("is-hidden", !visible);
      });
    });
  });
})();