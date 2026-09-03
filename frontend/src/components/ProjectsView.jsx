import React, { useState } from 'react';

export default function ProjectsView({
  projects,
  permissions,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
}) {
  const [filterStatus, setFilterStatus] = useState('');

  const filteredProjects = projects.filter((p) => (filterStatus ? p.status === filterStatus : true));

  return (
    <div className="animate-fade-in">
      <div className="controls-bar">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Proyectos de Desarrollo de Software</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Control de productos digitales, plataformas SaaS, aplicaciones móviles y asignación de líderes ({projects.length} proyectos).
          </p>
        </div>

        {permissions.can_manage_projects && (
          <button className="btn btn-primary" onClick={onOpenAddProject}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Crear Nuevo Proyecto
          </button>
        )}
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        <button
          className={`role-switch-btn ${filterStatus === '' ? 'active' : ''}`}
          onClick={() => setFilterStatus('')}
        >
          Todos los Proyectos ({projects.length})
        </button>
        <button
          className={`role-switch-btn ${filterStatus === 'Active' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Active')}
        >
          Activos
        </button>
        <button
          className={`role-switch-btn ${filterStatus === 'In Code Review' ? 'active' : ''}`}
          onClick={() => setFilterStatus('In Code Review')}
        >
          En Revisión de Código
        </button>
      </div>

      <div className="personnel-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-developer">{project.category || 'Software Project'}</span>
                {project.client && (
                  <span className="badge badge-cyan">🏢 {project.client.name}</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-active">● {project.status}</span>
                {permissions.can_manage_projects && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {onEditProject && (
                      <button
                        className="role-switch-btn"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        title="Editar Proyecto"
                        onClick={() => onEditProject(project)}
                      >
                        ✏️
                      </button>
                    )}
                    {permissions.can_delete_records && onDeleteProject && (
                      <button
                        className="role-switch-btn"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', background: 'rgba(244,63,94,0.2)', color: 'var(--rose)' }}
                        title="Eliminar Proyecto"
                        onClick={() => onDeleteProject(project.id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{project.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {project.description}
              </p>
            </div>

            {/* Ficha Financiera / Comercial (Para Admin / Lead) */}
            {permissions.can_view_salaries && (project.budget > 0 || project.project_type) && (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>TIPO DE SERVICIO</span>
                  <strong>{project.project_type || 'Desarrollo Web'}</strong>
                </div>
                {project.budget > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'block' }}>PRESUPUESTO</span>
                    <strong style={{ color: 'var(--emerald)' }}>
                      ${Number(project.budget).toLocaleString()} {project.currency || 'USD'}
                    </strong>
                  </div>
                )}
              </div>
            )}

            {project.lead && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                <img
                  src={project.lead.avatar}
                  alt=""
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>LÍDER DE PROYECTO:</span>
                  <div style={{ fontWeight: 600 }}>{project.lead.name} ({project.lead.position})</div>
                </div>
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>AVANCE DEL PROYECTO</span>
                <span style={{ fontWeight: 700, color: 'var(--cyan)' }}>{project.progress || 0}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${project.progress || 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary) 0%, var(--cyan) 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                  }}
                ></div>
              </div>
            </div>

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  TECNOLOGÍAS / STACK:
                </span>
                <div className="skills-list">
                  {project.tech_stack.map((tech, idx) => (
                    <span key={idx} className="skill-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: '10px', fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
              <span>📅 Fecha Entrega: {project.deadline || '2026-12-31'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
