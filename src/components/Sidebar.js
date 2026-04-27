import { NavLink } from 'react-router-dom';
import { FaSignOutAlt, FaCube } from 'react-icons/fa'; // khllina ghir l-logo ou logout icons
import '../styles/Sidebar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <div className="sidebar-container">
            {/* Logo Section */}
            <div className="logo-section">
                <div className="logo-icon">
                    <FaCube size={28} />
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="nav flex-column">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item-custom active" : "nav-item-custom"}>
                    <i className="bi bi-house-door"></i>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/Clients" className={({ isActive }) => isActive ? "nav-item-custom active" : "nav-item-custom"}>
                    <i className="bi bi-people"></i>
                    <span>Clients</span>
                </NavLink>

                <NavLink to="/Orders" className={({ isActive }) => isActive ? "nav-item-custom active" : "nav-item-custom"}>
                    <i className="bi bi-cart"></i>
                    <span>Commandes</span>
                </NavLink>

                <NavLink to="/Livreurs" className={({ isActive }) => isActive ? "nav-item-custom active" : "nav-item-custom"}>
                    <i className="bi bi-truck"></i>
                    <span>Livreurs</span>
                </NavLink>
            </nav>

            {/* Logout Button */}
          <button onClick={handleLogout} className="logout-btn">
    <div className="icon-wrapper">
        <i className="bi bi-box-arrow-right"></i>
    </div>
    <span>Se déconnecter</span>
</button>
        </div>
    );
}

export default Sidebar;