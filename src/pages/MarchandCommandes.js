import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/cammandmarchant.css';

const MarchandCommandes = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get("http://127.0.0.1:8000/api/marchand/commandes", config)
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const filteredOrders = orders.filter(order => {
        const searchTarget = (order.produit + " " + order.destination).toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.statut === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <div className="orders-container">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Mes Commandes</h2>
                    <Link className="btn btn-success shadow-sm" to="/marchand/add-order">
                        <i className="bi bi-plus-lg me-2"></i>Nouvelle Commande
                    </Link>
                </div>

                {/* Search + Filter */}
                <div className="row g-3 mb-4">
                    <div className="col-md-8">
                        <div className="search-wrapper">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder="Rechercher par produit ou destination..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="All">Tous les statuts</option>
                            <option value="en_attente">En attente</option>
                            <option value="assigne">Assigné</option>
                            <option value="livre">Livré</option>
                            <option value="retour">Retour</option>
                            <option value="annule">Annulé</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Destinataire</th>
                                <th>Produit</th>
                                <th>Zone</th>
                                <th>Prix</th>
                                <th>Statut</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4">Chargement...</td></tr>
                            ) : currentOrders.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-muted">Aucune commande trouvée.</td></tr>
                            ) : currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="fw-bold text-indigo">#{order.id}</td>
                                    <td>{order.destinataire_name}</td>
                                    <td>{order.produit}</td>
                                    <td className="text-muted">{order.destination_zone}</td>
                                    <td className="fw-bold">{order.prix_marchandise} DH</td>
                                    <td>
                                        <span className={`badge-status ${
                                            order.statut === 'livre' ? 'delivered' :
                                            order.statut === 'assigne' ? 'assigned' :
                                            order.statut === 'retour' ? 'bg-dark' :
                                            order.statut === 'annule' ? 'cancelled' : 'pending'
                                        }`}>
                                            {order.statut === 'livre' ? 'Livré' :
                                             order.statut === 'assigne' ? 'En cours' :
                                             order.statut === 'retour' ? 'Retour' :
                                             order.statut === 'annule' ? 'Annulé' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="text-muted" style={{ fontSize: '12px' }}>
                                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted small">
                            Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} commandes
                        </div>
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarchandCommandes;