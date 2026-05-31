import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DashboarLivreur.css";

const LivreurDashboard = () => {
    const [stats, setStats] = useState({
        solde: 0,
        activeMissions: 0,
        totalDone: 0,
        totalRetour: 0,
        totalAnnule: 0,
        lastOrders: []
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!user || !token) return;

        const API = "http://127.0.0.1:8000/api";
        const config = { headers: { Authorization: `Bearer ${token}` } };

        axios.get(`${API}/livreurs/by-user/${user.id}`, config)
            .then(res => setStats(p => ({ ...p, solde: res.data.solde })));

        axios.get(`${API}/my-orders/${user.id}`, config)
            .then(res => {
                const orders = res.data;

                setStats(p => ({
                    ...p,
                    activeMissions: orders.filter(o => o.statut === "assigne").length,
                    totalDone: orders.filter(o => o.statut === "livre").length,
                    totalRetour: orders.filter(o => o.statut === "retour").length,
                    totalAnnule: orders.filter(o => o.statut === "annule").length,
                    lastOrders: orders.slice(-5).reverse()
                }));
            });
    }, [user?.id, token]);

    if (!user) return <div className="loading">Login required</div>;

    return (
        <div className="dashboard">

            {/* HEADER */}
            <div className="dashboard-header">
                <div>
                    <h2>Dashboard</h2>
                    <p>Bienvenue, {user.email}</p>
                </div>
            </div>

            {/* STATS */}
            <div className="stats-grid">

                <div className="card solde">
                    <span>Solde</span>
                    <h3>{stats.solde} DH</h3>
                </div>

                <div className="card active">
                    <span>Actives</span>
                    <h3>{stats.activeMissions}</h3>
                </div>

                <div className="card done">
                    <span>Livrées</span>
                    <h3>{stats.totalDone}</h3>
                </div>

                <div className="card danger">
                    <span>Annulées</span>
                    <h3>{stats.totalAnnule}</h3>
                </div>
            </div>

            {/* CONTENT */}
            <div className="grid-2">

                {/* LAST ORDERS */}
                <div className="panel">
                    <h4>Dernières missions</h4>

                    {stats.lastOrders.map((o, i) => (
                        <div key={i} className="order">
                            <div>
                                <p className="name">{o.produit}</p>
                                <p className="sub">{o.destination_zone}</p>
                            </div>

                            <div className="right">
                                <span className="price">{o.prix_total} DH</span>
                                <span className={`badge ${o.statut}`}>
                                    {o.statut}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SUMMARY */}
                <div className="panel">
                    <h4>Résumé</h4>

                    <div className="mini">
                        <span>Retours</span>
                        <b>{stats.totalRetour}</b>
                    </div>

                    <div className="mini">
                        <span>En cours</span>
                        <b>{stats.activeMissions}</b>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default LivreurDashboard;