import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/login.css'
import logo from '../assets/logo.png'

export default function VerifyOtp() {
    const [code, setCode]       = useState('')
    const [message, setMessage] = useState({ text: '', type: '' })
    const [busy, setBusy]       = useState(false)
    const cardRef               = useRef(null)
    const navigate              = useNavigate()
    const location              = useLocation()
    const email                 = location.state?.email

    useEffect(() => {
        if (!email) navigate('/signup')
    }, [email, navigate])

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
        const trimmed = code.trim()

        if (!trimmed || trimmed.length !== 6 || !/^\d{6}$/.test(trimmed)) {
            showError('Please enter the 6-digit code sent to your email.')
            return
        }

        setBusy(true)
        setMessage({ text: '', type: '' })

        try {
            const res  = await fetch('/api/auth/verify_otp', {
                method:      'POST',
                headers:     { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:        JSON.stringify({ email, code: trimmed })
            })
            const data = await res.json().catch(() => ({}))

            if (!res.ok || !data.success) {
                showError(data.message || 'Incorrect or expired code.')
                return
            }

            navigate('/login', { state: { successMessage: data.message } })

        } catch {
            showError('Cannot reach the server. Please check if the backend is running.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="layout-centered">
            <main className="shell">
                <section className="brand-panel">
                    <header className="logo">
                        <Link to="/">
                            <img className="logo-img" src={logo} alt="A.S. De Leon, back to home" />
                        </Link>
                    </header>

                    <article className="pitch">
                        <h2>One last step.</h2>
                        <p>Enter the 6-digit code we sent to your email to activate your account.</p>
                    </article>

                    <footer>
                        <p className="role-tag">Email verification</p>
                    </footer>
                </section>

                <section className="form-panel">
                    <article className="card" ref={cardRef}>
                        <header>
                            <h2 className="card-title">Verify your email</h2>
                            <p className="hint">
                                We sent a code to <strong>{email}</strong>. Check your inbox.
                            </p>
                        </header>

                        {message.text && (
                            <p className={`alert show${message.type === 'success' ? ' success' : ''}`} role="alert">
                                {message.text}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field">
                                <label htmlFor="otp">Verification code</label>
                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="6-digit code"
                                    autoComplete="one-time-code"
                                    value={code}
                                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            <button type="submit" disabled={busy}>
                                {busy ? 'Verifying…' : 'Verify account'}
                            </button>
                        </form>

                        <button type="button" className="link-btn" onClick={() => navigate('/signup')}>
                            Back to sign up
                        </button>
                    </article>
                </section>
            </main>
        </div>
    )
}
