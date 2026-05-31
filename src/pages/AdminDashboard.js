import React, { useState, useEffect } from "react";
import axios from "axios";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend, LineChart, Line } from 'recharts';
import { Link } from "react-router-dom";
import '../styles/Dashboard.css';

const AdminDashboard = () => {
    const [data, setData] = useState({ orders: [], clients: [], livreurs: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            const token = localStorage.getItem('token');
          const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
    }
};
            try{

             const [ord, clt, liv] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/orders', config),
                axios.get('http://127.0.0.1:8000/api/clients', config),
                axios.get('http://127.0.0.1:8000/api/livreurs', config)
            ]);
                setData({ orders: ord.data, clients: clt.data, livreurs: liv.data });
                setLoading(false);
            }catch(error){
                 console.error("Erreur lors du chargement des données:", error);
                if (error.response?.status === 401) {
                    alert("Session expirée. Veuillez vous reconnecter.");
                    // تقدر تزيد هنا navigate('/login') إيلا بغيتي
                }
            }
        };
        fetchAll();
    }, []);

const totalRevenue = data.orders
    .filter(o => o.statut?.toLowerCase() === "livre") // ردينا كلشي صغير باش يطابق DB
    .reduce((s, o) => s + (Number(o.frais_livraison) || 0), 0);
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
// Pie chart — zones
const zoneData = data.orders.reduce((acc, o) => {
    const zone = o.destination_zone || "Autre";
    const existing = acc.find(z => z.name === zone);
    if (existing) existing.value++;
    else acc.push({ name: zone, value: 1 });
    return acc;
}, []);
const zoneColors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#0d9488', '#8b5cf6'];

// Line chart — revenue par jour
const revenueData = (() => {
    const days = {};
    data.orders
        .filter(o => o.statut === "livre")
        .forEach(o => {
            const date = new Date(o.updated_at).toLocaleDateString('fr-FR', { weekday: 'short' });
            days[date] = (days[date] || 0) + Number(o.frais_livraison || 0);
        });
    return Object.entries(days).slice(-7).map(([name, revenue]) => ({ name, revenue }));
})();
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
                    { title: "Profit Net", val: `${totalRevenue.toFixed(2)} DH`, icon: "bi-wallet2", color: "rose" }
                ].map((item, i) => (
                    <div className="col-md-3" key={i}>
                        <div className={`stat-card stat-${item.color}`}>
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
    
    {/* Bar chart — statuts */}
    <div className="col-lg-4">
        <div className="main-card h-100">
            <h5 className="fw-bold mb-4">Analyse des commandes</h5>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>

    {/* Pie chart — zones */}
    <div className="col-lg-4">
        <div className="main-card h-100">
            <h5 className="fw-bold mb-4">Zones actives</h5>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={zoneData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {zoneData.map((entry, index) => (
                                <Cell key={index} fill={zoneColors[index % zoneColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(val, name) => [`${val} commandes`, name]} />
                        <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>

    {/* Line chart — revenue */}
  <div className="col-lg-4">
    <div className="main-card h-100">
        <h5 className="fw-bold mb-4"> Livreurs</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.livreurs.slice(0, 5).map((l, i) => {
                const livraisons = data.orders.filter(o => o.livreur_id === l.id && o.statut === "livre").length;
                const isOccupe = data.orders.some(o => o.livreur_id === l.id && o.statut === "assigne");
                return (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        background: '#f8faff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            background: '#eef2ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', color: '#6366f1', fontSize: '14px',
                            flexShrink: 0
                        }}>
                            {l.nom_complet?.charAt(0)}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>
                                {l.nom_complet}
                            </p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                                {l.zone} • {livraisons} livraisons
                            </p>
                        </div>
                        {/* Statut */}
                        <span style={{
                            background: isOccupe ? '#fff1f2' : '#ecfdf5',
                            color: isOccupe ? '#e11d48' : '#059669',
                            border: `1px solid ${isOccupe ? '#fecdd3' : '#6ee7b7'}`,
                            borderRadius: '50px',
                            padding: '3px 10px',
                            fontSize: '10px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                        }}>
                            {isOccupe ? 'Occupé' : 'Disponible'}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
</div>

    {/* Dernières commandes — fix badge */}
    <div className="col-lg-12">
        <div className="main-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Dernières commandes</h5>
                <Link to="/Orders" className="btn btn-success btn-sm">Voir tout</Link>
            </div>
            <div className="table-responsive">
                <table className="table custom-table align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Destinataire</th>
                            <th>Produit</th>
                            <th>Marchand</th>
                            <th>Prix</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastOrders.map(o => (
                            <tr key={o.id}>
                                <td className="fw-bold text-indigo">#{o.id}</td>
                                <td>{o.destinataire_name}</td>
                                <td>{o.produit}</td>
                                <td className="text-muted">#{o.client_id}</td>
                                <td className="fw-bold">{o.prix_total} DH</td>
                                <td>
                                    <span className={`badge-status ${
                                        o.statut === 'livre' ? 'delivered' :
                                        o.statut === 'assigne' ? 'assigned' :
                                        o.statut === 'annule' ? 'cancelled' :
                                        o.statut === 'retour' ? 'bg-secondary' :
                                        'pending'
                                    }`}>
                                        {o.statut === 'livre' ? 'Livré' :
                                         o.statut === 'assigne' ? 'Assigné' :
                                         o.statut === 'annule' ? 'Annulé' :
                                         o.statut === 'retour' ? 'Retour' :
                                         'En attente'}
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