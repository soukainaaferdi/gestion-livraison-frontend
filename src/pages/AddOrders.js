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
        destination: "", // العنوان الكامل
        destination_zone: "", // المنطقة للفلترة (مثلا: Ain Sebaa)
        produit: "",
        prix_marchandise: "",
        frais_livraison: "",
        priority: 1 // الافتراضي هو عادي
    });
    
    const navigate = useNavigate();
    const getAuthConfig = () => {
        const token = localStorage.getItem("token");
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/clients",getAuthConfig())
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
            ...formData, // صيفطنا كاع الداتا اللي في formData
            prix_total: total,
            statut: "en_attente",
            is_paid: false
        };

        try {
            await axios.post("http://127.0.0.1:8000/api/orders", newOrder,getAuthConfig());
            // alert("Commande enregistrée avec succès ! ");
            navigate("/Orders");
        } catch (err) {
            console.log("Validation Errors:", err.response?.data?.errors);
            alert("Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4 border-0" style={{borderRadius: '15px'}}>
                <h3 className="fw-bold text-center mb-4">Ajouter une nouvelle commande</h3>
                <form onSubmit={handleSubmit}>
                    
                    {/* Choisir le vendeur */}
                    <div className="mb-4 p-3 " style={{borderRadius: '10px'}}>
                        <label className="fw-bold mb-2">Choisir le Marchand</label>
                        <select name="client_id" className="form-select" value={formData.client_id} onChange={handleChange} required>
                            <option value="">-- Choisir dans la liste --</option>
                            {marchands.map(m => (
                                <option key={m.id} value={m.id}>{m.nom_complet || m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Nom du destinataire</label>
                            <input type="text" name="destinataire_name" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Téléphone du destinataire</label>
                            <input type="text" name="destinataire_phone" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold">Produit </label>
                        <input type="text" name="produit" className="form-control" onChange={handleChange} required />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
    <label className="fw-bold">Zone de livraison</label>
    <input type="text" name="destination_zone" className="form-control"
        placeholder="Ex: Ain Sebaa, Maarif..."
        onChange={handleChange} required />
</div>
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Priorité</label>
                            <select name="priority" className="form-select" onChange={handleChange}>
                                <option value="1" className="normal"> Normal</option>
                                <option value="2">Important</option>
                                <option value="3"> Urgent</option>
                            </select>
                        </div>
                    </div>
                          <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Prix marchandise DH</label>
                            <input type="number" name="prix_marchandise" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Frais de livraison </label>
                            <input type="number" name="frais_livraison" className="form-control" onChange={handleChange} required />
                        </div>
                        </div>
                    <div className="mb-3">
                        <label className="fw-bold">Adresse exacte</label>
                        <input type="text" name="destination" className="form-control" placeholder="Ex: Casablanca, Rue 123, Ain Sebaa" onChange={handleChange} required />
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Ajouter</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrders;