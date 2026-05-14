import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/SidebarLivreur.css';
const SidebarLivreur = () => {
     const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="bottom-nav-container">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item-mobile active" : "nav-item-mobile"}>
                  <i className="bi bi-house-door"></i>
                <span className="label">Home</span>
            </NavLink>
            {/* Missions */}
            <NavLink to="/MyMissions" className={({ isActive }) => isActive ? "nav-item-mobile active" : "nav-item-mobile"}>
                <i className="bi bi-box-seam"></i>
                <span className="label">Missions</span>
            </NavLink>

            {/* History */}
            <NavLink to="/historique" className={({ isActive }) => isActive ? "nav-item-mobile active" : "nav-item-mobile"}>
                <i className="bi bi-clock-history"></i>
                <span className="label">History</span>
            </NavLink>

            {/* Wallet */}

            {/* Logout */}
            <button onClick={handleLogout} className="nav-item-mobile logout-mobile" style={{border:'none', background:'none'}}>
                <i className="bi bi-box-arrow-right"></i>
                <span className="label">Quitter</span>
            </button>
        </div>
    );
};

export default SidebarLivreur;