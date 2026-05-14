import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Commandes.css';

const Commandes = () => {
    const [Orders, setOrders] = useState([]);
    const [allLivreurs, setAllLivreurs] = useState([]);
    const [Livreurs, setLivreurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    const API_BASE = "http://127.0.0.1:8000/api";
    const getAuthConfig = () => {
        //kanjibo token mn localstorage
        const token = localStorage.getItem("token");
        //kansyfto token l backend bach  i3rf chkon hwa l user li connecte
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };
    //supprimer cammande
    const handleDelete = async (orderId) => {
        //katswl l user wach bghiti nit tmsa7 had l cammande
        if (window.confirm("Etes-vous sur de vouloir supprimer cette commande ?")) {
            try {
                //katsyft talab dyal delete l api 
                await axios.delete(`${API_BASE}/orders/${orderId}`, getAuthConfig());
                // kathyd  cammande mn page bla refresh ou kanrj3o ghir les cammand li 3ndhom id mkhtalf 
                setOrders(Orders.filter(order => order.id !== orderId));
                alert("Commande supprimee !");
            } catch (error) {
                console.error("Erreur delete:", error);
                alert("Erreur lors de la suppression");
            }
        }
    };
    useEffect(() => {
        // fetchData bach njibo les donnees
        const fetchData = async () => {
            try {
                const config = getAuthConfig();
                // hna kanjibo ka3 les livreur li 3ndna 
                const resL = await axios.get(`${API_BASE}/livreurs`, config);
                setAllLivreurs(resL.data); // kankhznohom f state 
               // kanjibo les cammandes
                const resO = await axios.get(`${API_BASE}/orders`, config);
                setOrders(resO.data);
            } catch (error) {
                console.error("Erreur fetching data:", error);
            }
        };
        fetchData();
    }, []);//<-- bach useEffect tnafad mra wahda sfee
    const [livreursByZone, setLivreursByZone] = useState({});//kaytkhzno les livreur f object hasab la zone dyalhom
    const fetchLivreursForOrder = async (orderId) => {
        try {
            const res = await axios.get(`${API_BASE}/orders/${orderId}/available-livreurs`, getAuthConfig());
            // كنخزنو الليفرورات ديال كل كوموند بوحدها
            setLivreursByZone(prev => ({ ...prev, [orderId]: res.data }));
        } catch (error) {
            console.error("Error filtering livreurs:", error);
        }
    };
    const handleAssign = (orderId, livreurId) => {
        if (!livreurId) return;

        axios.patch(`${API_BASE}/orders/${orderId}`, {
            livreur_id: livreurId,
            statut: "assigne"
        }, getAuthConfig())
            .then(() => {
                // تحديث الطلبيات في الصفحة
                const updatedOrders = Orders.map(order =>
                    order.id === orderId ? { ...order, livreur_id: livreurId, statut: "assigne" } : order
                );
                setOrders(updatedOrders);

                //  ضروري: عاودي جيبي الليفرورات باش اللي ولا "occupé" يختفي من القائمة
                axios.get(`${API_BASE}/livreurs`, getAuthConfig()).then(res => setLivreurs(res.data));

                alert("Livreur assigné et occupé ! ");
            })
            .catch(error => console.log(error));
    };

    const filteredOrders = Orders.filter(order => {
        // البحث باستعمال الحقول الجديدة
        const searchTarget = (order.produit + " " + order.destination).toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.statut === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    // زيدها فوق الـ return في Commandes.js
    const getRealStatus = (livreur) => {
        const hasActiveOrders = Orders.some(order =>
            order.livreur_id === livreur.id && order.statut === "assigne"
        );
        return hasActiveOrders ? "Occupé" : "Disponible";
    };
    return (
        <div className="orders-container">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Orders Management</h2>
                    <Link className="btn btn-success shadow-sm" to="/AddOrders">
                        <i className="bi bi-plus-lg me-2"></i>New Order
                    </Link>
                </div>

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
                            <option value="annule">Annulé</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Nom</th>
                                <th>Produit</th>
                                <th>Destination</th>
                                <th>Prix Total</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="fw-bold text-indigo">#{order.id}</td>
                                    <td>{order.destinataire_name}</td>
                                    <td>{order.produit}</td>
                                    <td className="text-muted">{order.destination}</td>
                                    <td className="fw-bold">{order.prix_total} DH</td>
                                    <td>
                                        <span className={`badge-status ${order.statut === 'livre' ? 'delivered' :
                                                order.statut === 'assigne' ? 'assigned' :
                                                    order.statut === 'retour' ? 'bg-dark' :
                                                        order.statut === 'annule' ? 'cancelled' : 'pending'
                                            }`}>
                                            {order.statut}
                                        </span>
                                    </td>
                                    <td>

                                        <select
                                            className="form-select form-select-sm select-livreur"
                                            value={order.livreur_id || ""}
                                            // 🌟 ملي الأدمين يكليكي باش يختار، كنجيبو غير اللي في المنطقة
                                            onFocus={() => fetchLivreursForOrder(order.id)}
                                            onChange={(e) => handleAssign(order.id, e.target.value)}
                                            disabled={order.statut === "livre" || order.statut === "annule"}
                                        >
                                            <option value="">-- Choisir --</option>

                                            {(livreursByZone[order.id] || allLivreurs.filter(l => l.id === order.livreur_id)).map(l => (
                                                <option key={l.id} value={l.id}>
                                                    {l.nom_complet} — {getRealStatus(l) === 'Occupé' ? ' Occupé' : ' Disponible'}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn-action" data-bs-toggle="dropdown">⋮</button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                <li>
                                                    {/* 🌟 تعديل زر Modifier باش يصيفطك لصفحة التعديل */}
                                                    <Link
                                                        className={`dropdown-item ${order.statut === "livre" ? "disabled" : ""}`}
                                                        to={`/EditOrder/${order.id}`}
                                                    >
                                                        <i className="bi bi-pencil me-2"></i> Modifier
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    {/* 🌟 ربط زر Delete مع الدالة اللي صوبنا */}
                                                    <button
                                                        className="dropdown-item text-danger"
                                                        onClick={() => handleDelete(order.id)}
                                                    >
                                                        <i className="bi bi-trash me-2"></i> Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* ... Pagination remains same ... */}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted small">
                            Affichage de {indexOfFirstOrder + 1} à {Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} commandes
                        </div>
                        <nav>
                            <ul className="pagination mb-0">
                                {/* زر الرجوع */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>

                                {/* أرقام الصفحات */}
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                {/* زر التالي */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    >
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
}

export default Commandes;