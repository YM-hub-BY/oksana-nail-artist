(() => {
  const init = () => {
    const main = document.querySelector('main');
    if (!main || main.dataset.enhanced) return;
    main.dataset.enhanced = 'true';
    const mobile = matchMedia('(max-width: 720px)');
    const about = document.querySelector('.about-disclosure');
    const hands = document.querySelector('[data-price="hands"]');
    const feet = document.querySelector('[data-price="feet"]');
    const awards = document.querySelector('.awards-gallery');
    const awardsButton = document.querySelector('.awards-toggle');
    const applyLayout = () => {
      if (about) about.open = !mobile.matches;
      if (hands) hands.open = true;
      if (feet) feet.open = !mobile.matches;
      if (awards) awards.classList.remove('is-expanded');
      if (awardsButton) {
        awardsButton.setAttribute('aria-expanded', 'false');
        awardsButton.textContent = 'Все 8 наград';
      }
    };
    applyLayout();
    mobile.addEventListener('change', applyLayout);
    awardsButton?.addEventListener('click', () => {
      const expanded = awards.classList.toggle('is-expanded');
      awardsButton.setAttribute('aria-expanded', String(expanded));
      awardsButton.textContent = expanded ? 'Свернуть награды' : 'Все 8 наград';
      if (!expanded) document.querySelector('#awards').scrollIntoView({ block: 'start' });
    });

    const section = document.querySelector('#portfolio');
    const track = section?.querySelector('.gallery-track');
    if (!track) return;
    const cards = [...section.querySelectorAll('.gallery-card')];
    const filters = [...section.querySelectorAll('.portfolio-filters button')];
    const previous = section.querySelector('[data-direction="-1"]');
    const next = section.querySelector('[data-direction="1"]');
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const updateArrows = () => {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    section.querySelectorAll('.carousel-arrow').forEach(button => {
      button.addEventListener('click', () => {
        const visible = cards.filter(card => !card.hidden);
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = (visible[0]?.getBoundingClientRect().width || 0) + gap;
        const index = Math.round(track.scrollLeft / (step || 1));
        track.scrollTo({
          left: Math.max(0, index + Number(button.dataset.direction)) * step,
          behavior: reduceMotion.matches ? 'instant' : 'smooth',
        });
      });
    });
    filters.forEach(button => {
      button.addEventListener('click', () => {
        const selected = button.dataset.category;
        filters.forEach(item => {
          item.classList.toggle('is-active', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });
        cards.forEach(card => { card.hidden = selected !== 'Все' && card.dataset.category !== selected; });
        track.scrollTo({ left: 0, behavior: 'instant' });
        updateArrows();
      });
    });
    track.addEventListener('scroll', updateArrows, { passive: true });
    new ResizeObserver(updateArrows).observe(track);
    updateArrows();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
