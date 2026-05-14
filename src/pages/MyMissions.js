import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import '../styles/MyMissions.css';

const MyMissions = () => {
    const [myOrders, setMyOrders] = useState([]);
    // جلب معلومات المستخدم والتوكن من localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token")
    // دالة مساعدة لجلب الـ Headers
    const getAuthConfig = useCallback(() => {
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    }, [token]);
    const fetchMissions = useCallback(() => {
        axios.get(`http://127.0.0.1:8000/api/my-orders/${user.id}`, getAuthConfig())
              .then(res => {
                // ⚠️ تصفية: عرض فقط الطلبيات التي لم تكتمل بعد
                const pending = res.data.filter(order => order.statut === "assigne");
                setMyOrders(pending);
            });
    }, [user.id]);
    useEffect(() => {
        if (user) fetchMissions();
    }, [fetchMissions, user]);

    const updateStatut = (orderId, newStatut) => {
        axios.patch(`http://127.0.0.1:8000/api/orders/${orderId}/status`, { 
            statut: newStatut,
            livreur_id: user.id 
        },getAuthConfig())
        .then(() => {
            alert(`Statut mis à jour : ${newStatut} `);
            fetchMissions();
        })
        .catch(err => {
    console.error("Erreur update:", err.response?.data);
    alert("Erreur: " + JSON.stringify(err.response?.data));
})
    };
    return (
        <div className="missions-page-wrapper">
            {/* Header لاصق الفوق بدون فراغات */}
            <header className="livreur-header">
                <h3 className="logo-text">LIVRIHA</h3>
                <span className="user-email-display">{user.email}</span>
            </header>

            <div className="content-padding">
                {/* <h4 className="section-title">Mes Missions</h4> */}
                
                <div className="row">
                    {myOrders.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">Aucune mission pour le moment.</p>
                        </div>
                    ) : (
                        myOrders.map(order => (
                            <div className="col-4 mb-3" key={order.id}>
                                <div className="mission-card shadow-sm">
                                    <div className="card-top-info">
                                        {/* Priority: لون الخط فقط */}
                                       {/* Priority badge - بدل style={{ color: ... }} */}
                                        <span className={`info-text ${
                                            order.priority === 3 ? 'priority-urgent' : 
                                            order.priority === 2 ? 'priority-important' : 
                                            'priority-normal'
                                        }`}>
                                            {order.priority === 3 ? 'Urgent' : order.priority === 2 ? 'Important' : 'Normal'}
                                        </span>
                                        
                                        
                                    
                                    </div>

                                    <div className="mt-3">
                                            <p><strong>Nom:</strong>{order.destinataire_name}</p>
                                        <h5 className="product-name"><strong>Produit: </strong>{order.produit}</h5>
                                        <div >
                                            <p><strong>Zone:</strong>{order.destination_zone}</p>
                                            <p><strong>Destination: </strong> {order.destination}</p>
                                        </div>
                                        <p className="price-tag"><strong>Prix:</strong> {order.prix_total} DH</p>
                                    </div>

                                    {order.statut === 'assigne' && (
                                        <div className="action-buttons-grid mt-3">
                                            <button className="btn-outline-custom success" onClick={() => updateStatut(order.id, "livre")}>Livré</button>
                                            <button className="btn-outline-custom secondary" onClick={() => updateStatut(order.id, "retour")}>Retour</button>
                                            <button className="btn-outline-custom danger" onClick={() => updateStatut(order.id, "annule")}>Annulé</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyMissions;