import React, { useState } from 'react';

export default function OrganigramaView({ users }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const ceo = users.filter((u) => u.role === 'admin');
  const leads = users.filter((u) => u.role === 'lead');
  const developers = users.filter((u) => u.role === 'developer');
  const qa = users.filter((u) => u.role === 'qa');
  const hr = users.filter((u) => u.role === 'hr');

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Organigrama Jerárquico de la Empresa</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', margin: '6px auto 0' }}>
          Estructura organizacional de DevStudio Software. Haz clic en cualquiera de los nodos para explorar responsabilidades, proyectos y privilegios asignados.
        </p>
      </div>

      <div className="org-container">
        {/* Tier 1: Dirección Executiva */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--purple)', fontWeight: 800 }}>
          Nivel 1: Dirección General & Estrategia
        </div>
        <div className="org-tier">
          {ceo.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--purple)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: '0 auto 8px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{user.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--cyan)' }}>{user.position}</p>
              <span className="badge badge-admin" style={{ marginTop: '8px' }}>
                DIRECTOR GENERAL
              </span>
            </div>
          ))}
        </div>

        <div className="org-connector"></div>

        {/* Tier 2: Arquitectura & Liderazgo Técnico */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--cyan)', fontWeight: 800 }}>
          Nivel 2: Arquitectura de Software & Liderazgo Técnico
        </div>
        <div className="org-tier">
          {leads.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--cyan)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--cyan), var(--indigo))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  margin: '0 auto 8px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.position}</p>
              <span className="badge badge-lead" style={{ marginTop: '8px' }}>
                TECH LEAD
              </span>
            </div>
          ))}
        </div>

        <div className="org-connector"></div>

        {/* Tier 3: Desarrollo de Software & QA */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--primary)', fontWeight: 800 }}>
          Nivel 3: Ingeniería de Software & Control de Calidad
        </div>
        <div className="org-tier">
          {developers.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--primary)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.position}</p>
              <span className="badge badge-developer" style={{ marginTop: '6px' }}>
                DEV
              </span>
            </div>
          ))}

          {qa.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--amber)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--amber), var(--rose))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.position}</p>
              <span className="badge badge-qa" style={{ marginTop: '6px' }}>
                QA LEAD
              </span>
            </div>
          ))}
        </div>

        <div className="org-connector"></div>

        {/* Tier 4: Recursos Humanos */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--emerald)', fontWeight: 800 }}>
          Nivel 4: Gestión de Talento & Cultura
        </div>
        <div className="org-tier">
          {hr.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--emerald)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--emerald), var(--teal))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.position}</p>
              <span className="badge badge-hr" style={{ marginTop: '6px' }}>
                RECURSOS HUMANOS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalle de Nodo Jerárquico */}
      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                {selectedNode.name ? selectedNode.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedNode.name}</h3>
                <p style={{ color: 'var(--cyan)' }}>{selectedNode.position}</p>
                <span className={`badge badge-${selectedNode.role}`}>{selectedNode.role.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
              <h5 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>RESPONSABILIDADES DEL PUESTO</h5>
              <p style={{ fontSize: '0.85rem' }}>{selectedNode.bio}</p>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-glass-accent)', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
              <h5 style={{ fontSize: '0.82rem', color: 'var(--primary)', marginBottom: '4px' }}>CANAL DE REPORTE Y ACCESO</h5>
              <p style={{ fontSize: '0.85rem' }}>
                {selectedNode.role === 'admin'
                  ? 'Reporta directamente a la Junta Directiva. Acceso total a decisiones administrativas y estratégicas.'
                  : selectedNode.role === 'lead'
                  ? 'Reporta a Dirección General. Supervisa equipos de desarrollo y arquitectura técnica.'
                  : selectedNode.role === 'developer' || selectedNode.role === 'qa'
                  ? 'Reporta a la Líder Técnica (Sarah Connor). Enfocado en entrega de código y calidad.'
                  : 'Reporta a Dirección. Encargado de la gestión de personal y cumplimiento normativo.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedNode(null)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
