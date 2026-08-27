import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PRESET_IMAGES = [
  {
    name: 'E-Commerce Store',
    url: 'https://images.unsplash.com/photo-1556742049-0a67e562132d?w=800&auto=format&fit=crop&q=80',
    category: 'E-Commerce',
  },
  {
    name: 'ERP / Business Dashboard',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    category: 'ERP / CRM',
  },
  {
    name: 'Mobile App Concept',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
    category: 'Mobile App',
  },
  {
    name: 'SaaS Cloud Portal',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    category: 'SaaS Platform',
  },
  {
    name: 'Corporate Landing',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    category: 'Landing Page',
  },
];

function TemplateModal({ template, onClose, onSave }) {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('general'); // general | image | tech | pricing
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('E-Commerce');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [newTechInput, setNewTechInput] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('2 a 3 semanas');
  const [imageUrl, setImageUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState(3500);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (template) {
      setTitle(template.title || '');
      setCategory(template.category || 'E-Commerce');
      setDescription(template.description || '');

      const initialFeatures = Array.isArray(template.features)
        ? template.features
        : String(template.features || '')
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean);
      setFeatures(initialFeatures);

      const initialTech = Array.isArray(template.tech_stack)
        ? template.tech_stack
        : String(template.tech_stack || '')
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
      setTechStack(initialTech);

      setEstimatedDelivery(template.estimated_delivery || '2 a 3 semanas');
      setImageUrl(template.image_url || '');
      setDemoUrl(template.demo_url || '');
      setSuggestedPrice(template.suggested_price || 3500);
    } else {
      // Imagen por defecto
      setImageUrl(PRESET_IMAGES[0].url);
      setFeatures(['Carrito de Compras', 'Pasarela Stripe', 'Panel Administrativo']);
      setTechStack(['React', 'Node.js', 'PostgreSQL']);
    }
  }, [template]);

  // Manejador de subida de archivo de imagen local
  const handleFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Agregar módulos / features
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    const itemsToAdd = newFeatureInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setFeatures([...features, ...itemsToAdd]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFeatures(features.filter((_, idx) => idx !== indexToRemove));
  };

  // Agregar tecnologías / tech stack
  const handleAddTech = () => {
    if (!newTechInput.trim()) return;
    const itemsToAdd = newTechInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setTechStack([...techStack, ...itemsToAdd]);
    setNewTechInput('');
  };

  const handleRemoveTech = (indexToRemove) => {
    setTechStack(techStack.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor ingresa un título para la plantilla.');
      return;
    }

    onSave({
      title: title.trim(),
      category,
      description: description.trim(),
      features,
      tech_stack: techStack,
      estimated_delivery: estimatedDelivery.trim(),
      image_url: imageUrl || PRESET_IMAGES[0].url,
      demo_url: demoUrl.trim(),
      suggested_price: parseFloat(suggestedPrice) || 0,
      status: 'Available',
    });
  };

  return (
    <div
      className="modal-overlay animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="glass-card modal-container animate-fade-in"
        style={{
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '28px',
          padding: '0',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Encabezado del Modal con Degradado */}
        <div
          style={{
            padding: '24px 32px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>{template ? '✏️' : '✨'}</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {template ? t('templates.editTitle') : t('templates.createTitle')}
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', margin: 0 }}>
              {t('templates.modalSubtitle')}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
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
              transition: 'all 0.2s ease',
            }}
          >
            ✕
          </button>
        </div>

        {/* Navegación por Pasos / Pestañas internas */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            padding: '4px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'general', label: '📌 Información General' },
            { id: 'image', label: '🖼️ Imagen & Portada' },
            { id: 'tech', label: '🛠️ Módulos & Stack' },
            { id: 'pricing', label: '💵 Precios & Demo' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-color, #6366f1)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                borderRadius: '12px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-color, #6366f1)' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Pestaña 1: Información General */}
            {activeTab === 'general' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    {t('templates.templateTitle')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ej. Portal E-Commerce Omni-channel High Conversion"
                    className="input-field"
                    style={{ width: '100%', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                      {t('templates.category')} *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', borderRadius: '12px', padding: '12px 16px' }}
                    >
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="ERP / CRM">ERP / CRM</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="SaaS Platform">SaaS Platform</option>
                      <option value="Landing Page">Landing Page</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                      {t('templates.deliveryTime')}
                    </label>
                    <input
                      type="text"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      placeholder="ej. 2 a 3 semanas"
                      className="input-field"
                      style={{ width: '100%', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    {t('templates.description')} *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe la propuesta comercial, ventajas para el cliente y valor diferencial..."
                    className="input-field"
                    style={{ width: '100%', borderRadius: '12px', padding: '12px 16px', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* Pestaña 2: Imagen y Portada */}
            {activeTab === 'image' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Visualizador / Preview de Imagen actual */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    Previsualización de Portada de la Revista
                  </span>
                  <div
                    style={{
                      height: '200px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '2px dashed rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800';
                        }}
                      />
                    ) : (
                      <div style={{ color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '2.5rem', display: 'block' }}>🖼️</span>
                        <p style={{ margin: '4px 0 0' }}>Sin imagen seleccionada</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subir archivo de imagen local (Drag and Drop) */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    📁 Subir Imagen desde tu Equipo (PC / Archivo Local)
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                      border: dragOver ? '2px solid var(--accent-color, #6366f1)' : '2px dashed rgba(255, 255, 255, 0.15)',
                      backgroundColor: dragOver ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="template-image-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                    />
                    <label htmlFor="template-image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '6px' }}>📤</span>
                      <strong style={{ color: 'var(--accent-color, #6366f1)', fontSize: '0.95rem' }}>
                        Haz clic aquí para buscar una imagen
                      </strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 0' }}>
                        o arrastra y suelta un archivo (PNG, JPG, WEBP, GIF)
                      </p>
                    </label>
                  </div>
                </div>

                {/* Selección rápida de Imágenes Prediseñadas */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    🎨 Galería de Imágenes Sugeridas por Categoría
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setImageUrl(preset.url)}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          height: '75px',
                          position: 'relative',
                          cursor: 'pointer',
                          border: imageUrl === preset.url ? '3px solid var(--accent-color, #6366f1)' : '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: imageUrl === preset.url ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0, 0, 0, 0.75)',
                            padding: '2px 4px',
                            fontSize: '0.68rem',
                            color: '#fff',
                            textAlign: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {preset.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* O ingresar URL directa */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                    🔗 O pega la URL de la imagen directamente
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="input-field"
                    style={{ width: '100%', borderRadius: '12px', padding: '10px 14px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            )}

            {/* Pestaña 3: Módulos y Tecnologías */}
            {activeTab === 'tech' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Módulos Clave Builder */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    📌 Módulos & Características Clave
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="Escribe un módulo (ej. Pasarela de Pago, Dashboard) y presiona Enter o +"
                      className="input-field"
                      style={{ flex: 1, borderRadius: '12px', padding: '10px 14px' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="btn-primary"
                      style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: 700 }}
                    >
                      + Agregar
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '40px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    {features.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px' }}>
                        No has agregado módulos aún. Escribe arriba para añadir características.
                      </span>
                    ) : (
                      features.map((feat, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          ✓ {feat}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Stack Tecnológico Builder */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                    💻 Stack Tecnológico (Frameworks, Lenguajes, DB)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={newTechInput}
                      onChange={(e) => setNewTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      placeholder="Escribe una tecnología (ej. React, Python, Docker) y presiona Enter o +"
                      className="input-field"
                      style={{ flex: 1, borderRadius: '12px', padding: '10px 14px' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="btn-primary"
                      style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: 700 }}
                    >
                      + Agregar
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '40px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    {techStack.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px' }}>
                        Sin tecnologías especificadas aún.
                      </span>
                    ) : (
                      techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            color: 'var(--accent-color, #6366f1)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          ⚡ {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(idx)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-color, #6366f1)', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña 4: Cotización y Demo */}
            {activeTab === 'pricing' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                      💵 {t('templates.price')} ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      required
                      value={suggestedPrice}
                      onChange={(e) => setSuggestedPrice(e.target.value)}
                      placeholder="3500"
                      className="input-field"
                      style={{ width: '100%', borderRadius: '12px', padding: '12px 16px', fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
                      🌐 {t('templates.demoLink')} (Opcional)
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://demo.miempresa.com"
                      className="input-field"
                      style={{ width: '100%', borderRadius: '12px', padding: '12px 16px' }}
                    />
                  </div>
                </div>

                {/* Resumen Comercial de la Tarjeta */}
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.1))',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
                    📊 Resumen de la Oferta Comercial
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <li>Esta solución estará disponible para ser seleccionada inmediatamente por los Ejecutivos de Ventas (BDM).</li>
                    <li>
                      Al personalizarla para un cliente, el presupuesto inicial sugerido se fijará en{' '}
                      <strong style={{ color: '#fff' }}>${Number(suggestedPrice || 0).toLocaleString()} USD</strong>.
                    </li>
                    <li>
                      Tiempo estimado de entrega proyectado:{' '}
                      <strong style={{ color: '#fff' }}>{estimatedDelivery || 'Por definir'}</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer de Acciones del Formulario */}
          <div
            style={{
              padding: '20px 32px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {activeTab !== 'general' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['general', 'image', 'tech', 'pricing'];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1]);
                  }}
                  className="btn-secondary"
                  style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  ⬅️ Anterior
                </button>
              )}
              {activeTab !== 'pricing' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['general', 'image', 'tech', 'pricing'];
                    const currentIdx = tabs.indexOf(activeTab);
                    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1]);
                  }}
                  className="btn-secondary"
                  style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  Siguiente ➡️
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '10px 20px', borderRadius: '10px' }}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '10px 28px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                }}
              >
                {template ? '💾 Guardar Cambios' : '🚀 Publicar en Catálogo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TemplateModal;
