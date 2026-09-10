import React from 'react';
import { Link } from 'react-router-dom';

export default function CatalogoTable({ items, onDelete, can }) {
  if (items.length === 0) return null;

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.9rem',
          color: '#e2e8f0',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            }}
          >
            <th style={{ padding: '0.75rem 1rem' }}>ID</th>
            <th style={{ padding: '0.75rem 1rem' }}>Solución / Título</th>
            <th style={{ padding: '0.75rem 1rem' }}>Categoría</th>
            <th style={{ padding: '0.75rem 1rem' }}>Precio Sugerido</th>
            <th style={{ padding: '0.75rem 1rem' }}>Entrega Estimada</th>
            <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isActivo = item.status === 'active' || !item.status;
            return (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#6366f1' }}>
                  #{item.id}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 600, color: '#f8fafc' }}>{item.title}</div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      maxWidth: '280px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.category || 'General'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#10b981' }}>
                  ${Number(item.suggested_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>
                  {item.estimated_delivery || 'A convenir'}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: isActivo ? '#34d399' : '#f87171',
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: isActivo ? '#10b981' : '#ef4444',
                      }}
                    />
                    {isActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                    {/* Navegación a edición con URL :id (Paso 9 y 12) */}
                    <Link
                      to={`/catalogos/${item.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: '#60a5fa',
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        transition: 'background 0.2s',
                      }}
                    >
                      ✏️ Editar
                    </Link>

                    {/* Botón protegido por autorización (Paso 15) */}
                    {can('catalogos.delete') && (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          color: '#f87171',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
