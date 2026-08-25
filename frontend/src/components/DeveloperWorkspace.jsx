import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DeveloperWorkspace({ tasks, currentUser, onUpdateTaskStatus }) {
  const { t, translatePos, translateDept } = useLanguage();
  const [workNote, setWorkNote] = useState('');
  const [loggedHours, setLoggedHours] = useState(4);
  const [logHistory, setLogHistory] = useState([
    { id: 1, text: 'Endpoints REST AuthController', hours: 4, time: '10:30 AM' },
    { id: 2, text: 'Unit tests & code review', hours: 2, time: '02:15 PM' },
  ]);

  // Filtrar exclusivamente las tareas asignadas a este desarrollador
  const myTasks = tasks.filter((t) => String(t.assigned_to) === String(currentUser.id));

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!workNote) return;

    setLogHistory([
      { id: Date.now(), text: workNote, hours: loggedHours, time: new Date().toLocaleTimeString() },
      ...logHistory,
    ]);
    setWorkNote('');
  };

  return (
    <div className="animate-fade-in">
      <div className="controls-bar" style={{ marginBottom: '24px' }}>
        <div>
          <span className="badge badge-developer" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
            {t('developer.badge')}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {t('developer.title')} ({currentUser.name})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {t('developer.subtitle')}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Columna Principal: Tareas Asignadas por el Manager */}
        <div>
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🎯 {t('developer.myTasks')} ({myTasks.length})</span>
              <span className="badge badge-lead">{translatePos(currentUser.position)}</span>
            </h3>

            {myTasks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
                <p>🎉 {t('developer.noTasks')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--border-glass-accent)',
                      borderRadius: '12px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="badge badge-developer" style={{ marginBottom: '6px' }}>
                          {t('manager.priority')}: {task.priority}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{task.title}</h4>
                      </div>

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
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.description}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                      <span>📁 {t('projects.title')}: <strong style={{ color: 'var(--cyan)' }}>{task.project?.name || 'General'}</strong></span>
                      <span>📅 {t('developer.dueDate')}: {task.due_date || '2026-08-30'}</span>
                    </div>

                    {/* Acciones de estado para el Programador */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {task.status === 'Pending' && (
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                          onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                        >
                          🚀 {t('developer.updateStatus')}: {t('common.inProgress')}
                        </button>
                      )}

                      {task.status === 'In Progress' && (
                        <button
                          className="btn btn-primary"
                          style={{ fontSize: '0.8rem', padding: '6px 14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                          onClick={() => onUpdateTaskStatus(task.id, 'Completed')}
                        >
                          ✅ {t('common.completed')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna Secundaria */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{currentUser.name}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--cyan)' }}>{translatePos(currentUser.position)}</p>
                <span className={`badge badge-${currentUser.role}`} style={{ marginTop: '4px' }}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>📧 {currentUser.email}</div>
              <div>🏢 Dept: {translateDept(currentUser.department)}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px' }}>
              ⏱️ {t('developer.updateStatus')}
            </h4>

            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                required
                className="search-input"
                style={{ paddingLeft: '10px', fontSize: '0.82rem' }}
                placeholder="..."
                value={workNote}
                onChange={(e) => setWorkNote(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="search-input"
                  style={{ paddingLeft: '10px', width: '70px', fontSize: '0.82rem' }}
                  value={loggedHours}
                  onChange={(e) => setLoggedHours(Number(e.target.value))}
                />
                <button type="submit" className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem' }}>
                  + Log
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
