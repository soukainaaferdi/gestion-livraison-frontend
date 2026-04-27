import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MerchantAccount = () => {
  const { id } = useParams(); 
  const [orders, setOrders] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Récupérer les informations du client (assure-toi que la route existe)
        const resMerchant = await axios.get(`http://127.0.0.1:8000/api/clients/${id}`);
        setMerchant(resMerchant.data);

        // 2. Récupérer les commandes du client
        const resOrders = await axios.get(`http://127.0.0.1:8000/api/orders?client_id=${id}`);
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
  if (!merchant) return <div className="text-center mt-5 text-danger">Client introuvable</div>;

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-sm p-4 mb-4" style={{borderRadius: '15px'}}>
          <div className="d-flex justify-content-between align-items-center">
             <h3 className="fw-bold m-0 text-primary">📦 Commandes du client : {merchant.nom_complet || merchant.name}</h3>
             <span className="badge bg-primary fs-6 px-3 py-2" style={{borderRadius: '10px'}}>{orders.length} commandes</span>
          </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover bg-white shadow-sm" style={{borderRadius: '15px', overflow: 'hidden'}}>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Destinataire</th>
              <th>Produit</th>
              <th>Prix (DH)</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map(o => (
              <tr key={o.id}>
                <td className="text-muted">#{o.id}</td>
                <td className="fw-bold">{o.destinataire_name || "---"}</td>
                <td>{o.produit}</td>
                <td className="fw-bold text-success">{o.prix_total} DH</td>
                <td>
                  <span className={`badge ${
                    o.statut === 'livre' ? 'bg-success' : 
                    o.statut === 'annule' ? 'bg-danger' : 
                    o.statut === 'assigne' ? 'bg-info' : 'bg-warning text-dark'
                  }`}>
                      {o.statut} 
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