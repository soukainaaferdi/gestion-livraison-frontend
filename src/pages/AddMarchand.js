import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMarchand = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMarchand = { name, phone, address: "---" };

        axios.post("http://127.0.0.1:8000/api/clients", newMarchand)
            .then(() => {
                alert("Vendeur ajouté avec succès");
                navigate("/Clients");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container mt-5">
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
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Enregistrer les informations</button>
                </form>
            </div>
        </div>
    );
};

export default AddMarchand;