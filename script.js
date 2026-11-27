(() => {
  const byId = (id) => document.getElementById(id);

  // Fallback local quando uma imagem remota do produto não estiver disponível.
  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.fallback;
      if (fallback && image.src !== new URL(fallback, window.location.href).href) {
        image.src = fallback;
      }
    }, { once: true });
  });

  // Filtros do portfólio.
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const projectCount = document.querySelector(".project-count");

  const updateProjectCount = () => {
    if (!projectCount) return;
    const visible = projectCards.filter((card) => !card.classList.contains("is-hidden")).length;
    projectCount.textContent = String(visible).padStart(2, "0") + " PROJETOS";
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach((card) => {
        const visible = selected === "all" || card.dataset.category === selected;
        card.classList.toggle("is-hidden", !visible);
      });
      updateProjectCount();
    });
  });

  // Demonstração simples do circuito introdutório do SimuEng.
  const simuBoard = byId("simuBoard");
  const circuitToggle = byId("circuitToggle");
  const circuitReset = byId("circuitReset");
  const simuState = byId("simuState");

  const setCircuitPower = (powered) => {
    if (!simuBoard || !circuitToggle || !simuState) return;
    simuBoard.dataset.powered = String(powered);
    circuitToggle.setAttribute("aria-pressed", String(powered));
    const label = circuitToggle.querySelector("span");
    if (label) label.textContent = powered ? "DESLIGAR CIRCUITO" : "ENERGIZAR CIRCUITO";
    simuState.textContent = powered ? "CIRCUITO ENERGIZADO" : "CIRCUITO DESLIGADO";
  };

  circuitToggle?.addEventListener("click", () => {
    setCircuitPower(simuBoard?.dataset.powered !== "true");
  });
  circuitReset?.addEventListener("click", () => setCircuitPower(false));

  // Galerias reais do Milens e do AutoEng.
  const galleryData = {
    milens: {
      title: "Milens",
      kicker: "KEYMOUSE / SOFTWARE CRIATIVO",
      images: [
        { src: "https://milens.com.br/assets/shot-video-texto.jpg", fallback: "assets/projects/milens-video.png", caption: "Edição de vídeo e animação de texto na interface do Milens." },
        { src: "https://milens.com.br/assets/shot-composicao.jpg", fallback: "assets/projects/milens-composicao.png", caption: "Composição, propriedades e controle de animação." },
        { src: "https://milens.com.br/assets/shot-mixer.jpg", fallback: "assets/projects/milens-audio.png", caption: "Área de áudio, mixer e ferramentas de tratamento." },
        { src: "https://milens.com.br/assets/shot-3d-mockup.jpg", fallback: "assets/projects/milens-plugins.png", caption: "Ferramentas de 3D e criação de mockups." }
      ]
    },
    autoeng: {
      title: "AutoEng",
      kicker: "KEYMOUSE / ARQUITETURA & ENGENHARIA",
      images: [
        { src: "assets/projects/autoeng-workspace.jpg", caption: "Espaço de trabalho com planta 2D e painel de propriedades." },
        { src: "assets/projects/autoeng-3d.jpg", caption: "Vista 3D do modelo conectado à planta." },
        { src: "assets/projects/autoeng-sistemas.jpg", caption: "Sistemas e instalações ligados aos elementos do projeto." },
        { src: "assets/projects/autoeng-materiais.jpg", caption: "Materiais, peças e quantidades associados à obra." }
      ]
    }
  };

  const dialog = byId("galleryDialog");
  const galleryTitle = byId("galleryTitle");
  const galleryKicker = byId("galleryKicker");
  const galleryImage = byId("galleryImage");
  const galleryCaption = byId("galleryCaption");
  const galleryCounter = byId("galleryCounter");
  const galleryThumbs = byId("galleryThumbs");
  const galleryPrev = byId("galleryPrev");
  const galleryNext = byId("galleryNext");
  const galleryClose = byId("galleryClose");

  let activeGallery = [];
  let activeIndex = 0;

  const renderGallery = () => {
    if (!activeGallery.length || !galleryImage) return;
    const item = activeGallery[activeIndex];
    galleryImage.src = item.src;
    galleryImage.alt = item.caption;
    galleryImage.onerror = null;
    if (item.fallback) {
      galleryImage.onerror = () => {
        galleryImage.onerror = null;
        galleryImage.src = item.fallback;
      };
    }
    if (galleryCaption) galleryCaption.textContent = item.caption;
    if (galleryCounter) {
      galleryCounter.textContent =
        String(activeIndex + 1).padStart(2, "0") + " / " +
        String(activeGallery.length).padStart(2, "0");
    }
    if (galleryPrev) galleryPrev.disabled = activeGallery.length < 2;
    if (galleryNext) galleryNext.disabled = activeGallery.length < 2;
    if (galleryThumbs) {
      Array.from(galleryThumbs.children).forEach((thumb, index) => {
        const selected = index === activeIndex;
        thumb.classList.toggle("is-active", selected);
        thumb.setAttribute("aria-pressed", String(selected));
      });
      galleryThumbs.querySelector(".is-active")?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };

  const setGalleryIndex = (index) => {
    if (!activeGallery.length) return;
    activeIndex = (index + activeGallery.length) % activeGallery.length;
    renderGallery();
  };

  const openGallery = (name) => {
    const data = galleryData[name];
    if (!data || !dialog || typeof dialog.showModal !== "function") return;
    activeGallery = data.images;
    activeIndex = 0;
    galleryTitle.textContent = data.title;
    galleryKicker.textContent = data.kicker;
    galleryThumbs.replaceChildren();

    activeGallery.forEach((item, index) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "gallery-thumb";
      thumb.setAttribute("aria-label", "Ver imagem " + (index + 1) + ": " + item.caption);
      thumb.setAttribute("aria-pressed", "false");
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = "";
      image.loading = "lazy";
      if (item.fallback) {
        image.addEventListener("error", () => {
          image.src = item.fallback;
        }, { once: true });
      }
      thumb.append(image);
      thumb.addEventListener("click", () => setGalleryIndex(index));
      galleryThumbs.append(thumb);
    });

    dialog.showModal();
    renderGallery();
  };

  document.querySelectorAll("[data-gallery]").forEach((button) => {
    button.addEventListener("click", () => openGallery(button.dataset.gallery));
  });
  galleryPrev?.addEventListener("click", () => setGalleryIndex(activeIndex - 1));
  galleryNext?.addEventListener("click", () => setGalleryIndex(activeIndex + 1));
  galleryClose?.addEventListener("click", () => dialog?.close());

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setGalleryIndex(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setGalleryIndex(activeIndex + 1);
    }
  });

  // Menu compacto no celular.
  const menuToggle = byId("menuToggle");
  const mainNav = byId("mainNav");
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    mainNav?.classList.toggle("is-open", open);
  });
  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    });
  });

  // Barra de progresso e navegação contextual.
  const progress = document.querySelector(".scroll-progress");
  const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
  const navTargets = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  let scrollFrame = 0;

  const updateScroll = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      progress?.style.setProperty("transform", "scaleX(" + ratio + ")");
      let current = null;
      navTargets.forEach((section) => {
        if (section.getBoundingClientRect().top <= 150) current = section;
      });
      navLinks.forEach((link) => {
        const active = current && link.getAttribute("href") === "#" + current.id;
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  // Entradas discretas ao rolar; sem ocultar a página quando o recurso não existe.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(".intro-line, .section-heading, .project-card, .studio-section, .process-steps article, .contact-section");
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach((element) => element.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach((element) => observer.observe(element));
  }

  updateProjectCount();
})();