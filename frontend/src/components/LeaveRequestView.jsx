import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LEAVE_TYPES = [
  { value: 'vacation', label: '🌴 Vacaciones', color: 'var(--cyan)', bg: 'rgba(6,182,212,0.12)' },
  { value: 'sick', label: '🤒 Incapacidad / Enfermedad', color: 'var(--rose)', bg: 'rgba(244,63,94,0.12)' },
  { value: 'personal', label: '👤 Permiso Personal', color: 'var(--indigo)', bg: 'rgba(99,102,241,0.12)' },
  { value: 'maternity', label: '🍼 Maternidad / Paternidad', color: 'var(--purple)', bg: 'rgba(168,85,247,0.12)' },
  { value: 'medical', label: '🏥 Cita Médica', color: 'var(--amber)', bg: 'rgba(245,158,11,0.12)' },
  { value: 'emergency', label: '🚨 Emergencia Familiar', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  { value: 'study', label: '📚 Permiso de Estudio / Capacitación', color: 'var(--emerald)', bg: 'rgba(16,185,129,0.12)' },
  { value: 'other', label: '📝 Otro Motivo', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' },
];

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', color: 'var(--amber)', icon: '⏳' },
  approved: { label: 'Aprobado', color: 'var(--emerald)', icon: '✅' },
  rejected: { label: 'Rechazado', color: 'var(--rose)', icon: '❌' },
  cancelled: { label: 'Cancelado', color: 'var(--text-dim)', icon: '🚫' },
};

const MOCK_REQUESTS = [
  {
    id: 1,
    employee_name: 'Carlos Mendoza',
    employee_role: 'developer',
    type: 'vacation',
    start_date: '2026-09-10',
    end_date: '2026-09-17',
    days: 7,
    reason: 'Vacaciones familiares programadas de fin de trimestre.',
    status: 'approved',
    approved_by: 'Ana García',
    created_at: '2026-08-28',
    notes: 'Aprobado. Cobertura de tareas acordada con el equipo.',
  },
  {
    id: 2,
    employee_name: 'Daniela Torres',
    employee_role: 'qa',
    type: 'medical',
    start_date: '2026-09-05',
    end_date: '2026-09-05',
    days: 1,
    reason: 'Cita con especialista para revisión anual.',
    status: 'pending',
    approved_by: null,
    created_at: '2026-09-03',
    notes: '',
  },
  {
    id: 3,
    employee_name: 'Luisa Ramírez',
    employee_role: 'hr',
    type: 'personal',
    start_date: '2026-09-12',
    end_date: '2026-09-13',
    days: 2,
    reason: 'Trámites personales de escrituración de vivienda.',
    status: 'pending',
    approved_by: null,
    created_at: '2026-09-04',
    notes: '',
  },
  {
    id: 4,
    employee_name: 'Roberto Sánchez',
    employee_role: 'developer',
    type: 'sick',
    start_date: '2026-08-20',
    end_date: '2026-08-22',
    days: 3,
    reason: 'Incapacidad médica por gastroenteritis.',
    status: 'approved',
    approved_by: 'Ana García',
    created_at: '2026-08-20',
    notes: 'Incapacidad validada con documento médico.',
  },
  {
    id: 5,
    employee_name: 'María Jiménez',
    employee_role: 'lead',
    type: 'study',
    start_date: '2026-09-18',
    end_date: '2026-09-20',
    days: 3,
    reason: 'Asistencia a conferencia internacional de arquitectura cloud.',
    status: 'rejected',
    approved_by: 'Admin',
    created_at: '2026-09-01',
    notes: 'Rechazado temporalmente. Hay entrega de sprint en esas fechas.',
  },
];

function getLeaveType(value) {
  return LEAVE_TYPES.find((t) => t.value === value) || LEAVE_TYPES[LEAVE_TYPES.length - 1];
}

function calcDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

export default function LeaveRequestView({ currentUser, users, permissions }) {
  const { t } = useLanguage();
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  const isHRorAdmin = ['admin', 'lead', 'hr'].includes(currentUser?.role);

  const [form, setForm] = useState({
    type: '',
    start_date: '',
    end_date: '',
    reason: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const days = calcDays(form.start_date, form.end_date);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchStatus = filterStatus ? r.status === filterStatus : true;
      const matchType = filterType ? r.type === filterType : true;
      const matchEmp = filterEmployee
        ? r.employee_name.toLowerCase().includes(filterEmployee.toLowerCase())
        : true;
      // Non-HR employees only see their own
      if (!isHRorAdmin) return r.employee_name === currentUser?.name && matchStatus && matchType;
      return matchStatus && matchType && matchEmp;
    });
  }, [requests, filterStatus, filterType, filterEmployee, isHRorAdmin, currentUser]);

  const stats = useMemo(() => {
    const src = isHRorAdmin ? requests : requests.filter((r) => r.employee_name === currentUser?.name);
    return {
      total: src.length,
      pending: src.filter((r) => r.status === 'pending').length,
      approved: src.filter((r) => r.status === 'approved').length,
      rejected: src.filter((r) => r.status === 'rejected').length,
    };
  }, [requests, isHRorAdmin, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.type) return setFormError('Selecciona el tipo de permiso.');
    if (!form.start_date) return setFormError('Indica la fecha de inicio.');
    if (!form.end_date) return setFormError('Indica la fecha de fin.');
    if (days <= 0) return setFormError('La fecha de fin debe ser igual o posterior a la de inicio.');
    if (!form.reason.trim()) return setFormError('Por favor describe el motivo del permiso.');

    const newReq = {
      id: Date.now(),
      employee_name: currentUser?.name || 'Empleado',
      employee_role: currentUser?.role || 'developer',
      type: form.type,
      start_date: form.start_date,
      end_date: form.end_date,
      days,
      reason: form.reason,
      status: 'pending',
      approved_by: null,
      created_at: new Date().toISOString().split('T')[0],
      notes: form.notes,
    };

    setRequests([newReq, ...requests]);
    setForm({ type: '', start_date: '', end_date: '', reason: '', notes: '' });
    setShowForm(false);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const handleReview = (req, action) => {
    setRequests(
      requests.map((r) =>
        r.id === req.id
          ? {
              ...r,
              status: action,
              approved_by: currentUser?.name || 'HR',
              notes: reviewNote || r.notes,
            }
          : r
      )
    );
    setReviewModal(null);
    setReviewNote('');
    if (selectedRequest?.id === req.id) {
      setSelectedRequest({ ...req, status: action, notes: reviewNote || req.notes });
    }
  };

  const handleCancel = (id) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)));
    if (selectedRequest?.id === id) setSelectedRequest({ ...selectedRequest, status: 'cancelled' });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="controls-bar" style={{ marginBottom: '20px' }}>
        <div>
          <span className="badge badge-lead" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
            🏖️ PERMISOS Y AUSENCIAS — RECURSOS HUMANOS
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Solicitudes de Permisos</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {isHRorAdmin
              ? 'Gestiona y aprueba las solicitudes de permisos del equipo de trabajo.'
              : 'Solicita días de permiso, vacaciones o ausencias justificadas de forma digital.'}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(true); setFormError(''); }}
          style={{ whiteSpace: 'nowrap' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Solicitud
        </button>
      </div>

      {/* Success Toast */}
      {formSuccess && (
        <div
          className="animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(16,185,129,0.35)',
            borderRadius: '12px',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--emerald)',
            fontWeight: 600,
          }}
        >
          ✅ Tu solicitud de permiso fue enviada exitosamente. El área de RRHH la revisará pronto.
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard
          label={isHRorAdmin ? 'TOTAL SOLICITUDES' : 'MIS SOLICITUDES'}
          value={stats.total}
          sub="Historial registrado"
          color="var(--indigo)"
          gradient="linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))"
          icon="📋"
        />
        <StatCard
          label="EN REVISIÓN"
          value={stats.pending}
          sub="Pendientes de aprobación"
          color="var(--amber)"
          gradient="linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))"
          icon="⏳"
        />
        <StatCard
          label="APROBADOS"
          value={stats.approved}
          sub="Permisos autorizados"
          color="var(--emerald)"
          gradient="linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))"
          icon="✅"
        />
        <StatCard
          label="NO AUTORIZADOS"
          value={stats.rejected}
          sub="Permisos rechazados"
          color="var(--rose)"
          gradient="linear-gradient(135deg, rgba(244,63,94,0.12), rgba(245,158,11,0.08))"
          icon="❌"
        />
      </div>

      {/* Filters */}
      <div className="controls-bar" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        {isHRorAdmin && (
          <div className="search-box" style={{ maxWidth: '220px' }}>
            <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar empleado..."
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
            />
          </div>
        )}
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pending">⏳ Pendiente</option>
          <option value="approved">✅ Aprobado</option>
          <option value="rejected">❌ Rechazado</option>
          <option value="cancelled">🚫 Cancelado</option>
        </select>
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Todos los tipos</option>
          {LEAVE_TYPES.map((lt) => (
            <option key={lt.value} value={lt.value}>{lt.label}</option>
          ))}
        </select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="glass-card" style={{ padding: '50px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏖️</div>
          <h3 style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Sin solicitudes encontradas</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '6px' }}>
            {isHRorAdmin ? 'No hay solicitudes que coincidan con los filtros.' : 'Aún no has enviado ninguna solicitud de permiso.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredRequests.map((req) => {
            const lt = getLeaveType(req.type);
            const st = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={req.id}
                className="glass-card"
                style={{
                  padding: '18px 22px',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${lt.color}`,
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                }}
                onClick={() => setSelectedRequest(req)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3), -2px 0 0 ${lt.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: lt.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        flexShrink: 0,
                      }}
                    >
                      {lt.label.split(' ')[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {req.employee_name}
                        </span>
                        <span className={`badge badge-${req.employee_role}`} style={{ fontSize: '0.68rem' }}>
                          {req.employee_role}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.83rem', color: lt.color, fontWeight: 600 }}>
                        {lt.label.split(' ').slice(1).join(' ')}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginLeft: '10px' }}>
                        📅 {req.start_date} → {req.end_date}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: lt.color }}>{req.days}d</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>días solicitados</div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: `color-mix(in srgb, ${st.color} 15%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${st.color} 40%, transparent)`,
                        color: st.color,
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {st.icon} {st.label}
                    </div>

                    {/* HR Quick Actions */}
                    {isHRorAdmin && req.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                          title="Aprobar"
                          onClick={() => { setReviewModal({ req, action: 'approved' }); setReviewNote(''); }}
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                          title="Rechazar"
                          onClick={() => { setReviewModal({ req, action: 'rejected' }); setReviewNote(''); }}
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    )}

                    {/* Employee cancel own pending */}
                    {!isHRorAdmin && req.status === 'pending' && req.employee_name === currentUser?.name && (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        onClick={(e) => { e.stopPropagation(); handleCancel(req.id); }}
                        title="Cancelar mi solicitud"
                      >
                        🚫 Cancelar
                      </button>
                    )}
                  </div>
                </div>

                {req.reason && (
                  <p style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                    📝 {req.reason.length > 120 ? req.reason.slice(0, 120) + '…' : req.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Modal: Nueva Solicitud ─── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📋 Nueva Solicitud de Permiso</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Completa el formulario para enviar tu solicitud al área de Recursos Humanos.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ padding: '6px 10px' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Tipo de Permiso */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                  Tipo de Permiso *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {LEAVE_TYPES.map((lt) => (
                    <button
                      key={lt.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: lt.value })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: form.type === lt.value ? `2px solid ${lt.color}` : '1px solid var(--border-glass)',
                        background: form.type === lt.value ? lt.bg : 'rgba(255,255,255,0.03)',
                        color: form.type === lt.value ? lt.color : 'var(--text-muted)',
                        fontSize: '0.82rem',
                        fontWeight: form.type === lt.value ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    className="search-input"
                    value={form.start_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    className="search-input"
                    value={form.end_date}
                    min={form.start_date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px' }}
                  />
                </div>
              </div>

              {/* Days Preview */}
              {days > 0 && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>📅</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--indigo)' }}>
                      {days} día{days !== 1 ? 's' : ''} de permiso
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Del {form.start_date} al {form.end_date}
                    </div>
                  </div>
                </div>
              )}

              {/* Motivo */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Motivo de la Solicitud *
                </label>
                <textarea
                  className="search-input"
                  placeholder="Describe brevemente el motivo de tu permiso..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '9px 12px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Notas adicionales */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Notas Adicionales <span style={{ fontWeight: 400 }}>(opcional)</span>
                </label>
                <textarea
                  className="search-input"
                  placeholder="Información complementaria, cobertura de responsabilidades, documentos adjuntos..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  style={{ width: '100%', padding: '9px 12px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Error */}
              {formError && (
                <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '10px 14px', color: 'var(--rose)', fontSize: '0.83rem', fontWeight: 600 }}>
                  ⚠️ {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  🚀 Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Detalle de solicitud ─── */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {(() => {
              const req = selectedRequest;
              const lt = getLeaveType(req.type);
              const st = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: lt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', flexShrink: 0 }}>
                        {lt.label.split(' ')[0]}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{req.employee_name}</h3>
                        <span style={{ fontSize: '0.83rem', color: lt.color, fontWeight: 600 }}>
                          {lt.label.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setSelectedRequest(null)} style={{ padding: '6px 10px' }}>✕</button>
                  </div>

                  {/* Status Banner */}
                  <div style={{ background: `color-mix(in srgb, ${st.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${st.color} 30%, transparent)`, borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{st.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: st.color, fontSize: '0.95rem' }}>{st.label}</div>
                      {req.approved_by && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Gestionado por: {req.approved_by}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                    <InfoCell label="Fecha Inicio" value={req.start_date} />
                    <InfoCell label="Fecha Fin" value={req.end_date} />
                    <InfoCell label="Total Días" value={`${req.days} día${req.days !== 1 ? 's' : ''}`} color={lt.color} />
                    <InfoCell label="Enviado el" value={req.created_at} />
                    <InfoCell label="Tipo" value={lt.label.split(' ').slice(1).join(' ')} color={lt.color} />
                    <InfoCell label="Rol" value={req.employee_role} />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '6px' }}>MOTIVO</h4>
                    <p style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {req.reason}
                    </p>
                  </div>

                  {req.notes && (
                    <div style={{ marginBottom: '14px' }}>
                      <h4 style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '6px' }}>NOTAS / RESOLUCIÓN</h4>
                      <p style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {req.notes}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '8px' }}>
                    {isHRorAdmin && req.status === 'pending' && (
                      <>
                        <button className="btn btn-primary" style={{ fontSize: '0.82rem' }} onClick={() => { setReviewModal({ req, action: 'approved' }); setReviewNote(''); }}>
                          ✅ Aprobar Permiso
                        </button>
                        <button className="btn btn-danger" style={{ fontSize: '0.82rem' }} onClick={() => { setReviewModal({ req, action: 'rejected' }); setReviewNote(''); }}>
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    {!isHRorAdmin && req.status === 'pending' && req.employee_name === currentUser?.name && (
                      <button className="btn btn-secondary" style={{ fontSize: '0.82rem' }} onClick={() => handleCancel(req.id)}>
                        🚫 Cancelar Solicitud
                      </button>
                    )}
                    <button className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>Cerrar</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ─── Modal: Revisión HR ─── */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
              {reviewModal.action === 'approved' ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Empleado: <strong style={{ color: 'var(--text-main)' }}>{reviewModal.req.employee_name}</strong>
              {' · '}{reviewModal.req.days} día(s) · {getLeaveType(reviewModal.req.type).label.split(' ').slice(1).join(' ')}
            </p>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Comentario / Resolución <span style={{ fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                className="search-input"
                placeholder="Indica el motivo de aprobación o rechazo, cobertura acordada, etc."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '9px 12px', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setReviewModal(null)}>Cancelar</button>
              {reviewModal.action === 'approved' ? (
                <button className="btn btn-primary" onClick={() => handleReview(reviewModal.req, 'approved')}>
                  ✅ Confirmar Aprobación
                </button>
              ) : (
                <button className="btn btn-danger" onClick={() => handleReview(reviewModal.req, 'rejected')}>
                  ❌ Confirmar Rechazo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color, gradient, icon }) {
  return (
    <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: gradient }}>
      <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{icon}</div>
      <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 700 }}>{label}</h4>
      <div style={{ fontSize: '2rem', fontWeight: 900, color }}>{value}</div>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{sub}</span>
    </div>
  );
}

function InfoCell({ label, value, color }) {
  return (
    <div className="glass-card" style={{ padding: '10px 12px' }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '3px' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: color || 'var(--text-main)' }}>{value}</span>
    </div>
  );
}
