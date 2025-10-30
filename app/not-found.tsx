
import React from 'react'

const NotFound = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      color: "var(--text-primary)",
      fontFamily: "Segoe UI, Arial, sans-serif"
    }}>
      <div style={{
        background: "var(--background)",
        padding: "48px 32px",
        borderRadius: "16px",
        boxShadow: "0 4px 32px var(--border-light)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "24px" }}>
          <circle cx="12" cy="12" r="10" stroke="var(--text-primary)" strokeWidth="2" fill="none"/>
          <path d="M15 9l-6 6M9 9l6 6" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <h1 style={{
          fontSize: "2.6rem",
          margin: "0 0 12px 0",
          fontWeight: 700,
          letterSpacing: "0.04em"
        }}>
          404 - Page Not Found
        </h1>
        <p style={{
          fontSize: "1.15rem",
          margin: "0 0 24px 0",
          textAlign: "center",
          maxWidth: "360px"
        }}>
          Sorry, the page you are looking for does not exist.<br/>
          You may have mistyped the address or the page may have moved.
        </p>
      </div>
    </div>
  )
}

export default NotFound