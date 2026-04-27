import Sidebar from "./components/Sidebar";
import AddOrders from "./pages/AddOrders";
import AdminDashboard from "./pages/AdminDashboard";
import Clients from "./pages/Clients";
import Commandes from "./pages/Commandes";
import Livreurs from "./pages/Livreurs";
import MyMissions from "./pages/MyMissions"; 
import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login";
import AddLivreur from "./pages/AddLivreur";
import MerchantAccount from "./pages/MerchantAccount";
import AddMarchand from "./pages/AddMarchand";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // باش نتفاداو الفلاش ديال صفحة Login

  // هاد الدالة هي اللي غنعيطو ليها من صفحة Login ملي ينجح الدخول
  const handleAuthChange = () => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    handleAuthChange();
    setLoading(false);
  }, []);

  if (loading) return null; // أو دير شي Spinner بسيط

  // 1. إيلا ما كاينش User، كنعرضو غير صفحة الـ Login
  if (!user) {
    return (
      <Routes> 
        {/* صيفطنا handleAuthChange كـ Prop لصفحة Login */}
        <Route path="/login" element={<Login onLoginSuccess={handleAuthChange}/>}/>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. إيلا كاين User، كنعرضو السيستيم على حساب الـ Role
  return (
    <div className="d-flex">
      {/* الـ Sidebar غايطلع غير للأدمين */}
      {user.role === "admin" && <Sidebar />}
      
   
<div 
  style={{ 
    // Ghadi n-naqso l-margin l 75px hit sidebar mabqatch kbira
    marginLeft: user.role === "admin" ? '80px' : '0', 
    width: user.role === "admin" ? 'calc(100% - 75px)' : '100%',      
    padding: '20px',      
    minHeight: '100vh',
    backgroundColor: 'rgb(253, 247, 255)',
    transition: 'margin-left 0.3s ease' // bach tji smooth
  }}
>
        <Routes>
          {/* Routes للأدمين */}
          {user.role === "admin" && (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/Clients" element={<Clients />} />
              <Route path="/Orders" element={<Commandes />} />
              <Route path="/Livreurs" element={<Livreurs />} />
              <Route path="/AddOrders" element={<AddOrders />} />
              <Route path="/AddMarchand" element={<AddMarchand />} />
              <Route path="/AddLivreur" element={<AddLivreur/>} />         
              <Route path="/client-account/:id" element={<MerchantAccount />} />
            </>
          )}

          {/* Routes للموزع */}
          {user.role === "livreur" && (
            <Route path="/MyMissions" element={<MyMissions />} />
          )}

          {/* التوجيه التلقائي حسب الدور */}
          <Route 
            path="*" 
            element={<Navigate to={user.role === "admin" ? "/" : "/MyMissions"} replace />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;