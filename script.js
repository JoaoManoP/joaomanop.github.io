(() => {
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const projectCards = Array.from(document.querySelectorAll(".work-card"));
  const projectCount = document.querySelector(".project-count");

  const viewer = document.getElementById("projectViewer");
  const viewerTitle = document.getElementById("viewerTitle");
  const viewerKicker = document.getElementById("viewerKicker");
  const viewerImageStage = document.getElementById("viewerImageStage");
  const viewerImage = document.getElementById("viewerImage");
  const viewerCaption = document.getElementById("viewerCaption");
  const viewerSpecial = document.getElementById("viewerSpecial");
  const viewerCounter = document.getElementById("viewerCounter");
  const viewerThumbnails = document.getElementById("viewerThumbnails");
  const previousButton = document.getElementById("viewerPrev");
  const nextButton = document.getElementById("viewerNext");
  const closeButton = document.getElementById("viewerClose");

  const projectLabels = {
    milens: { title: "Milens", kicker: "SUÍTE DE CRIAÇÃO / CAPTURAS DO APLICATIVO" },
    rumogo: { title: "Rumo'Go", kicker: "IDENTIDADE VISUAL E MAPA DO PROJETO" },
    autoeng: { title: "AutoEng", kicker: "ARQUITETURA E ENGENHARIA / CAPTURAS DO APLICATIVO" },
    lume: { title: "LUME", kicker: "ASSISTENTE PESSOAL / IDENTIDADE DO PROJETO" }
  };

  const projectGalleries = {
    milens: [
      { src: "assets/projects/milens-video.png", name: "Edição de vídeo — monitor, propriedades e timeline multitrilha" },
      { src: "assets/projects/milens-composicao.png", name: "Composição — controles de animação, keyframes e curvas" },
      { src: "assets/projects/milens-audio.png", name: "Áudio — mixer, medição de loudness e trilhas" },
      { src: "assets/projects/milens-plugins.png", name: "Efeitos — biblioteca de plugins e pré-visualização" }
    ],
    rumogo: [
      { src: "assets/projects/rumogo-logo.png", name: "Identidade visual oficial do Rumo'Go" },
      { src: "assets/projects/rumogo-mapa.webp", name: "Mapa base utilizado no projeto de navegação" }
    ],
    autoeng: [
      { src: "assets/projects/autoeng-workspace.jpg", name: "Workspace — planta 2D e elementos de arquitetura e instalações" },
      { src: "assets/projects/autoeng-3d.jpg", name: "Modelo 3D derivado da planta do projeto" },
      { src: "assets/projects/autoeng-materiais.jpg", name: "Materiais — catálogo, quantidades e orçamento" },
      { src: "assets/projects/autoeng-sistemas.jpg", name: "Sistemas — esquema de conexões hidráulicas e instalações" }
    ],
    lume: [
      { src: "assets/projects/lume-icon.png", name: "Ícone oficial do assistente LUME" }
    ]
  };

  let activeGallery = [];
  let activeIndex = 0;

  const updateProjectCount = () => {
    if (!projectCount) return;
    const visible = projectCards.filter((card) => !card.classList.contains("is-hidden")).length;
    projectCount.textContent = String(visible).padStart(2, "0") + " PROJETOS";
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
      updateProjectCount();
    });
  });

  const renderThumbnailStrip = () => {
    viewerThumbnails.replaceChildren();
    activeGallery.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "viewer-thumb" + (index === activeIndex ? " is-active" : "");
      button.setAttribute("aria-label", "Ver imagem " + (index + 1) + ": " + item.name);
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = "";
      button.append(image);
      button.addEventListener("click", () => setGalleryIndex(index));
      viewerThumbnails.append(button);
    });
    viewerThumbnails.hidden = activeGallery.length < 2;
  };

  const setGalleryIndex = (index) => {
    if (!activeGallery.length) return;
    activeIndex = (index + activeGallery.length) % activeGallery.length;
    const item = activeGallery[activeIndex];

    viewerImage.src = item.src;
    viewerImage.alt = item.name;
    viewerCaption.textContent = item.name;
    viewerCounter.textContent =
      String(activeIndex + 1).padStart(2, "0") + " / " +
      String(activeGallery.length).padStart(2, "0");

    previousButton.disabled = activeGallery.length < 2;
    nextButton.disabled = activeGallery.length < 2;

    Array.from(viewerThumbnails.children).forEach((thumbnail, thumbnailIndex) => {
      thumbnail.classList.toggle("is-active", thumbnailIndex === activeIndex);
    });
    viewerThumbnails.querySelector(".is-active")?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const openGallery = (project) => {
    const config = projectLabels[project];
    const gallery = projectGalleries[project] || [];
    if (!config || !gallery.length) return;

    activeGallery = gallery;
    activeIndex = 0;
    viewerTitle.textContent = config.title;
    viewerKicker.textContent = config.kicker;
    viewerImageStage.hidden = false;
    viewerSpecial.hidden = true;
    renderThumbnailStrip();
    setGalleryIndex(0);
    viewer.showModal();
  };

  const openSimuEngDetails = () => {
    activeGallery = [];
    viewerTitle.textContent = "SimuEng";
    viewerKicker.textContent = "COMO O PRIMEIRO GUIA DE CIRCUITO FUNCIONA";
    viewerImageStage.hidden = true;
    viewerThumbnails.hidden = true;
    viewerCounter.textContent = "FLUXO DIDÁTICO";
    viewerSpecial.hidden = false;
    viewerSpecial.innerHTML = `
      <p class="viewer-special-copy">O guia inicial do SimuEng ajuda a montar um circuito simples em etapas. O motor verifica as conexões e explica o resultado antes de o aluno construir o circuito físico.</p>
      <div class="viewer-flow" aria-label="Etapas do primeiro circuito">
        <div class="viewer-flow-step"><strong>Bateria</strong><small>5 V</small></div>
        <span class="viewer-flow-arrow" aria-hidden="true">→</span>
        <div class="viewer-flow-step"><strong>Resistor</strong><small>330 Ω</small></div>
        <span class="viewer-flow-arrow" aria-hidden="true">→</span>
        <div class="viewer-flow-step"><strong>LED</strong><small>Polaridade verificada</small></div>
      </div>
      <p class="viewer-note">O simulador também identifica situações como LED invertido ou queimado. Este diagrama explica o fluxo; não é uma captura de tela do aplicativo.</p>
    `;
    viewer.showModal();
  };

  document.querySelectorAll("[data-open-gallery]").forEach((button) => {
    button.addEventListener("click", () => openGallery(button.dataset.openGallery));
  });
  document.querySelectorAll("[data-open-details]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.openDetails === "simueng") openSimuEngDetails();
    });
  });

  previousButton.addEventListener("click", () => setGalleryIndex(activeIndex - 1));
  nextButton.addEventListener("click", () => setGalleryIndex(activeIndex + 1));
  closeButton.addEventListener("click", () => viewer.close());

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener("keydown", (event) => {
    if (!viewer.open || viewerImageStage.hidden) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setGalleryIndex(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setGalleryIndex(activeIndex + 1);
    }
  });

  updateProjectCount();
})();