import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        produit: "",
        destination: "",
        prix_total: "",
        destinataire_name: "" // زدتها حيت مهمة فالتعديل
    });

    const API_BASE = "http://127.0.0.1:8000/api";
     // دالة مساعدة لجلب التوكن من localStorage
    const getAuthConfig = () => {
        const token = localStorage.getItem("token");
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };
    useEffect(() => {
        axios.get(`${API_BASE}/orders/${id}`, getAuthConfig())
            .then(res => {
                // كناخدو غير الحقول اللي مسموح بتعديلها
                const { produit, destination, prix_total, destinataire_name } = res.data;
                setFormData({ produit, destination, prix_total, destinataire_name });
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // كانديرو التعديل غير على الحقول الأساسية
            await axios.patch(`${API_BASE}/orders/${id}`, formData, getAuthConfig());
            alert("Informations mises à jour !");
            navigate("/Commandes");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la modification");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                <h2 className="fw-bold mb-4">Modifier la Commande #{id}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Nom du Destinataire</label>
                            <input type="text" name="destinataire_name" className="form-control" 
                                   value={formData.destinataire_name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Produit</label>
                            <input type="text" name="produit" className="form-control" 
                                   value={formData.produit} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Adresse de Destination</label>
                        <input type="text" name="destination" className="form-control" 
                               value={formData.destination} onChange={handleChange} required />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Prix Total (DH)</label>
                        <input type="number" name="prix_total" className="form-control" 
                               value={formData.prix_total} onChange={handleChange} required />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">
                            Enregistrer
                        </button>
                        <button type="button" className="btn btn-light px-4" onClick={() => navigate("/Commandes")}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrder;