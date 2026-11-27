(() => {
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const projectCount = document.querySelector(".project-count");

  const updateCount = () => {
    const visible = projectCards.filter((card) => !card.classList.contains("is-hidden")).length;
    if (projectCount) {
      projectCount.textContent = String(visible).padStart(2, "0") + " PROJETOS SELECIONADOS";
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const shouldShow = selectedCategory === "all" || card.dataset.category === selectedCategory;
        card.classList.toggle("is-hidden", !shouldShow);
      });

      updateCount();
    });
  });

  updateCount();
})();