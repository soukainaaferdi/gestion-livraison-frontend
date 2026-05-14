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
            
            <div className="content-padding">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
    <input
        type="text"
        placeholder="Rechercher produit / destination..."
        className="form-control"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select
        className="form-select"
        style={{ width: '160px' }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
    >
        <option value="all">Tous</option>
        <option value="livre">Livré</option>
        <option value="annule">Annulé</option>
        <option value="retour">Retour</option>
    </select>
</div>
                <div className="row g-3 ">
                    {filtered.map(order => (

                       <div className="col-lg-4 col-md-6 mission-card" key={order.id}>
                                  
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
                        
                    ))}
                </div>
            </div>
        </div>
    );
};
export default History;