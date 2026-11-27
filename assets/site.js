(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }));

  const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  nav?.querySelectorAll('a[href]').forEach(link => {
    const target = new URL(link.href, location.origin).pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    if (target && (path === target || (target !== '' && path.startsWith(target + '/')))) {
      link.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const controls = [...group.querySelectorAll('[data-filter]')];
    const cards = [...document.querySelectorAll('[data-filter-item]')];
    controls.forEach(control => control.addEventListener('click', () => {
      const value = control.dataset.filter;
      controls.forEach(item => item.setAttribute('aria-pressed', String(item === control)));
      cards.forEach(card => {
        const match = value === 'all' || (card.dataset.filterItem || '').split(' ').includes(value);
        card.hidden = !match;
      });
    }));
  });

  document.querySelectorAll('[data-accordion]').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });

  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback && !img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = 'true';
        img.src = img.dataset.fallback;
      }
    });
  });
})();
