import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/signup.css'
import logo from '../assets/logo.png'
import heroBg from '../assets/Fabrication.jpg'

const validName  = /^[\p{L}][\p{L}\s.,'-]*$/u
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const hasNumber  = /[0-9]/
const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/

function validatePassword(pw) {
    if (pw.length < 8 || pw.length > 70) return 'Password must be 8 to 70 characters.'
    if (!hasNumber.test(pw))  return 'Password must contain at least one number.'
    if (!hasSpecial.test(pw)) return 'Password must contain at least one special character (e.g. !@#$%).'
    return null
}

export default function Signup() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm]   = useState('')
    const [message, setMessage]   = useState({ text: '', type: '' })
    const [busy, setBusy]         = useState(false)
    const cardRef                 = useRef(null)
    const navigate                = useNavigate()

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

        const name = fullName.trim().replace(/\s+/g, ' ')
        const mail = email.trim().toLowerCase()
        const pw   = password
        const conf = confirm

        if (name.length < 2 || name.length > 50 || !validName.test(name)) {
            showError("Please enter a valid name (letters, spaces, . , ' - only).")
            return
        }
        if (!validEmail.test(mail)) {
            showError('Please enter a valid email address.')
            return
        }
        const pwError = validatePassword(pw)
        if (pwError) { showError(pwError); return }
        if (pw !== conf) {
            showError('Passwords do not match.')
            return
        }

        setBusy(true)
        setMessage({ text: '', type: '' })

        try {
            const res  = await fetch('/api/auth/register_customer', {
                method:      'POST',
                headers:     { 'Content-Type': 'application/json' },
                credentials: 'include',
                body:        JSON.stringify({ full_name: name, email: mail, password: pw })
            })
            const data = await res.json().catch(() => ({}))

            if (!res.ok || !data.success) {
                showError(data.message || 'Could not create the account.')
                return
            }

            navigate('/verify-otp', { state: { email: mail } })

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
                        <p>Create a customer account to send inquiries and track your orders.</p>
                    </article>

                    <footer>
                        <p className="role-tag">Customer registration</p>
                    </footer>
                </section>

                <section className="form-panel">
                    <article className="card" ref={cardRef}>
                        <header>
                            <h2 className="card-title">Sign up</h2>
                            <p className="hint">Create your customer account.</p>
                        </header>

                        {message.text && (
                            <p className={`alert show${message.type === 'success' ? ' success' : ''}`} role="alert">
                                {message.text}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="field">
                                <label htmlFor="fullName">Full name</label>
                                <input id="fullName" type="text" placeholder="Enter full name"
                                    autoComplete="name" value={fullName}
                                    onChange={e => setFullName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" placeholder="yourname@email.com"
                                    autoComplete="email" value={email}
                                    onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password"
                                    placeholder="8-70 chars, number &amp; special character"
                                    autoComplete="new-password" value={password}
                                    onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="confirm">Confirm password</label>
                                <input id="confirm" type="password" placeholder="Repeat password"
                                    autoComplete="new-password" value={confirm}
                                    onChange={e => setConfirm(e.target.value)} />
                            </div>

                            <button type="submit" disabled={busy}>
                                {busy ? 'Creating account…' : 'Create account'}
                            </button>
                            <p className="note">We will email you a verification code.</p>
                        </form>

                        <button type="button" className="link-btn" onClick={() => navigate('/login')}>
                            Already have an account? Sign in
                        </button>
                    </article>
                </section>
            </main>
        </div>
    )
}
