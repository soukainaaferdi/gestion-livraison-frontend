import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/Clients.css'; 
import { FiSearch } from 'react-icons/fi';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // الرابط ديال Laravel API
    const API_URL = "http://127.0.0.1:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resClients, resOrders] = await Promise.all([
                    axios.get(`${API_URL}/clients`),
                    axios.get(`${API_URL}/orders`)
                ]);
                setClients(resClients.data);
                setOrders(resOrders.data);
                setLoading(false);
            } catch (err) {
                console.error("Erreur Fetching Data:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteClient = (id) => {
        if (window.confirm("واش متأكد بغيتي تمسح هاد مول السلعة؟")) {
            axios.delete(`${API_URL}/clients/${id}`)
                .then(() => {
                    setClients(clients.filter(c => c.id !== id));
                    alert("تم الحذف بنجاح ✅");
                })
                .catch(err => console.error("Erreur suppression:", err));
        }
    };

    // حساب الديون بناءً على سّميات Laravel (prix_total, client_id, statut)
    const calculateDebt = (clientId) => {
        return orders
            .filter(o => o.client_id === clientId && o.statut === "livre" && !o.is_paid)
            .reduce((sum, o) => sum + Number(o.prix_total), 0);
    };

    const handleQuickPay = async (clientId) => {
        const amount = calculateDebt(clientId);
        if (amount === 0) return alert("هذا التاجر ليس لديه مبالغ مستحقة");

        if (window.confirm(`هل تؤكد دفع مبلغ ${amount} DH للتاجر؟`)) {
            try {
                const clientOrders = orders.filter(o => o.client_id === clientId && o.statut === "livre" && !o.is_paid);
                const promises = clientOrders.map(o => 
                    axios.patch(`${API_URL}/orders/${o.id}`, { is_paid: true })
                );
                await Promise.all(promises);
                alert("تم تسجيل الدفع بنجاح ✅");
                
                // تحديث البيانات من السيرفر
                const resOrders = await axios.get(`${API_URL}/orders`);
                setOrders(resOrders.data);
            } catch (err) {
                alert("حدث خطأ أثناء التحديث");
            }
        }
    };

    // البحث باستعمال nom_complet و telephone
    const filteredClients = clients.filter(client => 
        client.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone?.includes(searchTerm)
    );

    return (
        <div className="clients-container mt-4">
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                <div className="header-section d-flex justify-content-between align-items-center mb-4 p-3">
                    <h2 className="fw-bold mb-0">Gestion des Marchands</h2>
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="      Rechercher..." 
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link to="/AddMarchand" className="btn btn-primary fw-bold px-4">+ Nouveau</Link>
                </div>

                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-3">ID</th>
                            <th>Nom du Marchand</th>
                            <th>Téléphone</th>
                            <th className="text-center">Solde à Payer</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-4">Chargement...</td></tr>
                        ) : filteredClients.map(client => {
                            const debt = calculateDebt(client.id);
                            return (
                                <tr key={client.id}>
                                    <td className="ps-3 fw-bold text-muted">#{client.id}</td>
                                    <td>
                                        <span className="fw-bold text-dark">{client.nom_complet}</span>
                                    </td>
                                    <td>{client.telephone}</td>
                                    <td className="text-center">
                                        <span className={`fw-bold ${debt > 0 ? 'text-danger' : 'text-success'}`}>
                                            {debt} DH     
                                        </span> 
                                        <button 
                                            className="btn btn-sm btn-success ms-2" 
                                            disabled={debt === 0}
                                            onClick={() => handleQuickPay(client.id)}
                                        >
                                            Payer
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <div className="dropdown">
                                            <button className="btn btn-light btn-sm" data-bs-toggle="dropdown">⋮</button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                <li>
                                                    <Link to={`/client-account/${client.id}`} className="dropdown-item text-info">
                                                        VOIR DÉTAILS
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDeleteClient(client.id)}>
                                                        SUPPRIMER
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;