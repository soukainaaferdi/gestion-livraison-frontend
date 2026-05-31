import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/MarchantPayments.css';

const MarchandPayments = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/marchand/commandes", config)
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const livrees = orders.filter(o => o.statut === "livre");
    const soldeDu = livrees.filter(o => !o.is_paid).reduce((sum, o) => sum + Number(o.prix_marchandise), 0);
    const soldePaye = livrees.filter(o => o.is_paid).reduce((sum, o) => sum + Number(o.prix_marchandise), 0);
    const totalGagne = livrees.reduce((sum, o) => sum + Number(o.prix_marchandise), 0);

    const getStatutClass = (is_paid) => is_paid
        ? { className: 'status-badge', bg: 'var(--emerald-soft)', color: 'var(--emerald)', border: '1px solid var(--emerald-mid)', label: '✓ Payé' }
        : { className: 'status-badge', bg: 'var(--rose-soft)', color: 'var(--rose)', border: '1px solid var(--rose-mid)', label: ' En attente' };

    if (loading) return (
        <div className="md-loading">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} role="status"></div>
        </div>
    );

    return (
        <div className="md-wrapper">

            {/* Header */}
            <div className="md-header">
                <div>
                    <h4>Paiements </h4>
                </div>
                <div>
                    <span className="md-date-badge">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </div>

            {/* Cards */}
            <div className="md-cards">
                {[
                    { label: 'Total gagné', val: `${totalGagne} DH`, icon: 'bi-graph-up', cls: 'indigo' },
                    { label: 'Déjà payé', val: `${soldePaye} DH`, icon: 'bi-check-circle', cls: 'emerald' },
                    { label: 'En attente', val: `${soldeDu} DH`, icon: 'bi-hourglass-split', cls: 'amber' },
                    { label: 'Livraisons', val: livrees.length, icon: 'bi-box-seam', cls: 'rose' },
                ].map((card, i) => (
                    <div className="md-card" key={i}>
                        <div className="md-card-top">
                            <div className={`md-card-icon icon-${card.cls}`}>
                                <i className={`bi ${card.icon}`}></i>
                            </div>
                        </div>
                        <p className="md-card-label">{card.label}</p>
                        <h2 className="md-card-val">{card.val}</h2>
                    </div>
                ))}
            </div>

            

            {/* Table livraisons */}
            <div className="md-section">
                <div className="md-section-header">
                    <h6 className="md-section-title"> Détail des livraisons</h6>
                    <span className="md-section-count">{livrees.length} livraisons</span>
                </div>

                {livrees.length === 0 ? (
                    <div className="md-empty">
                        <i className="bi bi-inbox" style={{ fontSize: '2.5rem', color: 'var(--primary-mid)' }}></i>
                        <p>Aucune livraison effectuée pour le moment</p>
                    </div>
                ) : (
                    <div className="md-table-container">
                        <table className="md-table">
                            <thead>
                                <tr>
                                    {['N°', 'Destinataire', 'Produit', 'Zone', 'Montant', 'Statut paiement', 'Date'].map((th, i) => (
                                        <th key={i}>{th}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {livrees.map((o) => {
                                    const st = getStatutClass(o.is_paid);
                                    return (
                                        <tr key={o.id}>
                                            <td className="td-id">#{o.id}</td>
                                            <td className="td-name">{o.destinataire_name}</td>
                                            <td>{o.produit}</td>
                                            <td className="td-zone">{o.destination_zone}</td>
                                            <td className="td-price">{o.prix_marchandise} DH</td>
                                            <td>
                                                <span className={st.className} style={{ background: st.bg, color: st.color, border: st.border }}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="td-date">
                                                {new Date(o.updated_at).toLocaleDateString('fr-FR')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarchandPayments;