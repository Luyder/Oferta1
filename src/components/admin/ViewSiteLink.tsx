import React from 'react'

// Botón en la barra lateral del admin para abrir el sitio público.
export const ViewSiteLink: React.FC = () => {
  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 0 16px',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'var(--theme-elevation-100)',
        color: 'var(--theme-elevation-800)',
        fontWeight: 600,
        fontSize: '14px',
        textDecoration: 'none',
      }}
    >
      <span aria-hidden="true">↗</span>
      Ver sitio público
    </a>
  )
}

export default ViewSiteLink
