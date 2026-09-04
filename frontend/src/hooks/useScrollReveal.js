import { useEffect } from 'react';

/**
 * Custom hook to enable scroll animations throughout the application.
 * Uses IntersectionObserver to reveal elements smoothly as they scroll into view.
 */
export function useScrollReveal() {
  useEffect(() => {
    // Check if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) return;

    // Selectors that should have automatic scroll reveal
    const defaultSelectors = [
      '.glass-card',
      '.metric-card',
      '.employee-card',
      '.task-card',
      '.org-node',
      '.project-card',
      '.matrix-table-wrapper',
      '.scroll-reveal',
      '.scroll-fade-up',
      '.scroll-slide-left',
      '.scroll-slide-right',
      '.scroll-scale'
    ];

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once animated, unobserve to avoid redundant work
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeElements = () => {
      const selectorString = defaultSelectors.join(', ');
      const elements = document.querySelectorAll(selectorString);
      
      elements.forEach((el, index) => {
        if (!el.classList.contains('scroll-init')) {
          el.classList.add('scroll-init');
          
          // Stagger children within grids automatically if not already specified
          const parentGrid = el.closest('.metrics-grid, .personnel-grid, .kanban-board, .org-tier');
          if (parentGrid && !el.style.transitionDelay) {
            const siblings = Array.from(parentGrid.children);
            const itemIndex = siblings.indexOf(el);
            if (itemIndex > 0 && itemIndex < 10) {
              el.style.transitionDelay = `${(itemIndex % 6) * 70}ms`;
            }
          }
          
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Re-observe when DOM changes (e.g. switching tabs or filtering lists)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
