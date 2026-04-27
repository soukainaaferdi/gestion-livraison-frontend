import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import '../styles/MyMissions.css';

const MyMissions = () => {
    const [myOrders, setMyOrders] = useState([]);
    // كنجيبو المعلومات ديال الليفرور اللي داخل دابا
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchMissions = useCallback(() => {
        // كنصيفطو طلب لـ Laravel باش يعطينا غير الطلبيات ديال هاد الليفرور
        // ملاحظة: خاصك تصاوب هاد الـ Route في Laravel (api/my-orders/{id})
        axios.get(`http://127.0.0.1:8000/api/my-orders/${user.id}`)
            .then(res => {
                setMyOrders(res.data);
            })
            .catch(err => console.error("Erreur missions:", err));
    }, [user.id]);

    useEffect(() => {
        if (user) fetchMissions();
    }, [fetchMissions, user]);

    const updateStatut = (orderId, newStatut) => {
        // تحديث حالة الطلبية في Laravel
        axios.patch(`http://127.0.0.1:8000/api/orders/${orderId}/status`, { 
            statut: newStatut,
            livreur_id: user.id 
        })
        .then(() => {
            alert(`Statut mis à jour : ${newStatut} ✅`);
            fetchMissions(); // إعادة جلب البيانات
        })
        .catch(err => console.error("Erreur update:", err));
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 shadow-sm" style={{borderRadius: '12px', background: '#7e13c1'}}>
                <h3 className="mb-0 fw-bold" style={{ color: '#9bf338' }}>LIVRIHA</h3>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white small d-none d-md-block">{user.email}</span>
                    <button className="btn btn-sm btn-light fw-bold" onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </div>

            <h3 className="mb-4 fw-bold">📦 Mes Missions</h3>
            
            <div className="row">
                {myOrders.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted">Aucune mission pour le moment. </p>
                    </div>
                ) : (
                    myOrders.map(order => (
                        <div className="col-md-6 mb-3" key={order.id}>
                            <div className="card shadow-sm border-0 p-3" style={{ borderRadius: '15px' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge bg-dark">Order #{order.id}</span>
                                    <span className={`badge ${
                                        order.statut === 'Livré' ? 'bg-success' : 
                                        order.statut === 'Annulé' ? 'bg-danger' : 'bg-warning text-dark'
                                    }`}>
                                        {order.statut}
                                    </span>
                                </div>

                              <div className="mt-3">
   <h5><strong>{order.produit}</strong></h5>
<p className="text-muted mb-1 small">📍 {order.destination}</p>
<p className="fw-bold text-primary mb-0">{order.prix_total} DH</p>
</div>

                                {order.statut === 'assigne' && (
                                    <>
                                        <hr />
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success flex-grow-1 fw-bold" onClick={() => updateStatut(order.id, "Livré")}>
                                                Livré ✅
                                            </button>
                                            <button className="btn btn-outline-danger flex-grow-1 fw-bold" onClick={() => updateStatut(order.id, "Annulé")}>
                                                Annulé ❌
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyMissions;