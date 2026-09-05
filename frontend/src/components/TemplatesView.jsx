import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function TemplatesView({
  templates = [],
  permissions = {},
  onOpenAddTemplate,
  onOpenEditTemplate,
  onDeleteTemplate,
  onSelectTemplateForClient,
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeDetailTemplate, setActiveDetailTemplate] = useState(null);

  const categories = ['ALL', 'E-Commerce', 'ERP / CRM', 'Mobile App', 'SaaS Platform'];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.tech_stack &&
        template.tech_stack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'ALL' || template.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="templates-view animate-fade-in" style={{ padding: '24px 0' }}>
      {/* Encabezado */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          marginBottom: '28px',
          borderRadius: '20px',
          borderLeft: '5px solid var(--accent-color, #6366f1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <span
            style={{
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '1.5px',
              fontWeight: 700,
              color: 'var(--accent-color, #6366f1)',
            }}
          >
            SHOWCASE & DIGITAL CATALOG
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-main)' }}>
            📖 {t('templates.title')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '750px' }}>
            {t('templates.subtitle')}
          </p>
        </div>

        {/* Leer el catálogo es distinto de crear o editar plantillas. */}
        {permissions.can_manage_templates && (
          <button
            onClick={onOpenAddTemplate}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ✨ {t('templates.addTemplate')}
          </button>
        )}
      </div>

      {/* Tarjetas de Métricas Resumen */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('templates.totalTemplates')}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-color, #6366f1)', marginTop: '4px' }}>
            {templates.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('templates.totalTemplatesSub')}</span>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('templates.avgTime')}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            2-3 Semanas
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('templates.avgTimeSub')}</span>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('templates.suggestedPrice')}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            $2,900 - $5,200
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('templates.suggestedPriceSub')}</span>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('templates.customizable')}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ec4899', marginTop: '4px' }}>
            100% Modular
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('templates.customizableSub')}</span>
        </div>
      </div>

      {/* Buscador y Filtros por Categoría */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          marginBottom: '28px',
          borderRadius: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <input
            type="text"
            placeholder={t('templates.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{
              width: '100%',
              paddingLeft: '40px',
              borderRadius: '12px',
              height: '46px',
            }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }}>🔍</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                backgroundColor:
                  selectedCategory === cat ? 'var(--accent-color, #6366f1)' : 'rgba(255, 255, 255, 0.08)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
              }}
            >
              {cat === 'ALL' ? t('templates.allCategories') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Plantillas */}
      {filteredTemplates.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📂</div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>{t('templates.noTemplates')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Prueba ajustando los términos de búsqueda o filtros seleccionados.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="glass-card animate-fade-in"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Portada / Header de la plantilla */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={
                    template.image_url ||
                    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={template.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                  }}
                >
                  {template.category}
                </div>

                {template.suggested_price > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(16, 185, 129, 0.9)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                    }}
                  >
                    ${Number(template.suggested_price).toLocaleString()} USD
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  {template.title}
                </h3>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {template.description}
                </p>

                {/* Stack de Tecnologías */}
                {template.tech_stack && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {(Array.isArray(template.tech_stack)
                      ? template.tech_stack
                      : String(template.tech_stack).split(',')
                    ).map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--accent-color, #6366f1)',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '16px',
                    }}
                  >
                    <span>⏱️ {t('templates.estimatedDelivery')}:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{template.estimated_delivery}</strong>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => onSelectTemplateForClient(template)}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      {t('templates.customizeForClient')}
                    </button>

                    {permissions.can_manage_templates && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => onOpenEditTemplate(template)}
                          className="btn-secondary"
                          style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteTemplate(template.id)}
                          className="btn-secondary"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: '#ef4444',
                          }}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplatesView;
