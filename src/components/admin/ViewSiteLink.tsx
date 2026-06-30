import React from 'react'

const linkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'var(--theme-elevation-100)',
  color: 'var(--theme-elevation-800)',
  fontWeight: 600,
  fontSize: '14px',
  textDecoration: 'none',
}

// Botones en la barra lateral del admin: sitio público + edición masiva.
export const ViewSiteLink: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <a href="/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
        <span aria-hidden="true">↗</span>
        Ver sitio público
      </a>
      <a href="/admin/bulk-edit" style={linkStyle}>
        <span aria-hidden="true">⚡</span>
        Edición masiva
      </a>
    </div>
  )
}

export default ViewSiteLink
