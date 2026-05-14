import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarLivreur from "../components/sidebarLivreur";

const LivreurDashboard = () => {
    // حالة البيانات
    const [stats, setStats] = useState({ solde: 0, activeMissions: 0, totalDone: 0 });
    
    // تأكد بلي الـ user كاين باش ما يوقعش Error
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
     const token = localStorage.getItem("token");
    useEffect(() => {
        if (user && user.id && token) {
             const API_BASE = "http://127.0.0.1:8000/api";
            // إعداد التوكن في الـ Config
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            // جلب بيانات الليفرور (Solde)
            // بدل هادي: `${API_BASE}/livreurs/${user.id}`
            // بهادي:
              axios.get(`${API_BASE}/livreurs/by-user/${user.id}`,config)
                .then(res => {
                    setStats(prev => ({ ...prev, solde: res.data.solde }));
                })
                .catch(err => console.error("Erreur solde:", err));

            // جلب الطلبيات
            axios.get(`${API_BASE}/my-orders/${user.id}`,config)
                .then(res => {
                    const orders = res.data;
                    setStats(prev => ({
                        ...prev,
                        activeMissions: orders.filter(o => o.statut === "assigne").length,
                        totalDone: orders.filter(o => o.statut === "livre").length
                    }));
                })
                .catch(err => console.error("Erreur missions:", err));
                  }
                   }, [user?.id,token]); // الـ Optional chaining مهم هنا

    if (!user) return <div className="p-5 text-center">Veuillez vous connecter.</div>;

    return (<>     
                      <header className="livreur-header">
                <h3 className="logo-text">LIVRIHA</h3>
                <span className="user-email-display">{user.email}</span>
            </header>
        <div className="d-flex">
            <div className="container mt-4 flex-grow-1">
                <div className="row g-3 text-center" style={{marginTop:'200px'}}>
                    {/* كارت الفلوس */}
                    <div className="col-md-4 ">
                        <div className="card shadow-sm border-0 bg-primary text-white p-4 rounded-4 solde">
                            <h6 className="text-white">Mon Solde</h6>
                            <h2 className="fw-bold">{stats.solde || 0} DH</h2>
                        </div>
                    </div>

                    {/* كارت المهام */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-warning text-white p-4 rounded-4">
                            <h6 className="text-white">Missions en cours</h6>
                            <h2 className="fw-bold ">{stats.activeMissions}</h2>
                        </div>
                    </div>

                    {/* كارت التوصيلات الناجحة */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-4 rounded-4 bg-success text-white p-4 rounded-4">
                            <h6 className="text-white">Livraisons terminées</h6>
                            <h2 className="fw-bold">{stats.totalDone}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

export default LivreurDashboard;