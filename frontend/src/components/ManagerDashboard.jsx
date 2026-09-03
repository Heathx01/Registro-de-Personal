import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import DashboardCharts from './DashboardCharts';

export default function ManagerDashboard({ users, projects, tasks, currentUser, onUnlockUser, onAssignTask }) {
  const { t, translatePos } = useLanguage();
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
    setSuccessMsg(`✅ ${t('manager.assignedSuccess')}: "${taskTitle}" (${devObj ? devObj.name : 'Dev'})`);
    setTaskTitle('');
    setTaskDesc('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="animate-fade-in">
      <div className="controls-bar" style={{ marginBottom: '24px' }}>
        <div>
          <span className="badge badge-lead" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
            {t('manager.badge')}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('manager.title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {t('manager.subtitle')} (<strong>{currentUser.name}</strong>)
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

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1))' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Total Tareas</h4>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>{tasks.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Completadas</h4>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--emerald)' }}>
            {tasks.filter(t => t.status === 'Completed').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Proyectos Activos</h4>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--purple)' }}>
            {projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(244,63,94,0.1))' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Tareas Críticas</h4>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--rose)' }}>
            {tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length}
          </div>
        </div>
      </div>

      <DashboardCharts tasks={tasks} projects={projects} users={users} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
        {/* Columna 1: Equipo a Cargo y Control de Seguridad */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--cyan)' }}>👥</span> {t('manager.teamMembers')} ({developers.length})
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--cyan)' }}>{translatePos(dev.position)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {dev.is_locked ? (
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      onClick={() => onUnlockUser(dev.id)}
                    >
                      🔓 {t('manager.unlockAccount')}
                    </button>
                  ) : (
                    <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                      ● {t('common.active')}
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
            <span style={{ color: 'var(--primary)' }}>✍️</span> {t('manager.assignTask')}
          </h3>

          <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('manager.selectDev')}</label>
              <select
                required
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedDev}
                onChange={(e) => setSelectedDev(e.target.value)}
              >
                <option value="">{t('manager.chooseDev')}</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name} - {translatePos(dev.position)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('manager.taskTitle')}</label>
              <input
                type="text"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="ej. Implementar JWT & OAuth2..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('manager.project')}</label>
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
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('manager.priority')}</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">{t('manager.low')}</option>
                  <option value="Medium">{t('manager.medium')}</option>
                  <option value="High">{t('manager.high')}</option>
                  <option value="Critical">{t('manager.critical')}</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('manager.instructions')}</label>
              <textarea
                className="search-input"
                style={{ paddingLeft: '12px', minHeight: '60px' }}
                placeholder="..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
              {t('manager.assignBtn')}
            </button>
          </form>
        </div>
      </div>

      {/* Tabla de Tareas Asignadas por el Manager */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
          📋 {t('manager.taskStateTitle')} ({tasks.length})
        </h3>

        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>{t('manager.taskTitle')}</th>
                <th>{t('tasks.assignedTo')}</th>
                <th>{t('projects.title')}</th>
                <th>{t('manager.priority')}</th>
                <th>{t('common.status')}</th>
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
                      <span>{task.assignee?.name || 'Dev'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--cyan)' }}>{task.project?.name || 'General'}</td>
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
                      ● {task.status === 'Completed' ? t('common.completed') : task.status === 'In Progress' ? t('common.inProgress') : t('common.pending')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
