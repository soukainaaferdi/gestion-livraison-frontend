const PrintRecu = ({ client, amount, paidOrders }) => {
    const date = new Date().toLocaleDateString('fr-FR', { 
        day: '2-digit', month: 'long', year: 'numeric' 
    });

    const handlePrint = () => window.print();

    return (
        <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '40px', color: '#1e293b', maxWidth: '800px', margin: 'auto' }}>
            
            {/* Print button — mkatbanch fach print */}
            <button onClick={handlePrint} style={{
                background: '#6366f1', color: 'white', border: 'none',
                borderRadius: '10px', padding: '10px 24px', fontWeight: '700',
                cursor: 'pointer', marginBottom: '30px', fontSize: '14px'
            }}
            className="no-print">
                🖨️ Imprimer
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #6366f1', paddingBottom: '20px', marginBottom: '32px' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#6366f1', letterSpacing: '2px' }}>LIVRIHA</div>
                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Plateforme de Gestion de Livraison</div>
                <div style={{ fontSize: '18px', fontWeight: '700', marginTop: '12px' }}>Reçu de Paiement</div>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
                <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', width: '48%' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Marchand</p>
                    <p style={{ fontWeight: '700', marginBottom: '4px' }}>{client?.nom_complet}</p>
                    <p style={{ color: '#64748b', marginBottom: '4px' }}>{client?.telephone || '---'}</p>
                    <p style={{ color: '#64748b' }}>{client?.adresse || '---'}</p>
                </div>
                <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', width: '48%' }}>
                    <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Détails</p>
                    <p style={{ fontWeight: '700', marginBottom: '4px' }}>Date : {date}</p>
                    <p style={{ marginBottom: '4px' }}>Commandes : {paidOrders?.length}</p>
                    <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #6ee7b7', borderRadius: '50px', padding: '3px 10px', fontSize: '11px', fontWeight: '600' }}>✓ Payé</span>
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                    <tr style={{ background: '#1e293b' }}>
                        <th style={{ color: 'white', padding: '10px 14px', fontSize: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ color: 'white', padding: '10px 14px', fontSize: '12px', textAlign: 'left' }}>Produit</th>
                        <th style={{ color: 'white', padding: '10px 14px', fontSize: '12px', textAlign: 'left' }}>Destination</th>
                        <th style={{ color: 'white', padding: '10px 14px', fontSize: '12px', textAlign: 'left' }}>Montant (DH)</th>
                    </tr>
                </thead>
                <tbody>
                    {paidOrders?.map((o, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#f8faff' : 'white' }}>
                            <td style={{ padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>#{o.id}</td>
                            <td style={{ padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>{o.produit}</td>
                            <td style={{ padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>{o.destination || '---'}</td>
                            <td style={{ padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', fontWeight: '700' }}>{o.prix_marchandise} DH</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total */}
            <div style={{ background: '#6366f1', color: 'white', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '14px', opacity: '0.85' }}>Montant total réglé</span>
                <strong style={{ fontSize: '24px' }}>{amount} DH</strong>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <p>LIVRIHA — Reçu généré le {date}</p>
                <p style={{ marginTop: '4px' }}>Ce reçu confirme le règlement complet du solde</p>
            </div>

            <style>{`@media print { .no-print { display: none; } }`}</style>
        </div>
    );
};

export default PrintRecu;