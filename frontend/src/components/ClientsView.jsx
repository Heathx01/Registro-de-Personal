import React, { useState } from 'react';

export default function ClientsView({
  clients,
  permissions,
  onOpenAddClient,
  onOpenEditClient,
  onDeleteClient,
  onLockAccess,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contact_person && client.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.city && client.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter ? client.company_type === typeFilter : true;
    const matchesStatus = statusFilter ? client.status === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Métricas financieras y operativas de clientes
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'active').length;
  const totalProjectsAssigned = clients.reduce((acc, c) => acc + (c.projects ? c.projects.length : 0), 0);
  const totalRevenueProjected = clients.reduce((acc, c) => {
    if (!c.projects) return acc;
    return acc + c.projects.reduce((pAcc, p) => pAcc + (Number(p.budget) || 0), 0);
  }, 0);

  return (
    <div className="animate-fade-in">
      {/* Resumen Ejecutivo de Clientes */}
      <div className="metrics-grid" style={{ marginBottom: '24px' }}>
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">TOTAL CLIENTES</span>
            <div className="metric-icon metric-icon-primary">🏢</div>
          </div>
          <div className="metric-value">{totalClients}</div>
          <div className="metric-subtitle">Cartera de clientes registrados</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">CLIENTES ACTIVOS</span>
            <div className="metric-icon metric-icon-emerald">✅</div>
          </div>
          <div className="metric-value">{activeClients}</div>
          <div className="metric-subtitle">Con proyectos en desarrollo</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">PROYECTOS EN CURSO</span>
            <div className="metric-icon metric-icon-cyan">🚀</div>
          </div>
          <div className="metric-value">{totalProjectsAssigned}</div>
          <div className="metric-subtitle">Proyectos vinculados a clientes</div>
        </div>

        {permissions.can_view_salaries && (
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">PRESUPUESTO TOTAL</span>
              <div className="metric-icon metric-icon-purple">💰</div>
            </div>
            <div className="metric-value" style={{ color: 'var(--emerald)' }}>
              ${totalRevenueProjected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="metric-subtitle">Valor proyectado de cartera</div>
          </div>
        )}
      </div>

      {/* Barra de Controles y Filtros */}
      <div className="controls-bar" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <div className="search-box" style={{ flex: '1 1 240px' }}>
            <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar cliente, contacto o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Todos los Tipos de Empresa</option>
            <option value="Corporación">Corporación</option>
            <option value="Startup">Startup</option>
            <option value="Pyme">Pyme</option>
            <option value="Independiente">Independiente</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="prospect">Prospecto</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {onLockAccess && (
            <button className="btn btn-secondary" style={{ color: 'var(--rose)' }} onClick={onLockAccess} title="Bloquear vista de seguridad">
              🔒 Bloquear Acceso
            </button>
          )}

          {permissions.can_manage_projects && (
            <button className="btn btn-primary" onClick={onOpenAddClient}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Registrar Cliente
            </button>
          )}
        </div>
      </div>

      {/* Grid de Tarjetas de Clientes */}
      <div className="personnel-grid">
        {filteredClients.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron clientes con los criterios de búsqueda.
          </div>
        ) : (
          filteredClients.map((client) => (
            <div key={client.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge ${client.company_type === 'Corporación' ? 'badge-admin' : client.company_type === 'Startup' ? 'badge-cyan' : 'badge-developer'}`}>
                  {client.company_type || 'Empresa'}
                </span>
                <span className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-hr'}`}>
                  ● {client.status === 'active' ? 'Activo' : client.status === 'prospect' ? 'Prospecto' : 'Inactivo'}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{client.name}</h3>
                {client.tax_id && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 600 }}>
                    ID FISCAL / TAX: {client.tax_id}
                  </span>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                {client.contact_person && (
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>👤 CONTACTO: </span>
                    <strong style={{ color: 'var(--text-main)' }}>{client.contact_person}</strong>
                  </div>
                )}
                {client.email && (
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>✉️ CORREO: </span>
                    <a href={`mailto:${client.email}`} style={{ color: 'var(--cyan)', textDecoration: 'none' }}>{client.email}</a>
                  </div>
                )}
                {client.phone && (
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>📞 TELÉFONO: </span>
                    <span style={{ color: 'var(--text-main)' }}>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>📍 DIRECCIÓN: </span>
                    <span style={{ color: 'var(--text-main)' }}>{client.address} {client.city ? `(${client.city})` : ''}</span>
                  </div>
                )}
              </div>

              {/* Proyectos Asignados */}
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  PROYECTOS VINCULADOS ({client.projects ? client.projects.length : 0}):
                </span>
                {client.projects && client.projects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {client.projects.map((proj) => (
                      <div
                        key={proj.id}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{proj.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {proj.project_type || 'Desarrollo'} • {proj.progress || 0}% avance
                          </div>
                        </div>
                        {permissions.can_view_salaries && proj.budget > 0 && (
                          <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                            ${Number(proj.budget).toLocaleString()} {proj.currency || 'USD'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', italic: 'true' }}>
                    Sin proyectos asignados actualmente.
                  </div>
                )}
              </div>

              {client.notes && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
                  📝 {client.notes}
                </div>
              )}

              {permissions.can_manage_projects && (
                <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onOpenEditClient(client)}>
                    ✏️ Editar Cliente
                  </button>
                  <button className="btn btn-secondary" style={{ color: 'var(--rose)', padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onDeleteClient(client.id)}>
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
