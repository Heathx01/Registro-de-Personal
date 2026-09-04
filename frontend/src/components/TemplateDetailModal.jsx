import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function TemplateDetailModal({ template, clients = [], onClose, onConfirmCreateProject }) {
  const { t } = useLanguage();
  const [selectedClientId, setSelectedClientId] = useState('');

  if (!template) return null;

  const handleConfirm = () => {
    if (!selectedClientId) {
      alert('Por favor selecciona un cliente para vincular este proyecto.');
      return;
    }
    onConfirmCreateProject(template, selectedClientId);
  };

  const featuresList = Array.isArray(template.features)
    ? template.features
    : String(template.features || '').split(',').map((f) => f.trim()).filter(Boolean);

  const techStackList = Array.isArray(template.tech_stack)
    ? template.tech_stack
    : String(template.tech_stack || '').split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div
      className="modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card modal-container"
        style={{
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Banner de Portada / Imagen */}
        <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
          <img
            src={
              template.image_url ||
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
            }
            alt={template.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)',
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <span
              style={{
                backgroundColor: 'var(--accent-color, #6366f1)',
                color: '#fff',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              {template.category}
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '10px 0 0 0' }}>
              {template.title}
            </h2>
          </div>
        </div>

        {/* Cuerpo del Dossier */}
        <div style={{ padding: '28px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '24px' }}>
            {template.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px',
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ⏱️ {t('templates.estimatedDelivery')}
              </span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{template.estimated_delivery}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                💵 {t('templates.suggestedPrice')}
              </span>
              <strong style={{ fontSize: '1.05rem', color: '#10b981' }}>
                ${Number(template.suggested_price || 0).toLocaleString()} USD
              </strong>
            </div>
          </div>

          {/* Módulos Clave */}
          {featuresList.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                📌 {t('templates.keyFeatures')}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {featuresList.map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span style={{ color: 'var(--accent-color, #6366f1)', fontWeight: 800 }}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stack Tecnológico */}
          {techStackList.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                💻 {t('templates.techStack')}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {techStackList.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--accent-color, #6366f1)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sección de Acción Comercial: Asignar a Cliente */}
          {permissions?.can_manage_projects && (
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                🤝 {t('templates.selectClientModalTitle')}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                {t('templates.selectClientModalSub')}
              </p>
  
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <select
                  className="input-field"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  style={{ flex: 1, minWidth: '220px', borderRadius: '12px', height: '46px' }}
                >
                  <option value="">{t('templates.chooseClient')}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      🏢 {c.name} ({c.contact_person || 'Contacto'})
                    </option>
                  ))}
                </select>
  
                <button
                  onClick={handleConfirm}
                  className="btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {t('templates.generateProposalBtn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateDetailModal;
