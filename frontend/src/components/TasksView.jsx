import React, { useState } from 'react';

export default function TasksView({
  tasks,
  users,
  currentUser,
  permissions,
  onUpdateTaskStatus,
  onOpenAddTask,
  onEditTask,
  onDeleteTask,
}) {
  const [filterUser, setFilterUser] = useState('');

  const filteredTasks = tasks.filter((t) => (filterUser ? String(t.assigned_to) === String(filterUser) : true));

  const columns = [
    { key: 'Pending', label: '⏳ Pendiente (Backlog)', color: 'var(--amber)' },
    { key: 'In Progress', label: '🚀 En Progreso', color: 'var(--cyan)' },
    { key: 'In Review', label: '🔍 En Revisión / QA', color: 'var(--purple)' },
    { key: 'Completed', label: '✅ Completado', color: 'var(--emerald)' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="controls-bar">
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Tareas Diarias del Personal (Kanban)</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Control diario de actividades de desarrollo, refactorización, pruebas de calidad y gestión ({tasks.length} tareas totales).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="">Todas las Tareas del Personal</option>
            <option value={currentUser.id}>⭐ Mis Tareas Asignadas ({currentUser.name})</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.position})
              </option>
            ))}
          </select>

          {permissions.can_assign_tasks && (
            <button className="btn btn-primary" onClick={onOpenAddTask}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Asignar Tarea al Personal
            </button>
          )}
        </div>
      </div>

      <div className="kanban-board">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="kanban-col">
              <div className="col-header" style={{ borderBottom: `2px solid ${col.color}` }}>
                <span style={{ color: col.color }}>{col.label}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-main)' }}>
                  {colTasks.length}
                </span>
              </div>

              {colTasks.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  Sin tareas en esta columna
                </div>
              ) : (
                colTasks.map((task) => (
                  <div key={task.id} className="glass-card task-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.65rem',
                          background:
                            task.priority === 'Critical'
                              ? 'rgba(244,63,94,0.2)'
                              : task.priority === 'High'
                              ? 'rgba(245,158,11,0.2)'
                              : 'rgba(99,102,241,0.2)',
                          color:
                            task.priority === 'Critical'
                              ? 'var(--rose)'
                              : task.priority === 'High'
                              ? 'var(--amber)'
                              : 'var(--cyan)',
                        }}
                      >
                        Prioridad: {task.priority}
                      </span>
                      {permissions.can_assign_tasks && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {onEditTask && (
                            <button
                              className="role-switch-btn"
                              style={{ padding: '2px 5px', fontSize: '0.65rem' }}
                              title="Editar Tarea"
                              onClick={() => onEditTask(task)}
                            >
                              ✏️
                            </button>
                          )}
                          {onDeleteTask && (
                            <button
                              className="role-switch-btn"
                              style={{ padding: '2px 5px', fontSize: '0.65rem', background: 'rgba(244,63,94,0.2)', color: 'var(--rose)' }}
                              title="Eliminar Tarea"
                              onClick={() => onDeleteTask(task.id)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3, marginTop: '4px' }}>{task.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{task.description}</p>

                    {task.assignee && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <img
                          src={task.assignee.avatar}
                          alt=""
                          style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>{task.assignee.name}</span>
                      </div>
                    )}

                    {/* Botones para cambiar de estado */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                      {col.key !== 'Pending' && (
                        <button
                          className="role-switch-btn"
                          style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                          onClick={() => onUpdateTaskStatus(task.id, col.key === 'In Progress' ? 'Pending' : col.key === 'In Review' ? 'In Progress' : 'In Review')}
                        >
                          ← Mover Atrás
                        </button>
                      )}
                      {col.key !== 'Completed' && (
                        <button
                          className="role-switch-btn"
                          style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'var(--primary)', color: 'white' }}
                          onClick={() => onUpdateTaskStatus(task.id, col.key === 'Pending' ? 'In Progress' : col.key === 'In Progress' ? 'In Review' : 'Completed')}
                        >
                          Avanzar →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
