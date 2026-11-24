import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import logo from '../assets/logo.png'
import heroBg from '../assets/Fabrication.jpg'

const ROLE_REDIRECTS = {
    owner:    '/owner/dashboard',
    employee: '/employee/qr',
    customer: '/login'
}

export default function Login() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword]     = useState('')
    const [message, setMessage]       = useState({ text: '', type: '' })
    const [busy, setBusy]             = useState(false)
    const cardRef                     = useRef(null)
    const navigate                    = useNavigate()

    function showError(text) {
        setMessage({ text, type: 'error' })
        const card = cardRef.current
        if (card) {
            card.classList.remove('shake')
            void card.offsetWidth
            card.classList.add('shake')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const id = identifier.trim()
        const pw = password

        if (!id || !pw) {
            showError('Please fill in all fields.')
            return
        }

        setBusy(true)
        setMessage({ text: '', type: '' })

        try {
            const res  = await fetch('/api/auth/login', {
                method:      'POST',
                headers:     { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:        JSON.stringify({ identifier: id, password: pw })
            })

            const data = await res.json().catch(() => ({}))

            if (!res.ok || !data.success) {
                showError(data.message || 'Incorrect credentials. Please try again.')
                return
            }

            const role = String(data.user?.role || '').toLowerCase().trim()
            const path = ROLE_REDIRECTS[role]

            if (path) {
                navigate(path)
            } else {
                showError('No dashboard found for this account.')
            }

        } catch {
            showError('Cannot reach the server. Please check if the backend is running.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="layout-centered">
            <main className="shell">
                <section className="brand-panel" style={{ backgroundImage: `url(${heroBg})` }}>
                    <article className="pitch">
                        <img className="logo-img" src={logo} alt="A.S. De Leon" />
                        <h2>Orders, sales and payroll in one place.</h2>
                        <p>Track every window and door from measurement to delivery.</p>
                    </article>

                    <footer>
                        <p className="role-tag">Enter your credentials to continue.</p>
                    </footer>
                </section>

                <section className="form-panel">
                    <article className="card" ref={cardRef}>
                        <header>
                            <h2 className="card-title">Sign in</h2>
                            <p className="hint">Enter your username or email to continue.</p>
                        </header>

                        {message.text && (
                            <p className={`alert show${message.type === 'success' ? ' success' : ''}`} role="alert">
                                {message.text}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field">
                                <label htmlFor="identifier">Username or Email</label>
                                <input
                                    id="identifier"
                                    type="text"
                                    placeholder="Enter username or email"
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={e => setIdentifier(e.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" disabled={busy}>
                                {busy ? 'Signing in…' : 'Sign in'}
                            </button>
                        </form>

                        <button
                            type="button"
                            className="link-btn"
                            onClick={() => navigate('/signup')}
                        >
                            New customer? Create an account
                        </button>
                    </article>
                </section>
            </main>
        </div>
    )
}
