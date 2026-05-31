import Sidebar from "./components/Sidebar";
import AddOrders from "./pages/AddOrders";
import AdminDashboard from "./pages/AdminDashboard";
import Clients from "./pages/Clients";
import Commandes from "./pages/Commandes";
import Livreurs from "./pages/Livreurs";
import MyMissions from "./pages/MyMissions"; 
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AddLivreur from "./pages/AddLivreur";
import MerchantAccount from "./pages/MerchantAccount";
import AddMarchand from "./pages/AddMarchand";
import SidebarLivreur from "./components/sidebarLivreur";
import Historique from "./pages/historique";
import LivreurDashboard from "./pages/DashboarLivreur";
import EditOrder from "./pages/EditOrder";
import PrintRecu from "./pages/ProntRecu";
import MarchandDashboard from "./pages/MarchandDashboard";
import MarchandCommandes from "./pages/MarchandCommandes";
import SidebarMarchand from "./components/SidebarMarchand";
import MarchandAddOrder from "./pages/MarchandAddOrder";
import MarchandPayments from "./pages/MarchandPayments";
function App() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  
  let user = null;
  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (e) {
    // إذا كانت البيانات corrupted
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // ✅ تحقق أدق: token لازم يكون string غير فاضي
  if (!token || token === "null" || token === "undefined" || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const userRole = user?.role;

  // ✅ إذا الرول مش معروف، رجعه للـ login
 if (userRole !== "admin" && userRole !== "livreur" && userRole !== "marchand") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className={userRole === "admin" ? "d-flex": userRole === "marchand" ? "d-flex" :  "block"}>
      {userRole === "admin" ? <Sidebar /> : userRole === "livreur" ? <SidebarLivreur /> : <SidebarMarchand />}
      <div
        className={`main-content ${userRole === "admin" ? "admin-layout" : "livreur-layout"}`}
        style={{
          marginLeft: userRole === "admin" ? "80px" : "0",
          paddingBottom: userRole === "livreur" ? "90px" : "20px",
          width: userRole === "admin" ? "calc(100% - 80px)" : "100%",
          padding: "20px",
          minHeight: "100vh",
          backgroundColor: "rgb(253, 247, 255)",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          {userRole === "admin" && (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/Clients" element={<Clients />} />
              <Route path="/Orders" element={<Commandes />} />
              <Route path="/Livreurs" element={<Livreurs />} />
              <Route path="/AddOrders" element={<AddOrders />} />
              <Route path="/AddMarchand" element={<AddMarchand />} />
              <Route path="/AddLivreur" element={<AddLivreur />} />
              <Route path="/client-account/:id" element={<MerchantAccount />} />
              <Route path="/EditOrder/:id" element={<EditOrder />} />
              <Route path="/recu" element={<PrintRecu />} />
            </>
          )}

          {userRole === "livreur" && (
            <>
              {/* ✅ إصلاح typo: "dahboard" → "dashboard" */}
              <Route path="/dashboard" element={<LivreurDashboard />} />
              <Route path="/MyMissions" element={<MyMissions />} />
              <Route path="/historique" element={<Historique />} />
            </>
          )}
{userRole === "marchand" && (
    <>
        <Route path="/marchand/dashboard" element={<MarchandDashboard />} />
        <Route path="/marchand/commandes" element={<MarchandCommandes />} />
        <Route path="/marchand/add-order" element={<MarchandAddOrder />} />
        <Route path="/marchand/payments" element={<MarchandPayments />} />
        {/* <Route path="/marchand/profile" element={<MarchandProfile />} /> */}
    </>
)}
          <Route
            path="*"
            element={
              <Navigate to={userRole === "admin" ? "/" : userRole === "livreur" ?"/MyMissions":"/marchand/dashboard"} replace />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;