import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
const Login = ({onLoginSuccess}) => {
    const [email, setEmail] = useState(""); // غيولي يدخل بالجيمايل
    const [password, setPassword] = useState(""); // زيادة كلمة السر
    const navigate = useNavigate();
     const handleLogin = (e) => {
    e.preventDefault();
    
    axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password
    })
    .then(res => {
        // Laravel جاوب بـ 200 OK
        const userData = res.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        onLoginSuccess(); // هادي اللي في App.js غاتحدث الحالة
    })
    .catch(err => {
        // Laravel جاوب بـ 401 أو 500
        alert(err.response?.data?.message || "مشكل في الاتصال بالسيرفر");
    });
};

    return (
        <div className=" d-flex justify-content-center align-items-center login" style={{height: '100vh', }}>
            <div className="card p-4 shadow-lg border-0" style={{width: '400px', borderRadius: '20px'}}>
                <div className="text-center mb-4">
                    <h1 className="fw-bold " style={{ color: '#000000' }}> LIVRIHA</h1>
                    <p className="text-muted">Connectez-vous à votre compte</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input 
                            type="text" 
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

                    <button type="submit" className="btn btn w-100 py-2 fw-bold" style={{borderRadius: '10px',background:'#7c3aed',color:'white'}}>
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;