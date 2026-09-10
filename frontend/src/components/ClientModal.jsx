import React, { useState, useEffect } from 'react';
import ModalPortal from './ModalPortal';
import { useLanguage } from '../context/LanguageContext';

export default function ClientModal({ client, onClose, onSave }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    company_type: 'Pyme',
    tax_id: '',
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        contact_person: client.contact_person || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        company_type: client.company_type || 'Pyme',
        tax_id: client.tax_id || '',
        status: client.status || 'active',
        notes: client.notes || '',
      });
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '680px', padding: '32px' }}
        >
          {/* Header del Modal con Iconografía y Botón de Cierre */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))',
                  border: '1px solid var(--border-glass-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                }}
              >
                🏢
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {client ? t('clientModal.editTitle') : t('clientModal.createTitle')}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                  {t('clientModal.modalSubtitle')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)';
                e.currentTarget.style.color = 'var(--rose)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
              title={t('common.close')}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Sección: Identificación Comercial */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  🏢 {t('clientModal.companyName')} <span style={{ color: 'var(--rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="ej. TechCorp Solutions S.A."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  👤 {t('clientModal.contactPerson')}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ej. Lic. Carlos Mendoza"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
            </div>

            {/* Sección: Canales de Contacto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  ✉️ {t('clientModal.email')}
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contacto@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  📞 {t('clientModal.phone')}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+52 55 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Sección: Ubicación y Sede */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  📍 {t('clientModal.address')}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Av. Reforma 222, Piso 8"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  🏙️ {t('clientModal.city')}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ciudad de México"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            {/* Sección: Clasificación Comercial y Fiscal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  💼 {t('clientModal.companyType')}
                </label>
                <select
                  className="form-select"
                  value={formData.company_type}
                  onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
                >
                  <option value="Startup">🚀 {t('clients.startup')}</option>
                  <option value="Pyme">🏬 {t('clients.pyme')}</option>
                  <option value="Corporación">🏢 {t('clients.corporation')}</option>
                  <option value="Independiente">🧑‍💻 {t('clients.independent')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  📑 {t('clientModal.taxId')}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="TCS-901215-ABC"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  ⚡ {t('clientModal.status')}
                </label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">● {t('common.active')}</option>
                  <option value="prospect">◎ {t('common.prospect')}</option>
                  <option value="inactive">○ {t('common.inactive')}</option>
                </select>
              </div>
            </div>

            {/* Sección: Notas y Requerimientos */}
            <div className="form-group">
              <label className="form-label">
                📝 {t('clientModal.notes')}
              </label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Detalles de facturación, requerimientos de NDA, especificaciones comerciales o expectativas de proyectos..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Botones de Acción */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '10px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ minWidth: '170px', justifyContent: 'center' }}
              >
                {client ? `💾 ${t('common.saveChanges')}` : `✨ ${t('clients.registerClient')}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
