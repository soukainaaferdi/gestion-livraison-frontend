import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Link } from "react-router-dom";
import '../styles/Dashboard.css';

const AdminDashboard = () => {
    const [data, setData] = useState({ orders: [], clients: [], livreurs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const [ord, clt, liv] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/orders'),
                axios.get('http://127.0.0.1:8000/api/clients'),
                axios.get('http://127.0.0.1:8000/api/livreurs')
            ]);
            setData({ orders: ord.data, clients: clt.data, livreurs: liv.data });
            setLoading(false);
        };
        fetchAll();
    }, []);

const totalRevenue = data.orders
    .filter(o => o.statut === "Livré")
    .reduce((s, o) => s + (Number(o.prix_total) || 0), 0);
    const lastOrders = [...data.orders].reverse().slice(0, 5);

   const chartData = [
    { name: 'Livré', count: data.orders.filter(o => o.statut === "livre").length, color: '#aaaddc' },
    { name: 'En cours', count: data.orders.filter(o => o.statut === "assigne").length, color: '#6366f1' },
    { name: 'Annulé', count: data.orders.filter(o => o.statut === "annule").length, color: '#c393d8' },
];
    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-indigo" role="status"></div>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h4 className="fw-bold tracking-tight"> Dashboard</h4>
                </div>
                <div>
                    {new Date().toLocaleDateString()}
                </div>
            </header>

            {/* 1. Stats Row (Tariqa dyalk b l-map) */}
            <div className="row g-4 mb-5">
                {[
                    { title: "Commandes", val: data.orders.length, icon: "bi-box-seam", color: "indigo" },
                    { title: "Clients", val: data.clients.length, icon: "bi-people", color: "emerald" },
                    { title: "Livreurs", val: data.livreurs.length, icon: "bi-bicycle", color: "amber" },
                    { title: "Profit Net", val: totalRevenue + " DH", icon: "bi-wallet2", color: "rose" }
                ].map((item, i) => (
                    <div className="col-md-3" key={i}>
                        <div className="stat-card">
                            <div className={`icon-box bg-soft-${item.color}`}>
                                <i className={`bi ${item.icon} text-${item.color} fs-4`}></i>
                            </div>
                            <div className="mt-3">
                                <h6 className="text-muted small mb-1">{item.title}</h6>
                                <h3 className="fw-bold mb-0">{item.val}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* 2. Chart Section */}
                <div className="col-lg-7">
                    <div className="main-card h-100">
                        <h5 className="fw-bold mb-4">Analyse des flux</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. Top Livreurs */}
                <div className="col-lg-5">
                    <div className="main-card h-100">
                        <h5 className="fw-bold mb-3">Top Livreurs</h5>
                        <div className="livreurs-list">
                            {data.livreurs.slice(0, 5).map((l, i) => (
                                <div key={i} className="livreur-item">
                                    <div className="avatar-circle">{l.name?.charAt(0)}</div>
                                    <div className="ms-3 flex-grow-1">
                                        <div className="fw-bold small">{l.name}</div>
                                        {/* <div className="text-muted small status-indicator online" style={{fontSize: '10px'}}>{l.status}</div> */}
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Recent Orders Table */}
                <div className="col-12 mt-4">
                    <div className="main-card">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Dernières Activités</h5>
                            <Link to="/orders" className="btn btn-indigo-light btn-sm">Voir tout</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table custom-table align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Produit</th>
                                        <th>Client</th>
                                        <th>Prix</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastOrders.map(o => (
                                        <tr key={o.id}>
                                            <td className="fw-bold text-indigo">#{o.id}</td>
                                            <td>{o.produit}</td>
                                            <td className="text-muted">{o.client_id}</td>
                                            <td className="fw-bold">{o.prix_total} DH</td>
                                            <td>
                                                <span className={`badge-status ${o.statut === 'Livré' ? 'delivered' : 'pending'}`}>
                                                    {o.statut}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;