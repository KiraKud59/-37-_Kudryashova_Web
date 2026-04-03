import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import DogView from './components/DogView';
import CatFactsView from './components/CatFactsView';
import UsersView from './components/UsersView';
import './style7.css';

function NavBar() {
    return (
        <header className="navbar">
            <div className="nav-container">
                <div className="logo">📡 Лаб.раб.7: React + TypeScript</div>
                <nav className="nav-links">
                    <NavLink to="/dogs" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                        🐕 Dog API
                    </NavLink>
                    <NavLink to="/catfacts" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                        🐱 Cat Facts
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                        👥 RandomUser
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<DogView />} />
                    <Route path="/dogs" element={<DogView />} />
                    <Route path="/catfacts" element={<CatFactsView />} />
                    <Route path="/users" element={<UsersView />} />
                </Routes>
            </main>
            <footer>
                <p>© 2026 Лабораторная работа №7 | React + TypeScript | SPA с роутингом</p>
            </footer>
        </BrowserRouter>
    );
}

export default App;