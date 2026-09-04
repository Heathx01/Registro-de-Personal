import { useEffect } from 'react';

/**
 * Custom hook that creates an interactive spotlight/radial glow effect on hover.
 * Tracks pointer position and sets CSS custom properties --mouse-x and --mouse-y.
 */
export function useSpotlight() {
  useEffect(() => {
    const handlePointerMove = (e) => {
      const target = e.target.closest(
        '.glass-card, .metric-card, .employee-card, .task-card, .org-node, .spotlight-card'
      );
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);
}
