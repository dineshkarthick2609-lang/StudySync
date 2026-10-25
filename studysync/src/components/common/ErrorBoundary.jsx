import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e0e5ec',
            padding: '2rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#4a4f5e',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#e0e5ec',
              borderRadius: '20px',
              padding: '2rem 3rem',
              boxShadow: '6px 6px 12px #b8bec7, -6px -6px 12px #ffffff',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#8a9bb5', marginBottom: '1.5rem' }}>
              The app encountered an error. Your data is safe.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/dashboard'
              }}
              style={{
                background: '#6c9bcf',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.625rem 1.25rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 500,
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
