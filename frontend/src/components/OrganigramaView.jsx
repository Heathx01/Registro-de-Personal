import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function OrganigramaView({ users }) {
  const { t, translatePos } = useLanguage();
  const [selectedNode, setSelectedNode] = useState(null);

  const ceo = users.filter((u) => u.role === 'admin');
  const leads = users.filter((u) => u.role === 'lead');
  const developers = users.filter((u) => u.role === 'developer');
  const qa = users.filter((u) => u.role === 'qa');
  const hr = users.filter((u) => u.role === 'hr');
  const sales = users.filter((u) => u.role === 'sales');

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('organigrama.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', margin: '6px auto 0' }}>
          {t('organigrama.subtitle')}
        </p>
      </div>

      <div className="org-container">
        {/* Tier 1 */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--purple)', fontWeight: 800 }}>
          {t('organigrama.direction')}
        </div>
        <div className="org-tier">
          {ceo.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--purple)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  margin: '0 auto 8px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{user.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--cyan)' }}>{translatePos(user.position)}</p>
              <span className="badge badge-admin" style={{ marginTop: '8px' }}>
                CEO / DIRECTOR
              </span>
            </div>
          ))}
        </div>

        <div className="org-connector"></div>

        {/* Tier 2 */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--cyan)', fontWeight: 800 }}>
          {t('organigrama.leads')}
        </div>
        <div className="org-tier">
          {leads.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--cyan)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--cyan), var(--indigo))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  margin: '0 auto 8px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{translatePos(user.position)}</p>
              <span className="badge badge-lead" style={{ marginTop: '8px' }}>
                TECH LEAD
              </span>
            </div>
          ))}
        </div>

        <div className="org-connector"></div>

        {/* Tier 3 */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--primary)', fontWeight: 800 }}>
          {t('organigrama.devs')} & {t('organigrama.qa')}
        </div>
        <div className="org-tier">
          {developers.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--primary)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{translatePos(user.position)}</p>
              <span className="badge badge-developer" style={{ marginTop: '6px' }}>
                DEV
              </span>
            </div>
          ))}

          {qa.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--amber)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--amber), var(--rose))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{translatePos(user.position)}</p>
              <span className="badge badge-qa" style={{ marginTop: '6px' }}>
                QA LEAD
              </span>
            </div>
          ))}
        </div>

        <div className="org-connector"></div>

        {/* Tier 4 */}
        <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '1px', color: 'var(--emerald)', fontWeight: 800 }}>
          {t('organigrama.hr')} & {t('organigrama.sales')}
        </div>
        <div className="org-tier">
          {hr.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--emerald)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--emerald), var(--teal))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{translatePos(user.position)}</p>
              <span className="badge badge-hr" style={{ marginTop: '6px' }}>
                HR
              </span>
            </div>
          ))}

          {sales.map((user) => (
            <div
              key={user.id}
              className="org-node"
              style={{ borderTop: '4px solid var(--rose)', cursor: 'pointer' }}
              onClick={() => setSelectedNode(user)}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--rose), var(--purple))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#ffffff',
                  margin: '0 auto 6px',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</h5>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{translatePos(user.position)}</p>
              <span className="badge badge-sales" style={{ marginTop: '6px', backgroundColor: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e' }}>
                SALES BDM
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Ficha Organigrama */}
      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--indigo), var(--cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                {selectedNode.name ? selectedNode.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedNode.name}</h3>
                <p style={{ color: 'var(--cyan)' }}>{translatePos(selectedNode.position)}</p>
                <span className={`badge badge-${selectedNode.role}`}>{selectedNode.role.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
              <h5 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>RESPONSIBILITIES</h5>
              <p style={{ fontSize: '0.85rem' }}>{selectedNode.bio}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedNode(null)}>
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
