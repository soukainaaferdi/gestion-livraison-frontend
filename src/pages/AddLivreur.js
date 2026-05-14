import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddLivreur = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom_complet: '', 
        phone: '',
        email: '',
        password: '',
        zone:'',
    });
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const token = localStorage.getItem("token");
        
        try {
            // صيفطنا الداتا نيشان لـ Laravel
            // Laravel هو اللي غايصاوب الـ ID بوحدو (Auto-increment)
          await axios.post('http://127.0.0.1:8000/api/livreurs', {
            nom_complet: formData.nom_complet,
            telephone: formData.phone, // صيفطناها بـ telephone حيت Controller كيقلب عليها
            email: formData.email,
            password: formData.password,
            zone: formData.zone,
        },{
            headers: {
                'Authorization': `Bearer ${token}` // هادي هي الطريقة اليدوية
            }
        });
            
            alert("Livreur ajoute avec succes!");
            navigate('/Livreurs');
        } catch (err) {
            console.error(err);
            alert("Erreur");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow border-0 p-4" style={{maxWidth: '600px', margin: 'auto', borderRadius: '15px'}}>
                <h3 className="text-center fw-bold mb-4">Ajouter un Livreur</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nom Complet</label>
                        <input type="text" className="form-control" 
                            onChange={(e) => setFormData({...formData, nom_complet: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mot de passe</label>
                        <input type="password" className="form-control" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Téléphone</label>
                        <input type="text" className="form-control" 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                <label className="form-label">Zone de travail</label>
                <select className="form-select" onChange={(e) => setFormData({...formData, zone: e.target.value})} required>
                    <option value="">-- Sélectionner une zone --</option>
                    <option value="Ain Sebaa">Ain Sebaa</option>
                    <option value="Maarif">Maarif</option>
                    <option value="Oulfa">Oulfa</option>
                </select>
            </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Créer le compte</button>
                </form>
            </div>
        </div>
    );
};

export default AddLivreur;