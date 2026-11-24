import { Link } from 'react-router-dom'
import '../styles/welcome.css'
import logo from '../assets/logo.png'

export default function Welcome() {
    return (
        <div className="layout-centered welcome-page">
            <main className="welcome">
                <section className="hero">
                    <header>
                        <img className="logo-img" src={logo} alt="A.S. De Leon Glass and Aluminum Fabrication" />
                    </header>

                    <article className="intro">
                        <h1>Employee Attendance System</h1>
                        <p>Welcome to A.S. DE LEON Glass and Aluminum Fabrication System.</p>

                        <div className="actions">
                            <Link className="btn btn-primary" to="/login">Log in</Link>
                            <Link className="btn btn-secondary" to="/signup">Sign up with email</Link>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    )
}
