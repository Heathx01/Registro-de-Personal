import React from 'react';

export default function ClientDetailModal({ client, permissions, onClose, onEdit, onDelete }) {
  if (!client) return null;

  const projectsCount = client.projects ? client.projects.length : 0;
  const totalBudget = client.projects
    ? client.projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span className={`badge ${client.company_type === 'Corporación' ? 'badge-admin' : client.company_type === 'Startup' ? 'badge-cyan' : 'badge-developer'}`}>
                {client.company_type || 'Empresa'}
              </span>
              <span className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-hr'}`}>
                ● {client.status === 'active' ? 'Activo' : client.status === 'prospect' ? 'Prospecto' : 'Inactivo'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{client.name}</h2>
            {client.tax_id && (
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 600 }}>
                ID FISCAL / TAX ID: {client.tax_id}
              </span>
            )}
          </div>

          <button className="btn btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Sección de Información de Contacto y Ubicación */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.86rem', marginBottom: '20px' }}>
          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '2px' }}>PERSONA DE CONTACTO</span>
            <strong style={{ color: 'var(--text-main)' }}>{client.contact_person || 'No especificada'}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '2px' }}>CORREO ELECTRÓNICO</span>
            {client.email ? (
              <a href={`mailto:${client.email}`} style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600 }}>
                {client.email}
              </a>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>Sin correo</span>
            )}
          </div>

          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '2px' }}>TELÉFONO DIRECTO</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{client.phone || 'No especificado'}</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '2px' }}>DIRECCIÓN FÍSICA & CIUDAD</span>
            <span style={{ color: 'var(--text-main)' }}>
              {client.address ? client.address : ''} {client.city ? `(${client.city})` : ''}
              {!client.address && !client.city && 'Sin dirección'}
            </span>
          </div>
        </div>

        {/* Proyectos Vinculados */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
              📋 Proyectos Vinculados ({projectsCount})
            </h4>
            {permissions.can_view_salaries && totalBudget > 0 && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald)' }}>
                Valor Total: ${totalBudget.toLocaleString()} USD
              </span>
            )}
          </div>

          {client.projects && client.projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {client.projects.map((proj) => (
                <div
                  key={proj.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{proj.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {proj.project_type || 'Desarrollo Web'} • {proj.progress || 0}% de avance
                    </div>
                  </div>
                  {permissions.can_view_salaries && proj.budget > 0 && (
                    <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 10px' }}>
                      ${Number(proj.budget).toLocaleString()} {proj.currency || 'USD'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Sin proyectos asignados a este cliente actualmente.
            </div>
          )}
        </div>

        {/* Notas u Observaciones */}
        {client.notes && (
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              📝 NOTAS U OBSERVACIONES
            </span>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px' }}>
              {client.notes}
            </div>
          </div>
        )}

        {/* Acciones de Edición / Cierre */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {permissions.can_manage_projects ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => onEdit(client)}>
                ✏️ Editar Cliente
              </button>
              <button className="btn btn-secondary" style={{ color: 'var(--rose)' }} onClick={() => onDelete(client.id)}>
                🗑️ Eliminar
              </button>
            </div>
          ) : <div />}

          <button className="btn btn-primary" onClick={onClose}>
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
}
