import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Items from "./pages/Items";
import ReportItem from "./pages/ReportItem";
import ClaimItem from "./pages/ClaimItem";

const API_URL = "http://localhost:8000/api/v1";

export { API_URL };

export default function App() {
  const [page, setPage] = useState("items");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const navigate = (p, itemId = null) => {
    setSelectedItemId(itemId);
    setPage(p);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("items");
  };

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
    navigate("items");
  };

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <span style={styles.logo}>🎒 Lost & Found</span>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate("items")}>Items</button>
          {token ? (
            <>
              <button style={styles.navBtn} onClick={() => navigate("report")}>Report Item</button>
              <button style={styles.navBtn} onClick={logout}>Logout</button>
            </>
          ) : (
            <button style={styles.navBtn} onClick={() => navigate("login")}>Login</button>
          )}
        </div>
      </nav>

      <main style={styles.main}>
        {page === "login" && <Login onLogin={handleLogin} navigate={navigate} />}
        {page === "items" && <Items token={token} navigate={navigate} />}
        {page === "report" && <ReportItem token={token} navigate={navigate} />}
        {page === "claim" && <ClaimItem token={token} itemId={selectedItemId} navigate={navigate} />}
      </main>
    </div>
  );
}

const styles = {
  app: { fontFamily: "sans-serif", minHeight: "100vh", background: "#f5f5f5" },
  nav: { background: "#fff", borderBottom: "1px solid #ddd", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontWeight: "bold", fontSize: "18px" },
  navLinks: { display: "flex", gap: "12px" },
  navBtn: { background: "none", border: "1px solid #ccc", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
  main: { maxWidth: "800px", margin: "32px auto", padding: "0 16px" },
};
