import React, { useState } from 'react';
import RolesMatrixView from './RolesMatrixView';

export default function ManagerDashboard({ users, projects, tasks, currentUser, onUnlockUser, onAssignTask }) {
  const [selectedDev, setSelectedDev] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedProj, setSelectedProj] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState('High');
  const [dueDate, setDueDate] = useState('2026-08-30');
  const [successMsg, setSuccessMsg] = useState('');

  const developers = users.filter((u) => u.role === 'developer' || u.role === 'qa');

  const handleAssign = (e) => {
    e.preventDefault();
    if (!selectedDev || !taskTitle) return;

    onAssignTask({
      title: taskTitle,
      description: taskDesc,
      project_id: selectedProj,
      assigned_to: selectedDev,
      priority,
      status: 'Pending',
      due_date: dueDate,
    });

    const devObj = users.find((u) => String(u.id) === String(selectedDev));
    setSuccessMsg(`✅ Tarea "${taskTitle}" asignada exitosamente a ${devObj ? devObj.name : 'Desarrollador'}.`);
    setTaskTitle('');
    setTaskDesc('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="animate-fade-in">
      <div className="controls-bar" style={{ marginBottom: '24px' }}>
        <div>
          <span className="badge badge-lead" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
            PÁGINA 2: VISTA DE MANAGER & LÍDER TÉCNICO
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Panel de Supervisión y Asignación de Tareas</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Bienvenido, Manager <strong>{currentUser.name}</strong>. Desde aquí supervisas a tu equipo de desarrollo, asignas actividades en tiempo real y gestionas permisos de seguridad.
          </p>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid var(--emerald)',
            color: 'var(--emerald)',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
        {/* Columna 1: Equipo a Cargo y Control de Seguridad */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--cyan)' }}>👥</span> Equipo de Trabajo Asignado ({developers.length} Desarrolladores)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {developers.map((dev) => (
              <div
                key={dev.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-glass)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={dev.avatar}
                    alt=""
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{dev.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>{dev.position}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {dev.is_locked ? (
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      onClick={() => onUnlockUser(dev.id)}
                    >
                      🔓 Desbloquear Cuenta
                    </button>
                  ) : (
                    <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                      ● {dev.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna 2: Asignación Rápida de Tareas al Programador */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--primary)' }}>✍️</span> Asignar Nueva Tarea al Programador
          </h3>

          <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Seleccionar Programador / Empleado</label>
              <select
                required
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedDev}
                onChange={(e) => setSelectedDev(e.target.value)}
              >
                <option value="">-- Elige un desarrollador de tu equipo --</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name} - {dev.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Título de la Actividad</label>
              <input
                type="text"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="Ej. Implementar autenticación JWT y refresh token..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Proyecto</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={selectedProj}
                  onChange={(e) => setSelectedProj(e.target.value)}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prioridad</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                  <option value="Critical">Urgente / Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instrucciones y Detalles Técnicos</label>
              <textarea
                className="search-input"
                style={{ paddingLeft: '12px', minHeight: '60px' }}
                placeholder="Detalla los requisitos de entrega..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
              🚀 Asignar Tarea en Tiempo Real
            </button>
          </form>
        </div>
      </div>

      {/* Tabla de Tareas Asignadas por el Manager */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
          📋 Estado de Tareas Asignadas al Equipo ({tasks.length})
        </h3>

        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>TAREA</th>
                <th>DESARROLLADOR ASIGNADO</th>
                <th>PROYECTO</th>
                <th>PRIORIDAD</th>
                <th>ESTADO ACTUAL</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{task.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.description}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={task.assignee?.avatar}
                        alt=""
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span>{task.assignee?.name || 'Desarrollador'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--cyan)' }}>{task.project?.name || 'Proyecto General'}</td>
                  <td>
                    <span className="badge badge-developer">{task.priority}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          task.status === 'Completed'
                            ? 'rgba(16,185,129,0.2)'
                            : task.status === 'In Progress'
                            ? 'rgba(6,182,212,0.2)'
                            : 'rgba(245,158,11,0.2)',
                        color:
                          task.status === 'Completed'
                            ? 'var(--emerald)'
                            : task.status === 'In Progress'
                            ? 'var(--cyan)'
                            : 'var(--amber)',
                      }}
                    >
                      ● {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriz de Roles, Permisos y Privilegios integrada en el Dashboard del Admin / Manager */}
      <div style={{ marginTop: '32px' }}>
        <RolesMatrixView />
      </div>
    </div>
  );
}
