import React from 'react';
import { Link } from 'react-router-dom';

export default function CatalogoTable({ items, onDelete, can }) {
  if (items.length === 0) return null;

  return (
    <div className="matrix-table-wrapper glass-card">
      <table className="matrix-table">
        <thead>
          <tr>
            <th style={{ width: '70px' }}>ID</th>
            <th>Solución / Título</th>
            <th>Categoría</th>
            <th>Precio Sugerido</th>
            <th>Entrega Estimada</th>
            <th>Estado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isActivo = item.status === 'active' || !item.status;
            return (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  #{item.id}
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      maxWidth: '320px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </div>
                </td>
                <td>
                  <span className="badge badge-developer">
                    {item.category || 'General'}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--emerald)' }}>
                  ${Number(item.suggested_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {item.estimated_delivery || 'A convenir'}
                </td>
                <td>
                  <span className={isActivo ? 'badge badge-active' : 'badge badge-danger'}>
                    ● {isActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                    {/* Navegación a edición con URL :id (Paso 9 y 12) */}
                    <Link
                      to={`/catalogos/${item.id}`}
                      className="role-switch-btn"
                      style={{ padding: '4px 10px', fontSize: '0.78rem', textDecoration: 'none', color: 'var(--cyan)' }}
                      title="Editar con Ruta Dinámica :id"
                    >
                      ✏️ Editar
                    </Link>

                    {/* Botón protegido por autorización (Paso 15) */}
                    {can && can('catalogos.delete') && (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="role-switch-btn"
                        style={{ padding: '4px 10px', fontSize: '0.78rem', background: 'rgba(244,63,94,0.2)', color: 'var(--rose)' }}
                        title="Eliminar"
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
