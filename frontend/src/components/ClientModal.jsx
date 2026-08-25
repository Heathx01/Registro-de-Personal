import React, { useState, useEffect } from 'react';
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              {client ? t('clientModal.editTitle') : t('clientModal.createTitle')}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('clientModal.modalSubtitle')}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.companyName')} *</label>
              <input
                type="text"
                required
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="ej. TechCorp Solutions S.A."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.contactPerson')}</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="ej. Lic. Carlos Mendoza"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.email')}</label>
              <input
                type="email"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="contacto@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.phone')}</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="+52 55 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.address')}</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="Calle, Número, Colonia"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.city')}</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="Ciudad de México"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.companyType')}</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.company_type}
                onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
              >
                <option value="Startup">{t('clients.startup')}</option>
                <option value="Pyme">{t('clients.pyme')}</option>
                <option value="Corporación">{t('clients.corporation')}</option>
                <option value="Independiente">{t('clients.independent')}</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.taxId')}</label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '12px' }}
                placeholder="TCS-901215-ABC"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.status')}</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">{t('common.active')}</option>
                <option value="prospect">{t('common.prospect')}</option>
                <option value="inactive">{t('common.inactive')}</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clientModal.notes')}</label>
            <textarea
              className="search-input"
              style={{ paddingLeft: '12px', minHeight: '60px' }}
              placeholder="Detalles de facturación, especificaciones del proyecto o requerimientos especiales..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {client ? t('common.saveChanges') : t('clients.registerClient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
