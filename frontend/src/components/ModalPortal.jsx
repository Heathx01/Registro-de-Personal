import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Componente Portal para modales en React.
 * Monta el modal directamente en `document.body` para escapar de cualquier stacking context
 * (transform, filter, will-change en contenedores padres como .view-container) y garantizar
 * que el modal siempre aparezca por encima del Navbar sticky (z-index 99999).
 */
export default function ModalPortal({ children }) {
  useEffect(() => {
    // Evita el scroll del body mientras el modal está abierto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(children, document.body);
}
