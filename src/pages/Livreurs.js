import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Livreurs.css';
import { Link } from "react-router-dom";

const Livreurs = () => {
    const [livreurs, setLivreurs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedLivreur, setSelectedLivreur] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
    // 1. جيب الليفرور
    axios.get('http://127.0.0.1:8000/api/livreurs').then(res => setLivreurs(res.data));
    
    // 2. جيب الطلبيات (ضروري باش تحسب واش Occupé)
    axios.get('http://127.0.0.1:8000/api/orders').then(res => setOrders(res.data));
}, []);

const getRealStatus = (livreur) => {
    if (!livreur || orders.length === 0) return "Disponible";
    
    // تأكد بلي السمية في Laravel هي 'assigned'
    const hasActiveOrders = orders.some(order => 
        order.livreur_id === livreur.id && 
        order.status === "assigne" // تأكد من الـ S لي درتي في Laravel (status ولا statut)
    );
    return hasActiveOrders ? "Occupé" : "Disponible";
};

    // التصفية باستعمال nom_complet
    const filteredLivreurs = livreurs.filter(l => 
        l.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="livreurs-page py-4">
            <div className="container-fluid">               
                <div className="row mb-4 px-3">
                    <div className="col-md-6">
                        <h2 className="fw-bold">Nos Livreurs</h2>
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
                        <Link className="btn btn-success btn-add-small" to="/AddLivreur">
                           + New Livreur
                        </Link>
                    </div>
                </div>

                <div className="row g-4 px-3">
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
                                                <div className="position-relative">
                                                    <div className="avatar-mini me-3">{livreur.nom_complet?.charAt(0)}</div>
                                                    <span className={`status-indicator ${currentStatus === 'Disponible' ? 'disponible' : 'En-route'}`}></span>
                                                </div>                                               
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{livreur.nom_complet}</h6>
                                                    <small className="text-muted" style={{fontSize: '0.75rem'}}>
                                                        <i className="bi bi-bicycle me-1"></i>
                                                        {livreur.vehicle || "Moto"}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedLivreur && (
                        <div className="col-md-4 animate__animated animate__slideInRight">
                            <div className="card border-0 shadow-sm rounded-5 p-5 sticky-top" style={{ top: '20px' }}>
                                <button 
                                    className="btn-close position-absolute top-0 end-0 m-4" 
                                    onClick={() => setSelectedLivreur(null)}
                                ></button>                                 
                                <div className="text-center">
                                    <div className="large-avatar mb-3 mx-auto shadow-sm">
                                        <i className="bi bi-person-circle display-1 text-secondary"></i>
                                    </div>
                                    <h2 className="fw-bold">{selectedLivreur.nom_complet}</h2>
                                    <p className={`badge ${getRealStatus(selectedLivreur) === 'Disponible' ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'} px-3`}>
                                        {getRealStatus(selectedLivreur)}
                                    </p>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-md-12 mb-3">
                                        <div className="p-3 bg-light rounded-4">
                                            <label className="text-muted small">Téléphone</label>
                                            <div className="fw-bold">{selectedLivreur.telephone}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <div className="p-3 bg-light rounded-4">
                                            <label className="text-muted small">ID Livreur</label>
                                            <div className="fw-bold">#{selectedLivreur.id}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <div className="p-3 bg-light rounded-4">
                                            <label className="text-muted small">Véhicule</label>
                                            <div className="fw-bold">{selectedLivreur.vehicle || "Moto"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 mt-4">
                                    <button className="btn btn-outline-danger px-4 rounded-4 w-100">Désactiver</button>
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