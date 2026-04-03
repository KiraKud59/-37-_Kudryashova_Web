import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <header className="navbar">
            <div className="nav-container">
                <div className="logo">📡 Лаб.раб.7: React + TypeScript</div>
                <nav className="nav-links">
                    <NavLink to="/dogs" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🐕 Dog API</NavLink>
                    <NavLink to="/catfacts" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>🐱 Cat Facts</NavLink>
                    <NavLink to="/users" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>👥 RandomUser</NavLink>
                </nav>
            </div>
        </header>
    );
}