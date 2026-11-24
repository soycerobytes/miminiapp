// Decorative enhancement only. Final, readable SVGs are the default without JS.
const html = document.documentElement;
if (!html.classList.contains('motion-ready')) {
  const roots = [...document.querySelectorAll<SVGSVGElement>('[data-motion]')];
  const controls = [
    ...document.querySelectorAll<HTMLButtonElement>('[data-motion-control]'),
  ];
  let manuallyPaused = false;
  let observer: IntersectionObserver | undefined;

  function settle(root: SVGSVGElement) {
    root.dataset.motionAssembled = 'true';
    root.dataset.motionEntered = 'true';
    delete root.dataset.motionHover;
  }

  function render() {
    html.dataset.motionPaused = String(manuallyPaused || document.hidden);
    for (const button of controls) {
      const label =
        (manuallyPaused ? button.dataset.resume : button.dataset.pause) ?? '';
      button.ariaLabel = label;
      button.title = label;
      button.setAttribute('aria-pressed', String(manuallyPaused));
      const status = document.getElementById(
        button.getAttribute('aria-describedby') ?? '',
      );
      if (status)
        status.textContent =
          (manuallyPaused ? button.dataset.paused : button.dataset.running) ??
          '';
    }
  }

  try {
    observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const root = target as SVGSVGElement;
          root.dataset.motionVisible = String(isIntersecting);
          if (isIntersecting && !root.dataset.motionSeen) {
            if (manuallyPaused) settle(root);
            root.dataset.motionSeen = 'true';
          }
        }
      },
      { threshold: 0.16 },
    );
    roots.forEach((root) => observer!.observe(root));
    controls.forEach((button) =>
      button.addEventListener('click', () => {
        if (!html.classList.contains('motion-ready')) return;
        manuallyPaused = !manuallyPaused;
        render();
      }),
    );
    document.addEventListener('animationend', (event) => {
      const target = event.target;
      if (!(target instanceof SVGElement)) return;
      const root = target.closest<SVGSVGElement>('[data-motion]');
      if (!root) return;
      if (
        event.animationName === 'mma-assemble' &&
        target.classList.contains('p4')
      )
        root.dataset.motionAssembled = 'true';
      if (
        event.animationName === 'mma-hover' &&
        target.classList.contains('p4')
      )
        delete root.dataset.motionHover;
      if (
        event.animationName === 'mma-enter' &&
        target.dataset.entry === 'dots'
      )
        root.dataset.motionEntered = 'true';
    });
    document.addEventListener('pointerover', (event) => {
      if (
        manuallyPaused ||
        document.hidden ||
        event.pointerType === 'touch' ||
        !matchMedia('(hover: hover)').matches
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('.brand');
      if (
        !link ||
        (event.relatedTarget instanceof Node &&
          link.contains(event.relatedTarget))
      )
        return;
      const root = link.querySelector<SVGSVGElement>('[data-motion="brand"]');
      if (
        root?.dataset.motionAssembled &&
        root.dataset.motionVisible === 'true'
      )
        root.dataset.motionHover = 'true';
    });
    document.addEventListener('visibilitychange', render);
    window.addEventListener('pageshow', render);
    render();
    html.classList.add('motion-ready');
    controls.forEach((button) => {
      button.hidden = false;
    });
  } catch {
    observer?.disconnect();
    html.classList.remove('motion-ready');
    roots.forEach(settle);
    controls.forEach((button) => {
      button.hidden = true;
    });
  }
}
