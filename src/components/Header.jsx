import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchBar from './SearchBar';
import SideMenu from './SideMenu';
import SideMenuCursos from './SideMenuCursos';
import CursoTallerImg from '/src/assets/img/curso-taller.jpg';
import LoginModal from './LoginModal';
import BotonCrearGrupo from "./BotonCrearGrupo"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ChatGrupo from "./ChatGrupo";
import ChecklistModal from './ChecklistModal';
import FormularioCrearLista from './FormularioCrearLista';


function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);  
	const [isPlayMenuOpen, setIsPlayMenuOpen] = useState(false); 
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false); // 💥 AGREGA ESTA LÍNEA
	const [username, setUsername] = useState(""); // Si quieres mostrar el nombre luego
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [mostrarCrearGrupo, setMostrarCrearGrupo] = useState(false);
	const [userGroups, setUserGroups] = useState([]);
	const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);

	const [chatPrivado, setChatPrivado] = useState(null); // para chats 1 a 1
	const [mostrarCrearLista, setMostrarCrearLista] = useState(false);
	


/*
	 const handleLogin = (user) => {
    setIsLoggedIn(true);     // ✅ Ahora sí existe
    setUsername(user);       // Solo si quieres guardarlo
	 fetchUserGroups(user); // trae los grupos
  };*/

const handleLogin = (user) => {
  setIsLoggedIn(true);
  setUsername(user.nombre);
  setUser(user); // <-- guarda todo el objeto del usuario loggeado
  fetchUserGroups(user.uid);
};



	// Función para manejar la apertura del SideMenu
	const openSideMenu = () => {
		setIsMenuOpen(true); // Abre el menú lateral
		setIsPlayMenuOpen(false); // Cierra el menú de cursos
	};

	// Función para manejar el cierre del SideMenu
	const closeSideMenu = () => {
		setIsMenuOpen(false); // Cierra el menú lateral
	};

	// Función para manejar la apertura del SideMenuCursos
	const openSideMenuCursos = () => {
		
		setIsPlayMenuOpen(true); // Abre el menú de cursos
		setIsMenuOpen(false); // Cierra el menú lateral
	};

	const openChatModal = () => {
		setIsMenuOpen(false); // Cierra el SideMenu
		setIsChatOpen(true); // Abre el ChatModal
	};
	
	const closeChatModal = () => {
		setIsChatOpen(false); // Cierra el ChatModal
		setIsMenuOpen(true); // Reabre el SideMenu
	};
	
	const handleGrupoCreado = () => {
  setMostrarCrearGrupo(false);
  // Aquí puedes agregar lógica extra si quieres, ej: notificar, actualizar lista, etc.
};
/*
const fetchUserGroups = async (nombreUsuario) => {
  const q = query(collection(db, "grupos"), where("usuarios", "array-contains", nombreUsuario));
  const querySnapshot = await getDocs(q);
  const grupos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setUserGroups(grupos);
};*/
const fetchUserGroups = async (uid) => {
  const q = query(collection(db, "grupos"), where("miembros", "array-contains", uid));
  const querySnapshot = await getDocs(q);
  const grupos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setUserGroups(grupos);
};



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
						{isLoggedIn ? (
							<li className="nav-item me-3">
								<span className="nav-link text-light">Hola, {username}!</span>
							</li>
						) : (
							<li className="nav-item me-3">
								<a className="nav-link" onClick={() => setIsLoginOpen(true)}>
									<i className="bi bi-person-circle"></i>
								</a>
							</li>
						)}

						<li className="nav-item me-3">
							<a className="nav-link" href="/about">
								<i className="bi bi-bell"></i>
							</a>
						</li>
						<li className="nav-item me-3">
							<a className="nav-link" href="#" onClick={openSideMenu}>
								<i className="bi bi-envelope"></i>
							</a>
						</li>
						<li className="nav-item me-3">
							<a className="nav-link" href="#" onClick={openSideMenuCursos}>
								<i className="bi bi-play-btn"></i>
							</a>
						</li>
						<li className="nav-item me-3">
  <button
    className="btn btn-outline-warning btn-sm"
    onClick={() => setMostrarCrearLista(true)}
  >
    Crear lista
  </button>
</li>


						<li className="nav-item me-3">
  <button
    className="btn btn-outline-light btn-sm"
    onClick={() => setMostrarCrearGrupo(!mostrarCrearGrupo)}
  >
    Crear grupo
  </button>
</li>

					</ul>
				</div>
			</nav>

			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
			<SideMenu isOpen={isMenuOpen} onClose={closeSideMenu} />
			<SideMenuCursos
  isOpen={isPlayMenuOpen}
  onClose={() => setIsPlayMenuOpen(false)}
  grupos={userGroups}
  onGrupoSeleccionado={(grupoId) => {
    console.log("Grupo seleccionado:", grupoId);
    setGrupoSeleccionado(grupoId);
  setIsChatOpen(true);
	
  }}
>
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

{isChatOpen && grupoSeleccionado && (
  <ChatGrupo
    grupoId={grupoSeleccionado}
    onClose={() => setIsChatOpen(false)}
  />
)}
{mostrarCrearLista && (
  <div
    style={{
      position: "absolute",
      top: "60px",
      right: "20px",
      zIndex: 3000,
      backgroundColor: "white",
      color: "black",
      padding: "1rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      width: "300px",
    }}
  >
    <FormularioCrearLista onCerrar={() => setMostrarCrearLista(false)} />
  </div>
)}


{mostrarCrearGrupo && (
  <div
    style={{
      position: "absolute",
      top: "60px",
      right: "20px",
      zIndex: 3000,
      backgroundColor: "white",
      color: "black",
      padding: "1rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      width: "300px",
    }}
  >
    <BotonCrearGrupo onGrupoCreado={handleGrupoCreado} />
  </div>
)}

		</>
	);
}

export default Header;
