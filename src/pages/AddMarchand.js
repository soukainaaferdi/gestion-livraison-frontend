import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMarchand = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [adresse, setAdresse] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const newMarchand = { name, phone, adresse };

        axios.post("http://127.0.0.1:8000/api/clients", newMarchand, config)
            .then(() => {
                alert("Vendeur ajouté avec succès");
                navigate("/Clients");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container "   style={{ marginTop: '200px'}}>
            <div className="card shadow p-4" style={{maxWidth: '500px', margin: 'auto', borderRadius: '15px'}}>
                <h3 className="fw-bold mb-4">Ajouter un nouveau vendeur</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nom du vendeur (commerçant)</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Numéro de téléphone</label>
                        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Adresse</label>
                        <input type="text" className="form-control" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Enregistrer les informations</button>
                </form>
            </div>
        </div>
    );
};

export default AddMarchand;