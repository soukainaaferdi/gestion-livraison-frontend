import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import '../styles/Historique.css';

const History = () => {
    const [historyOrders, setHistoryOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState("");
     const [statusFilter, setStatusFilter] = useState("all");
    useEffect(() => {
        if (!user || !token) return;

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        axios.get(`http://127.0.0.1:8000/api/my-orders/${user.id}`, config)
            .then(res => {
                // ⚠️ تصفية: عرض فقط الطلبيات المنتهية
                const finished = res.data.filter(order => 
                    ["livre", "annule", "retour"].includes(order.statut)
                );
                setHistoryOrders(finished);
            });
    }, [user?.id, token]);
    const filtered = historyOrders.filter(order => {
    const matchSearch = order.produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || order.statut === statusFilter;
    return matchSearch && matchStatus;
});
    return (
        <div className="missions-page-wrapper">
                <header className="livreur-header">
                <h3 className="logo-text">LIVRIHA</h3>
                <span className="user-email-display">{user.email}</span>
            </header>
            
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center',  }}>
    {/* Search - sghira */}
    <input
        type="text"
        placeholder=" Rechercher..."
        className="form-control"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
            borderRadius: '50px',
            border: '1.5px solid #c7d2fe',
            padding: '6px 14px',
            fontSize: '0.82rem',
            width: '500px',
            boxShadow: 'none'
        }}
    />

    {/* Filter buttons — nfs str */}
    {[
        { val: 'all', label: 'Tous', bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
        { val: 'livre', label: ' Livré', bg: '#ecfdf5', color: '#059669', border: '#6ee7b7' },
        { val: 'annule', label: ' Annulé', bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
        { val: 'retour', label: ' Retour', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
    ].map(btn => (
        <button
            key={btn.val}
            onClick={() => setStatusFilter(btn.val)}
            style={{
                background: statusFilter === btn.val ? btn.color : btn.bg,
                color: statusFilter === btn.val ? '#ffffff' : btn.color,
                border: `1.5px solid ${btn.border}`,
                borderRadius: '50px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
            }}
        >
            {btn.label}
        </button>
    ))}
</div><div className="cards-container">
    <div className="row g-3">
        
   
                
                    {filtered.map(order => (

                      <div className="col-lg-4 col-md-6" key={order.id}>
    <div className="mission-card">
                              <span className="info-text fw-bold" style={{
                                  color: order.statut === 'livre' ? '#198754' : 
                                                   order.statut === 'annule' ? '#dc3545' : '#7c3aed'
                                        }}>
                                           <span className={`statut-badge ${order.statut}`}>
                                                    {order.statut}
                                                </span>
                                        </span>
                                                                         <div className="mt-3">
                                        <p><strong>Nom:</strong>{order.destinataire_name}</p>
                                        <h5 className="product-name"><strong>Produit: </strong>{order.produit}</h5>
                                        <div >
                                            <p><strong>Zone:</strong>{order.destination_zone}</p>
                                            <p><strong>Destination: </strong> {order.destination}</p>
                                        </div>
                                        <p className="price-tag"><strong>Prix:</strong> {order.prix_total} DH</p>
                                    </div>





                                
                                    <span className="history-date">
                                            Terminée le: {new Date(order.updated_at).toLocaleDateString()}
                                        </span>
                            </div>
                        
                                  </div>
                              
                                                                
                    ))}
                </div>
                </div>
                </div>
            
        
    );
};
export default History;