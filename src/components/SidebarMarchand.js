import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/SidebarMarchand.css';
import { FaCube } from 'react-icons/fa';

const SidebarMarchand = () => {
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="marchand-sidebar">
            {/* Logo */}
            <div className="marchand-logo">
                <FaCube size={22} color="#6366f1" />
                <span>LIVRIHA</span>
            </div>

            {/* Nav */}
            <nav className="marchand-nav">
                <NavLink to="/marchand/dashboard" className={({ isActive }) => isActive ? "marchand-nav-item active" : "marchand-nav-item"}>
                    <i className="bi bi-grid"></i>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/marchand/add-order" className={({ isActive }) => isActive ? "marchand-nav-item active" : "marchand-nav-item"}>
                    <i className="bi bi-plus-circle"></i>
                    <span>Nouvelle commande</span>
                </NavLink>
                <NavLink to="/marchand/commandes" className={({ isActive }) => isActive ? "marchand-nav-item active" : "marchand-nav-item"}>
                    <i className="bi bi-box-seam"></i>
                    <span>Mes commandes</span>
                </NavLink>
                <NavLink to="/marchand/payments" className={({ isActive }) => isActive ? "marchand-nav-item active" : "marchand-nav-item"}>
                    <i className="bi bi-wallet2"></i>
                    <span>Paiements</span>
                </NavLink>
                {/* <NavLink to="/marchand/profile" className={({ isActive }) => isActive ? "marchand-nav-item active" : "marchand-nav-item"}>
                    <i className="bi bi-person-circle"></i>
                    <span>Mon profil</span>
                </NavLink> */}
            </nav>

            {/* Logout */}
            <button onClick={handleLogout} className="marchand-logout">
                <i className="bi bi-box-arrow-right"></i>
                <span>Déconnexion</span>
            </button>
        </div>
    );
};

export default SidebarMarchand;