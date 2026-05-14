import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';

const Login = () => { // حيدنا onLoginSuccess من الـ Props
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        axios.post('http://127.0.0.1:8000/api/login', {
            email: email,
            password: password
        })
        .then(res => {
            // 1. استخراج التوكن ومعلومات المستخدم من جواب Laravel
            const token = res.data.token;
            const userData = res.data.user;

            // 2. تخزين "الساروت" والبيانات في المتصفح[cite: 1, 2]
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            // 3. إعادة تحميل الصفحة للذهاب للمسار الصحيح حسب الـ Role
            // هاد الطريقة أحسن من navigate هنا حيت كتعاود تشغل App.js من الزيرو
            window.location.href = "/"; 
        })
        .catch(err => {
            alert(err.response?.data?.message || "Email ou mot de passe incorrect");
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center login" style={{height: '100vh'}}>
            <div className="card p-4 shadow-lg border-0" style={{width: '400px', borderRadius: '20px'}}>
                <div className="text-center mb-4">
                    <h1 className="fw-bold" style={{ color: '#000000' }}>LIVRIHA</h1>
                    <p className="text-muted">Connectez-vous à votre compte</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input 
                            type="email" 
                            className="form-control p-2" 
                            placeholder="votre@email.com" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{borderRadius: '10px'}}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control p-2" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{borderRadius: '10px'}}
                        />
                    </div>

                    <button type="submit" className="btn w-100 py-2 fw-bold" style={{borderRadius: '10px', background:'#7c3aed', color:'white'}}>
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;