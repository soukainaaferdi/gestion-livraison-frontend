import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Commandes.css';

const Commandes = () => {
    const [Orders, setOrders] = useState([]);
    const [Livreurs, setLivreurs] = useState([]);    
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    const API_BASE = "http://127.0.0.1:8000/api";

    useEffect(() => {
        // جلب الليفرورات والطلبيات من Laravel
        const fetchData = async () => {
            try {
                const resL = await axios.get(`${API_BASE}/livreurs`);
                setLivreurs(resL.data);
                
                const resO = await axios.get(`${API_BASE}/orders`);
                setOrders(resO.data);
            } catch (error) {
                console.error("Erreur fetching data:", error);
            }
        };
        fetchData();
    }, []);
const handleAssign = (orderId, livreurId) => {
    if (!livreurId) return;

    axios.patch(`${API_BASE}/orders/${orderId}`, { 
        livreur_id: livreurId, 
        statut: "assigne" 
    })
    .then(() => {
        // تحديث الطلبيات في الصفحة
        const updatedOrders = Orders.map(order => 
            order.id === orderId ? { ...order, livreur_id: livreurId, statut: "assigne" } : order
        );
        setOrders(updatedOrders);

        // 🔥 ضروري: عاودي جيبي الليفرورات باش اللي ولا "occupé" يختفي من القائمة
        axios.get(`${API_BASE}/livreurs`).then(res => setLivreurs(res.data));

        alert("Livreur assigné et occupé ! ✅");
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
                                    <td>{order.produit}</td>
                                    <td className="text-muted">{order.destination}</td>
                                    <td className="fw-bold">{order.prix_total} DH</td>
                                    <td>
                                        <span className={`badge-status ${
                                            order.statut === 'livre' ? 'delivered' : 
                                            order.statut === 'assigne' ? 'assigned' : 
                                            order.statut === 'annule' ? 'cancelled' : 'pending'
                                        }`}>
                                            {order.statut}
                                        </span>
                                    </td>
                                    <td>
                                   
<select 
    className="form-select form-select-sm select-livreur" 
    value={order.livreur_id || ""} 
    onChange={(e) => handleAssign(order.id, e.target.value)}
    disabled={order.statut === "livre" || order.statut === "annule"}
>
    <option value="">-- Choisir --</option>
    {Livreurs.map(l => (
        // كنزيدو هاد التوشية: كنخليو غير اللي disponible هوما اللي يبانو
        // أو نخليو اللي ديجا معطية ليه هاد الكوموند يبان وخا يكون occupé
        (l.est_disponible || l.id === order.livreur_id) && (
            <option key={l.id} value={l.id}>{l.nom_complet}</option>
        )
    ))}
</select>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn-action" data-bs-toggle="dropdown">⋮</button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                <li><button className="dropdown-item" disabled={order.statut === "livre"}><i className="bi bi-pencil me-2"></i> Modifier</button></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item text-danger"><i className="bi bi-trash me-2"></i> Delete</button></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* ... Pagination remains same ... */}
            </div>
        </div>
    );
}

export default Commandes;