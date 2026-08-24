import { Link, NavLink } from 'react-router-dom';
import { useBookings } from '../context/BookingsContext';
import business from '../data/business.json';

// Заглавие со логото, името на работилницата и навигацијата
function Header() {
  const { totalBookings } = useBookings();

  // NavLink сам додава класа на активната рута
  function navClass({ isActive }) {
    return isActive ? 'nav-link nav-link-active' : 'nav-link';
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="logo" to="/">
          <span className="logo-mark">
            <img src={business.logo} alt={`Лого ${business.name}`} />
          </span>

          <span>
            <span className="business-name">{business.name}</span>
            <span className="tagline">{business.tagline}</span>
          </span>
        </Link>

        <a className="header-phone" href={`tel:+${business.phoneDigits}`}>
          {business.phone}
        </a>
      </div>

      <nav className="main-nav">
        <div className="container main-nav-inner">
          <NavLink className={navClass} to="/" end>
            Наши Услуги
          </NavLink>

          <NavLink className={navClass} to="/zakazi">
            Закажи Термин
          </NavLink>

          <NavLink className={navClass} to="/termini">
            Термини
            <span className="nav-badge">{totalBookings}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;
