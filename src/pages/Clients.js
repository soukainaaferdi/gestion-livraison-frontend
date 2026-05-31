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
    const getAuthConfig = () => {
        const token = localStorage.getItem("token");
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };
    // الرابط ديال Laravel API
    const API_URL = "http://127.0.0.1:8000/api";

    useEffect(() => {
        const fetchData = async () => {
            const config = getAuthConfig();
            try {
                const [resClients, resOrders] = await Promise.all([
                    axios.get(`${API_URL}/clients`, config),
                    axios.get(`${API_URL}/orders`, config)
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
    // كنزيدو تأكيد باش المستخدم ما يمسحش بالغلط
if (window.confirm("Êtes-vous sûr de vouloir supprimer ce marchand ?")) {
        axios.delete(`${API_URL}/clients/${id}`, getAuthConfig())
            .then(() => {
                // أهم خطوة: كنحيدو المارشان من الـ State بلا ما نضطرو نكاريجيو الصفحة
                setClients(prevClients => prevClients.filter(c => c.id !== id));
                
                // (إختياري) إيلا بغيتي تمسح حتى الـ orders اللي مرتبطين بيه من الـ state
                setOrders(prevOrders => prevOrders.filter(o => o.client_id !== id));
                
                alert("Marchand supprimé avec succès");
            })
            .catch(err => {
                console.error("Erreur suppression:", err);
                 alert("Ce marchand est lié à des commandes, impossible de le supprimer.");
            });
    }
};

    // حساب الديون بناءً على سّميات Laravel (prix_total, client_id, statut)
   // الكود الجديد (الصحيح)
const calculateDebt = (clientId) => {
    return orders
        .filter(o => o.client_id === clientId && o.statut === "livre" && !o.is_paid)
        .reduce((sum, o) => sum + Number(o.prix_marchandise), 0); // ✅ دابا كيجمع غير ثمن السلعة
};


   const handleQuickPay = async (clientId) => {
    const amount = calculateDebt(clientId);
    
    if (amount === 0) return alert("Ce marchand n'a aucun montant dû");

   if (window.confirm(`Confirmer le paiement de ${amount} DH pour ce marchand ?`)) {
        const config = getAuthConfig();
        try {
            // كنعطيو الـ ID ديال المارشان اللي بركنا على البوطون ديالو
            await axios.post(`${API_URL}/clients/${clientId}/settle`,{},config);
            
            alert("Paiement enregistré avec succès");
            
            // كنعاودو نجيبو Orders باش يتحدث الصولد في الشاشة ويبان 0 DH
            const resOrders = await axios.get(`${API_URL}/orders`,config );
            setOrders(resOrders.data);
            
        } catch (err) {
            console.error("Erreur detail:", err);
            alert("Une erreur s'est produite lors de la mise à jour");
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
                    <Link to="/AddMarchand" className="btn btn-success fw-bold px-4">+ Nouveau Marchand</Link>
                </div>

                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-3">ID</th>
                            <th>Nom du Marchand</th>
                            <th>Téléphone</th>
                            <th className="text-center">Solde à  Régler </th>
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
                                          Régler 
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <div className="dropdown">
                                            <button className="btn btn-light btn-sm" data-bs-toggle="dropdown">⋮</button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                <li>
                                                    <Link to={`/client-account/${client.id}`} className="dropdown-item text-info">
                                                         Voir Détails  
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDeleteClient(client.id)}>
                                                        Supprimer 
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