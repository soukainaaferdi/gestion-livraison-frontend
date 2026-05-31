import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMarchand = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        adresse: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        axios.post("http://127.0.0.1:8000/api/clients", formData, config)
            .then(() => {
                alert("Marchand ajouté avec succès");
                navigate("/Clients");
            })
            .catch(err => {
                console.error(err);
                alert("Erreur lors de l'ajout");
            });
    };

    return (
        <div className="container" style={{ marginTop: '80px' }}>
            <div className="card shadow p-4" style={{ maxWidth: '500px', margin: 'auto', borderRadius: '15px' }}>
                <h3 className="fw-bold mb-4">Ajouter un nouveau Marchand</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nom du Marchand</label>
                        <input type="text" className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Téléphone</label>
                        <input type="text" className="form-control"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Adresse</label>
                        <input type="text" className="form-control"
                            value={formData.adresse}
                            onChange={(e) => setFormData({...formData, adresse: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mot de passe</label>
                        <input type="password" className="form-control"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">
                        Créer le compte
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMarchand;