import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/MarchandDashboard.css';

const MarchandAddOrder = () => {
    const [formData, setFormData] = useState({
        destinataire_name: "",
        destinataire_phone: "",
        destination: "",
        destination_zone: "",
        produit: "",
        prix_marchandise: "",
        frais_livraison: "",
        priority: "1"
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const total = Number(formData.prix_marchandise) + Number(formData.frais_livraison);
        try {
            await axios.post("http://127.0.0.1:8000/api/orders", {
                ...formData,
                prix_total: total,
                statut: "en_attente",
                is_paid: false
            }, config);
            setSuccess(true);
            setTimeout(() => navigate("/marchand/commandes"), 1500);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout");
        }
        setLoading(false);
    };

    const priorityOptions = [
        { val: "1", label: "Normal", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
        { val: "2", label: "Important", color: "#15803d", bg: "#eef2ff", border: "#c7d2fe" },
        { val: "3", label: "Urgent", color: "#e11d48", bg: "#fff1f2", border: "#fecdd3" },
    ];

    return (
        <div className="md-wrapper">

            {/* Header */}
            <div className="md-header">
                <div className="md-header-left">
                    <h4>Nouvelle commande </h4>
                </div>
            </div>

            {/* Success message */}
            {success && (
                <div style={{
                    background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '14px',
                    padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                    <i className="bi bi-check-circle-fill" style={{ color: '#10b981', fontSize: '1.2rem' }}></i>
                    <span style={{ color: '#059669', fontWeight: '600' }}>Commande ajoutée avec succès ! Redirection...</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>

                {/* Form */}
                <div className="md-section">
                    <h6 className="md-section-title" style={{ marginBottom: '20px' }}> Informations de livraison</h6>
                    <form onSubmit={handleSubmit}>

                        {/* Destinataire */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                Nom du destinataire
                            </label>
                            <input type="text" name="destinataire_name" className="form-control"
                                value={formData.destinataire_name} onChange={handleChange} required
                                placeholder="Ex: Mohamed Alami"
                                style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                        </div>

                        {/* Téléphone */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                Téléphone
                            </label>
                            <input type="text" name="destinataire_phone" className="form-control"
                                value={formData.destinataire_phone} onChange={handleChange} required
                                placeholder="Ex: 06 12 34 56 78"
                                style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                        </div>

                        {/* Produit */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                Produit
                            </label>
                            <input type="text" name="produit" className="form-control"
                                value={formData.produit} onChange={handleChange} required
                                placeholder="Ex: Chaussures Nike, Vêtements..."
                                style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                        </div>

                        {/* Zone */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                Zone de livraison
                            </label>
                            <input type="text" name="destination_zone" className="form-control"
                                value={formData.destination_zone} onChange={handleChange} required
                                placeholder="Ex: Ain Sebaa, Maarif..."
                                style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                        </div>

                        {/* Adresse */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                Adresse exacte
                            </label>
                            <input type="text" name="destination" className="form-control"
                                value={formData.destination} onChange={handleChange} required
                                placeholder="Ex: Rue 123, Ain Sebaa, Casablanca"
                                style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                        </div>

                        {/* Prix */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                    Prix marchandise (DH)
                                </label>
                                <input type="number" name="prix_marchandise" className="form-control"
                                    value={formData.prix_marchandise} onChange={handleChange} required
                                    placeholder="0"
                                    style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                                    Frais livraison (DH)
                                </label>
                                <input type="number" name="frais_livraison" className="form-control"
                                    value={formData.frais_livraison} onChange={handleChange} required
                                    placeholder="0"
                                    style={{ borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '14px', padding: '10px 14px' }} />
                            </div>
                        </div>

                        {/* Priority */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                                Priorité
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {priorityOptions.map(p => (
                                    <button type="button" key={p.val}
                                        onClick={() => setFormData({ ...formData, priority: p.val })}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '12px', cursor: 'pointer',
                                            border: `2px solid ${formData.priority === p.val ? p.color : '#e2e8f0'}`,
                                            background: formData.priority === p.val ? p.bg : 'white',
                                            color: formData.priority === p.val ? p.color : '#94a3b8',
                                            fontWeight: '700', fontSize: '13px', transition: 'all 0.2s ease'
                                        }}>
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '14px', background: loading ? '#10b981' : '#10b981',
                            color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700',
                            fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease'
                        }}>
                            {loading ? ' Enregistrement...' : 'Enregistrer la commande'}
                        </button>
                    </form>
                </div>

                {/* Preview card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Récap commande */}
                    <div className="md-section">
                        <h6 className="md-section-title" style={{ marginBottom: '16px' }}> Aperçu</h6>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Destinataire', val: formData.destinataire_name || '---' },
                                { label: 'Téléphone', val: formData.destinataire_phone || '---' },
                                { label: 'Produit', val: formData.produit || '---' },
                                { label: 'Zone', val: formData.destination_zone || '---' },
                                { label: 'Adresse', val: formData.destination || '---' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>{item.label}</span>
                                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600', maxWidth: '60%', textAlign: 'right' }}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div style={{
                        background: 'linear-gradient(135deg, #10b981, #10b981)',
                        borderRadius: '18px', padding: '24px', color: 'white'
                    }}>
                        <p style={{ fontSize: '12px', opacity: 0.8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>
                            Prix marchandise
                        </p>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 16px 0' }}>
                            {formData.prix_marchandise || 0} DH
                        </h2>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>Frais livraison</span>
                            <span style={{ fontWeight: '700' }}>{formData.frais_livraison || 0} DH</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>Total</span>
                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                                {Number(formData.prix_marchandise || 0) + Number(formData.frais_livraison || 0)} DH
                            </span>
                        </div>
                    </div>

                    {/* Tips */}
                    <div style={{ background: '#eef2ff', borderRadius: '14px', padding: '16px', border: '1.5px solid #c7d2fe' }}>
                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#4338ca', margin: '0 0 8px 0' }}>💡 Conseils</p>
                        <p style={{ fontSize: '12px', color: '#6366f1', margin: 0, lineHeight: '1.6' }}>
                            Vérifiez l'adresse exacte avant de soumettre. Une adresse précise garantit une livraison rapide.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarchandAddOrder;