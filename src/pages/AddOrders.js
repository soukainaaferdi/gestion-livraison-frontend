import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AddOrders.css';

const AddOrders = () => {
    const [marchands, setMarchands] = useState([]);
    const [formData, setFormData] = useState({
        client_id: "",
        destinataire_name: "",
        destinataire_phone: "",
        destination: "",
        produit: "",
        prix_marchandise: "",
        frais_livraison: 30
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/clients")
            .then(res => setMarchands(res.data))
            .catch(err => console.error("Error fetching marchands:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const total = Number(formData.prix_marchandise) + Number(formData.frais_livraison);
        
        const newOrder = {
            client_id: formData.client_id,
            destinataire_name: formData.destinataire_name,
            destinataire_phone: formData.destinataire_phone,
            destination: formData.destination,
            produit: formData.produit,
            prix_total: total,
            statut: "en_attente",
            is_paid: false
        };

        try {
            await axios.post("http://127.0.0.1:8000/api/orders", newOrder);
            alert("Commande enregistrée avec succès !");
            navigate("/Orders");
        } catch (err) {
            console.log("Validation Errors:", err.response?.data?.errors);
            alert("Errors: " + JSON.stringify(err.response?.data?.errors));
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4 border-0" style={{borderRadius: '15px'}}>
                <h3 className="fw-bold text-primary mb-4">📦 Ajouter une nouvelle commande</h3>
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-4 p-3 bg-light" style={{borderRadius: '10px'}}>
                        <label className="fw-bold mb-2">Choisir le vendeur</label>
                        <select 
                            name="client_id"
                            className="form-select" 
                            value={formData.client_id} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">-- Choisir dans la liste --</option>
                            {marchands.map(m => (
                                <option key={m.id} value={m.id}>{m.nom_complet || m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Nom du destinataire (client)</label>
                            <input type="text" name="destinataire_name" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Téléphone du destinataire</label>
                            <input type="text" name="destinataire_phone" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Produit / Marchandise</label>
                        <input type="text" name="produit" className="form-control" onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="fw-bold">Prix de la marchandise (DH)</label>
                            <input type="number" name="prix_marchandise" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="fw-bold">Frais de livraison</label>
                            <input type="number" name="frais_livraison" className="form-control" value={formData.frais_livraison} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="fw-bold">Ville</label>
                            <input type="text" name="destination" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Valider la commande</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrders;