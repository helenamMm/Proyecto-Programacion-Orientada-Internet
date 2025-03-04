import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchBar from './SearchBar';
import SideMenu from './SideMenu';
import SideMenuCursos from './SideMenuCursos';
import CursoTallerImg from '/src/assets/img/curso-taller.jpg';


function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);  
	const [isPlayMenuOpen, setIsPlayMenuOpen] = useState(false); 

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
						<li className="nav-item me-3">
							<a className="nav-link" href="#" onClick={() => setIsMenuOpen(true)}>
								<i className="bi bi-envelope"></i>
							</a>
						</li>
						<li className="nav-item me-3">
							<a className="nav-link" href="#" onClick={() => setIsPlayMenuOpen(true)}>
							<i class="bi bi-play-btn"></i>
							</a>
						</li>
					</ul>
				</div>
			</nav>

			<SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />                                
			<SideMenuCursos isOpen={isPlayMenuOpen} onClose={() => setIsPlayMenuOpen(false)}>
				<div className="p-3 text-bg-dark">
					<h5>Cursos</h5>
					<div className="card bg-light p-2 my-2">
						<img src={CursoTallerImg} alt="curso-taller" />
						<p>Curso 1</p>
						
					</div>
					<div className="card bg-light p-2 my-2">
						<p>Curso 2</p>
					</div>
					<div className="card bg-light p-2 my-2">
						<p>Curso 3</p>
					</div>
				</div>
			</SideMenuCursos>
		</>
	);
}

export default Header;
