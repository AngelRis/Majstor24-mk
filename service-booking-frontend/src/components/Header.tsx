import { useAuth } from '../context/AuthContext';
import styles from './css/Header.module.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { isLoggedIn, fullName, role, logout } = useAuth();
  const navigate=useNavigate()
  const handleLogout = () => {
    logout();               
    navigate("/home");      
  };

  return (
    <header>
      <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm ${styles.navbar}`}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="Logo" height="50" className="me-2" />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/">Почетна</a>
              </li>
               {isLoggedIn &&  role==="PROVIDER" &&(
              <li className="nav-item">
                <a className="nav-link" href="/myServices">Мои услуги</a>
              </li>
               )}
               {isLoggedIn &&  role==="PROVIDER" &&(
              <li className="nav-item">
                <a className="nav-link" href="/reservationsForMyServices">Клиенти</a>
              </li>
              )}
              {isLoggedIn &&  role==="CLIENT" &&(
              <li className="nav-item">
                <a className="nav-link" href="/myReservations">Мои резервации</a>
              </li>
              )}

          
            </ul>

            <div className="d-flex align-items-center gap-3">
              {!isLoggedIn ? (
                <>
                  <a className="btn btn-outline-primary" href="/login">Најава</a>
                  <a className="btn btn-primary" href="/register">Регистрација</a>
                </>
              ) : (
                <>
                  <span className={styles.greeting}>Здраво, {fullName}</span>
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Одјава</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
