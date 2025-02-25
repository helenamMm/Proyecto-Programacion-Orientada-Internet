import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchBar from './SearchBar';
import SideMenu from './SideMenu';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);  

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container d-flex justify-content-between align-items-center">
                    <a className="navbar-brand" href="/" style={{ color: 'yellow' }}>
                        No te achicopales tutorías
                    </a>

                    <div className="d-flex flex-grow-1 justify-content-center">
                        <SearchBar />
                    </div>

                    <ul className="navbar-nav d-flex flex-row">
                        <li className="nav-item me-3">
                            <a className="nav-link" href="/">
                                <i className="bi bi-person-circle"></i>
                            </a>
                        </li>
                        <li className="nav-item me-3">
                            <a className="nav-link" href="/about">
                                <i className="bi bi-bell"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => setIsMenuOpen(true)}>
                                <i className="bi bi-envelope"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}

export default Header;
