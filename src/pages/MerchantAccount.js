import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/MerchantAccount.css';
const MerchantAccount = () => {
  const { id } = useParams(); 
  const [orders, setOrders] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  // دالة مساعدة لجلب التوكن
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = getAuthConfig();
        // 1. Récupérer les informations du client (assure-toi que la route existe)
        const resMerchant = await axios.get(`http://127.0.0.1:8000/api/clients/${id}`, config);
        setMerchant(resMerchant.data);

        // 2. Récupérer les commandes du client
        const resOrders = await axios.get(`http://127.0.0.1:8000/api/orders?client_id=${id}`, config);
        setOrders(resOrders.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching merchant details:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-4">
     

      <div className="table-responsive">
       <table className="table table-hover merchant-table">
          <thead className="table-dark">
               <tr>
                <th colSpan="7" className="py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Commandes du Marchand : {merchant.nom_complet || merchant.name}</span>
                        <span className="orders-count-badge">{orders.length} commandes</span>
                    </div>
                </th>
            </tr>
            <tr style={{ background: '#334155' }}>
              <th>ID</th>
              <th>Destinataire</th>
              <th>Adresse</th>
              <th>Produit</th>
              <th>Prix  </th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map(o => (
              <tr key={o.id}>
                <td className="text-muted">#{o.id}</td>
                <td className="fw-bold">{o.destinataire_name}</td>
                <td >{o.destination || "---"}</td>
                <td>{o.produit}</td>
                <td className="fw-bold text-success">{o.prix_marchandise} DH</td>
                <td>
                 <span className={`statut-badge ${o.statut}`}>
    {o.statut === 'livre' ? 'Livré' :
     o.statut === 'assigne' ? 'Assigné' :
     o.statut === 'en_attente' ? 'En attente' :
     o.statut === 'retour' ? 'Retour' :
     'Annulé'}
</span>
                </td>
                <td className="small text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">Aucune commande enregistrée pour ce client.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantAccount;