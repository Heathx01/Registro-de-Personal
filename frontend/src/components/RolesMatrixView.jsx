import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function RolesMatrixView() {
  const { t } = useLanguage();

  const matrixData = t('rolesMatrixData') || [];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('roles.title')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {t('roles.subtitle')}
        </p>
      </div>

      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>{t('roles.roleCol')}</th>
              <th>{t('roles.positionCol')}</th>
              <th>{t('roles.accessCol')}</th>
              <th>{t('roles.privilegesCol')}</th>
              <th>{t('roles.restrictionsCol')}</th>
            </tr>
          </thead>
          <tbody>
            {matrixData.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <span className={`badge badge-${item.badge}`} style={{ marginBottom: '4px' }}>
                    {item.role}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.department}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--cyan)' }}>{item.position}</td>
                <td>{item.access}</td>
                <td style={{ color: 'var(--emerald)' }}>{item.privileges}</td>
                <td style={{ color: 'var(--rose)' }}>{item.restrictions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
