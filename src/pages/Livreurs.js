import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Livreurs.css';
import { Link } from "react-router-dom";

const Livreurs = () => {
    const [livreurs, setLivreurs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedLivreur, setSelectedLivreur] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    // 1. دالة مساعدة باش نجيبو التوكن والساروت ديال الـ API
    const getAuthConfig = () => {
        const token = localStorage.getItem("token");
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };
    useEffect(() => {
        const config = getAuthConfig();
        axios.get('http://127.0.0.1:8000/api/livreurs',config).then(res => setLivreurs(res.data));
        axios.get('http://127.0.0.1:8000/api/orders',config).then(res => setOrders(res.data));
    }, []);

  
const handleUpdatePayment = async (livreurId, status) => {
    try {
        const config = getAuthConfig();
        // 1. صيفط الطلب للـ API
        await axios.post(`http://127.0.0.1:8000/api/livreurs/${livreurId}/update-payment`, { status },config);
        
        alert("0 DH")

        // 2. تحديث قائمة الليفرورز كاملة باش يجيو البيانات الجداد من الـ DB
        const res = await axios.get('http://127.0.0.1:8000/api/livreurs',config);
        setLivreurs(res.data);

        // 3. تحديث الليفرور اللي مختار دابا (Selected) باش يبان 0 DH في الـ Card اللي على اليمين
        const updated = res.data.find(l => l.id === livreurId);
        setSelectedLivreur(updated);

    } catch (err) {
        console.error("Erreur:", err);
        alert("error");
    }
};
    const getRealStatus = (livreur) => {
        if (!livreur || orders.length === 0) return "Disponible";
        const hasActiveOrders = orders.some(order => 
            order.livreur_id === livreur.id && order.statut === "assigne"
        );
        return hasActiveOrders ? "Occupé" : "Disponible";
    };

//    const getRealStatus = (livreur) => {
//     if (!livreur) return "Disponible";
    
//     // أول حاجة كنشوفو واش ديزاكتيبي
//     if (livreur.is_active === 0 || livreur.is_active === false) {
//         return "Hors service";
//     }

//     if (orders.length === 0) return "Disponible";
    
//     const hasActiveOrders = orders.some(order => 
//         order.livreur_id === livreur.id && order.statut === "assigne"
//     );
    
//     return hasActiveOrders ? "Occupé" : "Disponible";
// };
    const filteredLivreurs = livreurs.filter(l => 
        l.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase())
    );
const calculateRating = (livreurId) => {
    // كنحسبو شحال من طلبية "livre"
    const completedOrders = orders.filter(order => 
        order.livreur_id === livreurId && order.statut === "livre"
    ).length;

    // المنطق ديالك: 2 طلبيات كيعطيو نجمة، 10 كيعطيو 2، إلخ...
    if (completedOrders >= 50) return 5;
    if (completedOrders >= 40) return 4;
    if (completedOrders >= 30) return 3;
    if (completedOrders >= 20) return 2;
    if (completedOrders >=10) return 1; // أمين عندو 4 يعني غاتعطيه 1 نجمة
    return 0;
};
    return (
        <div className="livreurs-page py-4">
            <div className="container-fluid">                
                <div className="row mb-4 px-3">
                    <div className="col-md-6">
                        <h2 className="fw-bold">Gestion des livreurs</h2>
                    </div>
                    <div className="col-md-6 d-flex gap-2 align-items-center justify-content-end">
                        <div className="search-wrapper-small">
                            <i className="bi bi-search search-icon-small"></i>
                            <input 
                                type="text" 
                                className="form-control search-input-small" 
                                placeholder="Rechercher un livreur..." 
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link className="btn btn-success btn-add-small" to="/AddLivreur">+ New Livreur</Link>
                    </div>
                </div>

                <div className="row g-4 px-3">
                    {/* القائمة اليسرى */}
                    <div className={selectedLivreur ? "col-md-8 transition-all" : "col-md-12 transition-all"}>
                        <div className="row g-3">
                            {filteredLivreurs.map(livreur => {
                                const currentStatus = getRealStatus(livreur);
                                return (
                                    <div className={selectedLivreur ? "col-12" : "col-md-3"} key={livreur.id}>
                                        <div 
                                            className={`livreur-card p-3 shadow-sm border-0 rounded-4 cursor-pointer position-relative ${selectedLivreur?.id === livreur.id ? 'border-primary-active' : ''}`}
                                            onClick={() => setSelectedLivreur(livreur)}
                                        >
                                            <div className="position-absolute top-0 end-0 m-2">
                                                <span className={`badge-status ${currentStatus === 'Disponible' ? 'delivered' : 'cancelled'}`}>
                                                    {currentStatus}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mt-1">
                                                <div className="avatar-mini me-3">{livreur.nom_complet?.charAt(0)}</div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{livreur.nom_complet}</h6>
                                                     <small className="text-muted">
                                                     <i className="bi bi-star-fill text-warning"></i> {calculateRating(livreur.id)}/5
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* قائمة التفاصيل اليمنى */}
                    {selectedLivreur && (
                        <div className="col-md-4 animate__animated animate__slideInRight">
                            <div className="card border-0 shadow-sm rounded-5 p-4 sticky-top" style={{ top: '20px' }}>
                                <button className="btn-close position-absolute top-0 end-0 m-4" onClick={() => setSelectedLivreur(null)}></button>                                 
                                <div className="text-center">
                                    <div className="large-avatar mb-3 mx-auto shadow-sm">
                                        <i className="bi bi-person-circle display-1 text-secondary"></i>
                                    </div>
                                    
                                    <h2 className="fw-bold">{selectedLivreur.nom_complet}</h2>
                                    <p className={`badge ${getRealStatus(selectedLivreur) === 'Disponible' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'} px-3`}>
                                        {getRealStatus(selectedLivreur)}
                                    </p>
                                                                         <div className="fs-4 text-warning">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i key={star} className={`bi bi-star${star <= calculateRating(selectedLivreur.id) ? '-fill' : ''}`}></i>
                                            ))}
                                        </div>
                                        <small className="text-muted">
                                            Basé sur {orders.filter(o => o.livreur_id === selectedLivreur.id && o.statut === "livre").length} livraisons
                                        </small>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-12 mb-2">
                                        
                                        <div className="p-3 bg-light rounded-4">
                                            <label className="text-muted small">Téléphone:</label>
                                            <div className="fw-bold">{selectedLivreur.telephone}</div>                         
                                            <label className="text-muted small">Zone:</label>
                                            <div className="fw-bold">{selectedLivreur.zone}</div>
                                        </div>
                                    </div>
                                    {/* قسم السولدي (Solde) */}
                                    <div className="col-md-12 mb-2">
                                        <div className="p-3 border rounded-4 bg-white shadow-sm text-center">
                                            <h6 className="fw-bold">Solde: {selectedLivreur.solde || 0} DH</h6>
                                            <div className="d-flex gap-2 mt-2">
                                                <button className="btn btn-success btn-sm w-100"  onClick={() => handleUpdatePayment(selectedLivreur.id, 'done')}>Payé</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Livreurs;