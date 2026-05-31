import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/MarchandDashboard.css';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const MarchandDashboard = () => {
    const [stats, setStats] = useState({
        totalCommandes: 0, commandesLivrees: 0,
        commandesEnCours: 0, commandesAnnulees: 0,
        commandesRetour: 0, commandesAttente: 0,
        solde: 0, soldePaye: 0,
        lastOrders: [], zoneData: [], weeklyData: []
    });
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!user || !token) return;
        axios.get(`http://127.0.0.1:8000/api/marchand/commandes`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const orders = res.data;
            const zones = orders.reduce((acc, o) => {
                const zone = o.destination_zone || "Autre";
                const ex = acc.find(z => z.name === zone);
                if (ex) ex.value++; else acc.push({ name: zone, value: 1 });
                return acc;
            }, []);

            // Weekly data simulation from real orders
            const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
            const weekly = days.map(day => ({
                day,
                livrees: Math.floor(Math.random() * (orders.filter(o => o.statut === 'livre').length || 1)),
                attente: Math.floor(Math.random() * (orders.filter(o => o.statut === 'en_attente').length || 1)),
            }));

            setStats({
                totalCommandes: orders.length,
                commandesLivrees: orders.filter(o => o.statut === "livre").length,
                commandesEnCours: orders.filter(o => o.statut === "assigne").length,
                commandesAnnulees: orders.filter(o => o.statut === "annule").length,
                commandesRetour: orders.filter(o => o.statut === "retour").length,
                commandesAttente: orders.filter(o => o.statut === "en_attente").length,
                solde: orders.filter(o => o.statut === "livre" && !o.is_paid)
                    .reduce((s, o) => s + Number(o.prix_marchandise), 0),
                soldePaye: orders.filter(o => o.statut === "livre" && o.is_paid)
                    .reduce((s, o) => s + Number(o.prix_marchandise), 0),
                lastOrders: [...orders].reverse().slice(0, 8),
                zoneData: zones,
                weeklyData: weekly
            });
            setLoading(false);
        }).catch(err => { console.error(err); setLoading(false); });
    }, [user?.id, token]);

    const statusMap = {
        livre: { bg: '#ecfdf5', color: '#059669', border: '#6ee7b7', dot: '#10b981', label: 'Livré' },
        assigne: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', dot: '#3b82f6', label: 'En cours' },
        retour: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0', dot: '#94a3b8', label: 'Retour' },
        annule: { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3', dot: '#f43f5e', label: 'Annulé' },
        en_attente: { bg: '#fefce8', color: '#ca8a04', border: '#fef08a', dot: '#eab308', label: 'En attente' },
    };

    const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

    const totalGagne = stats.solde + stats.soldePaye;
    const pctLivree = stats.totalCommandes > 0
        ? Math.round((stats.commandesLivrees / stats.totalCommandes) * 100) : 0;

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const S = {
      wrapper: {
    minHeight: '100vh',
    
    padding: '28px 32px',
    marginLeft: '220px',
    width: 'calc(100% - 250px)',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    boxSizing: 'border-box',
},
        topbar: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 28,
        },
        title: { fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },
        breadcrumb: { fontSize: '0.78rem', color: '#94a3b8', marginTop: 4, fontWeight: 500 },
        breadcrumbLink: { color: '#6366f1', fontWeight: 600 },
        topbarRight: { display: 'flex', gap: 10, alignItems: 'center' },
        badge: {
            background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 999,
            padding: '8px 16px', fontSize: '0.78rem', fontWeight: 600, color: '#475569',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        },
        activeBadge: {
            background: '#6366f1', border: '1.5px solid #6366f1', borderRadius: 999,
            padding: '8px 16px', fontSize: '0.78rem', fontWeight: 700, color: 'white',
        },

        // Cards
        cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 24 },
        card: {
            background: 'white', borderRadius: 20, padding: '22px 24px',
            border: '1px solid rgba(226,232,240,0.6)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
            transition: 'all 0.25s ease', cursor: 'default',
        },
        cardIconBox: (bg) => ({
            width: 52, height: 52, borderRadius: 16,
            background: bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.3rem',
            marginBottom: 16,
        }),
        cardLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px 0' },
        cardVal: { fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-1.5px', lineHeight: 1 },
        cardTrend: (color, bg) => ({
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: '0.72rem', fontWeight: 700, color, background: bg,
            padding: '4px 10px', borderRadius: 999,
        }),

        // Main grid
        mainGrid: { display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 20, marginBottom: 20 },

        // Section
        section: {
            background: 'white', borderRadius: 20, padding: '22px 24px',
            border: '1px solid rgba(226,232,240,0.6)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        },
        sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
        sectionTitle: { fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 },
        sectionBadge: {
            fontSize: '0.72rem', fontWeight: 700, color: '#6366f1',
            background: '#eef2ff', padding: '5px 12px', borderRadius: 999,
        },
        periodBtn: {
            fontSize: '0.72rem', fontWeight: 600, color: '#64748b',
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
        },

        // Table
        tableWrap: {
            background: 'white', borderRadius: 20, overflow: 'hidden',
            border: '1px solid rgba(226,232,240,0.6)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        },
        tableHead: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
        },
        th: { fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '12px 16px', textAlign: 'left' },
        td: { padding: '14px 16px', fontSize: '0.875rem', color: '#1e293b', verticalAlign: 'middle', borderBottom: '1px solid #f8fafc' },
    };

    return (
        <div style={S.wrapper} className="das">

            {/* TOPBAR */}
            <div style={S.topbar}>
                <div>
                    <h4 style={S.title}>Dashboard</h4>
                   
                </div>
                <div style={S.topbarRight}>
                    <span style={S.badge}>
                        {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    
                </div>
            </div>

            {/* CARDS */}
            <div style={S.cardsGrid}>
                {[
                    {
                        icon: 'bi-box-seam', iconBg: 'linear-gradient(135deg, #6366f1, #818cf8)',
                        label: 'Total commandes', val: stats.totalCommandes,
                        trend: `+${pctLivree}%`, trendColor: '#059669', trendBg: '#ecfdf5'
                    },
                    {
                        icon: 'bi-bicycle', iconBg: 'linear-gradient(135deg, #10b981, #34d399)',
                        label: 'Livrées', val: stats.commandesLivrees,
                        trend: `${pctLivree}% taux`, trendColor: '#059669', trendBg: '#ecfdf5'
                    },
                    {
                       icon: 'bi-truck', iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        label: 'En cours', val: stats.commandesEnCours,
                        trend: 'En transit', trendColor: '#d97706', trendBg: '#fefce8'
                    },
                    {
                        icon: "bi-wallet2", iconBg: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                        label: 'À recevoir', val: `${stats.solde} DH`,
                        trend: `Payé: ${stats.soldePaye} DH`, trendColor: '#059669', trendBg: '#ecfdf5'
                    },
                ].map((c, i) => (
                    <div key={i} style={S.card}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05), 0 20px 40px rgba(99,102,241,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)'; }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div style={{ ...S.cardIconBox(c.iconBg), marginBottom: 0, color: 'white' }}><i className={`bi ${c.icon}`} style={{ fontSize: "1.4rem" }} /></div>
                            <span style={S.cardTrend(c.trendColor, c.trendBg)}>{c.trend}</span>
                        </div>
                        <p style={S.cardLabel}>{c.label}</p>
                        <h2 style={S.cardVal}>{c.val}</h2>
                    </div>
                ))}
            </div>

          {/* MAIN GRID */}
<div style={S.mainGrid}>

    {/* TABLE */}
    <div style={S.tableWrap}>
        <div style={S.tableHead}>
            <h6 style={{ ...S.sectionTitle, margin: 0 }}>
                 Dernières commandes
            </h6>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{
                    fontSize: '0.72rem',
                    color: '#94a3b8',
                    fontWeight: 600
                }}>
                    {stats.lastOrders.length} commandes affichées
                </span>

                <a
                    href="/marchand/commandes"
                    style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#6366f1',
                        textDecoration: 'none',
                        background: '#eef2ff',
                        padding: '6px 14px',
                        borderRadius: 999,
                    }}
                >
                    Voir tout →
                </a>
            </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {['N°', 'Produit', 'Destinataire', 'Zone', 'Prix', 'Statut', 'Date'].map((th, i) => (
                            <th key={i} style={S.th}>{th}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {stats.lastOrders.map((o, i) => {
                        const st = statusMap[o.statut] || statusMap['en_attente'];

                        return (
                            <tr
                                key={i}
                                style={{ transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                                onMouseLeave={e => e.currentTarget.style.background = ''}
                            >
                                <td style={S.td}>
                                    <span style={{
                                        fontWeight: 700,
                                        color: '#6366f1',
                                        fontSize: '0.82rem'
                                    }}>
                                        #{o.id}
                                    </span>
                                </td>

                                <td style={S.td}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10
                                    }}>
                                       

                                        <div>
                                            <p style={{
                                                margin: 0,
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                color: '#0f172a'
                                            }}>
                                                {o.produit}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td style={S.td}>
                                    <span style={{
                                        fontWeight: 600,
                                        color: '#475569',
                                        fontSize: '0.82rem'
                                    }}>
                                        {o.destinataire_name}
                                    </span>
                                </td>

                                <td style={S.td}>
                                    <span style={{
                                        fontSize: '0.78rem',
                                        background: '#f8fafc',
                                        color: '#64748b',
                                        padding: '4px 10px',
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {o.destination_zone}
                                    </span>
                                </td>

                                <td style={S.td}>
                                    <span style={{
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        fontSize: '0.9rem'
                                    }}>
                                        {o.prix_marchandise} DH
                                    </span>
                                </td>

                                <td style={S.td}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        background: st.bg,
                                        border: `1px solid ${st.border}`,
                                        borderRadius: 999,
                                        padding: '5px 12px'
                                    }}>
                                        <div style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            background: st.dot
                                        }} />

                                        <span style={{
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            color: st.color
                                        }}>
                                            {st.label}
                                        </span>
                                    </div>
                                </td>

                                <td style={S.td}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#94a3b8',
                                        fontWeight: 500
                                    }}>
                                        {new Date(o.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>

    {/* STATUTS PANEL */}
    <div style={S.section}>
        <div style={S.sectionHeader}>
            <h6 style={S.sectionTitle}>Statuts</h6>

            <span style={S.sectionBadge}>
                {stats.totalCommandes} total
            </span>
        </div>

        <div style={{ marginBottom: 20 }}>
            <p style={{
                fontSize: '3rem',
                fontWeight: 900,
                color: '#0f172a',
                margin: '0 0 4px 0',
                letterSpacing: '-2px',
                lineHeight: 1
            }}>
                {stats.totalCommandes}
            </p>

            <p style={{
                fontSize: '0.78rem',
                color: '#94a3b8',
                margin: 0,
                fontWeight: 500
            }}>
                Commandes ce mois
            </p>
        </div>

        {[
            {
                label: 'Livrées',
                val: stats.commandesLivrees,
                color: '#10b981'
            },
            {
                label: 'En cours',
                val: stats.commandesEnCours,
                color: '#6366f1'
            },
            {
                label: 'En attente',
                val: stats.commandesAttente,
                color: '#f59e0b'
            },
            {
                label: 'Annulées',
                val: stats.commandesAnnulees,
                color: '#f43f5e'
            },
        ].map((item, i) => {

            const pct = stats.totalCommandes > 0
                ? Math.round((item.val / stats.totalCommandes) * 100)
                : 0;

            return (
                <div key={i} style={{ marginBottom: 14 }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 6
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}>
                            <div style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: item.color
                            }} />

                            <span style={{
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                color: '#475569'
                            }}>
                                {item.label}
                            </span>
                        </div>

                        <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#0f172a'
                        }}>
                            +{item.val}
                        </span>
                    </div>

                    <div style={{
                        height: 6,
                        background: '#f1f5f9',
                        borderRadius: 999,
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: item.color,
                            borderRadius: 999,
                            transition: 'width 1s ease'
                        }} />
                    </div>
                </div>
            );
        })}

        <button
            onClick={() => window.location.href = '/marchand/add-order'}
            style={{
                width: '100%',
                marginTop: 16,
                padding: '12px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
            }}
        >
            + Nouvelle commande
        </button>
    </div>

</div>
                
            
        </div>
    );
};

export default MarchandDashboard;