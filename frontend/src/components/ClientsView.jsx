import React, { useState } from 'react';
import ClientDetailModal from './ClientDetailModal';

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
  const [selectedClient, setSelectedClient] = useState(null);

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

      {/* Grid de Tarjetas COMPACTAS de Clientes */}
      <div className="personnel-grid">
        {filteredClients.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron clientes con los criterios de búsqueda.
          </div>
        ) : (
          filteredClients.map((client) => {
            const projectsCount = client.projects ? client.projects.length : 0;

            return (
              <div
                key={client.id}
                className="glass-card clickable-card"
                onClick={() => setSelectedClient(client)}
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {/* Cabecera Compacta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${client.company_type === 'Corporación' ? 'badge-admin' : client.company_type === 'Startup' ? 'badge-cyan' : 'badge-developer'}`}>
                    {client.company_type || 'Empresa'}
                  </span>
                  <span className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-hr'}`}>
                    ● {client.status === 'active' ? 'Activo' : client.status === 'prospect' ? 'Prospecto' : 'Inactivo'}
                  </span>
                </div>

                {/* Título y Contacto Breve */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>{client.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    👤 Contacto: <strong style={{ color: 'var(--text-main)' }}>{client.contact_person || 'No especificado'}</strong>
                  </div>
                </div>

                {/* Footer Compacto de la Tarjeta */}
                <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>
                    🚀 {projectsCount} {projectsCount === 1 ? 'Proyecto' : 'Proyectos'}
                  </span>

                  <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Ver Detalle ➔
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Detalle de Cliente (Expediente Completo) */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          permissions={permissions}
          onClose={() => setSelectedClient(null)}
          onEdit={(c) => {
            setSelectedClient(null);
            onOpenEditClient(c);
          }}
          onDelete={(id) => {
            setSelectedClient(null);
            onDeleteClient(id);
          }}
        />
      )}
    </div>
  );
}
