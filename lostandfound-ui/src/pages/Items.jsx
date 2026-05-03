import { useState, useEffect } from "react";
import { API_URL } from "../App";

export default function Items({ token, navigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/items/`)
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => { setError("Failed to load items"); setLoading(false); });
  }, []);

  if (loading) return <p>Loading items...</p>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Found Items</h2>
        {token && (
          <button style={styles.btn} onClick={() => navigate("report")}>
            + Report Found Item
          </button>
        )}
      </div>

      {items.length === 0 && <p style={styles.empty}>No items reported yet.</p>}

      <div style={styles.grid}>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.itemTitle}>{item.title}</span>
              <span style={{ ...styles.badge, background: item.status === "available" ? "#d4edda" : "#f8d7da", color: item.status === "available" ? "#155724" : "#721c24" }}>
                {item.status}
              </span>
            </div>
            {item.category && <p style={styles.meta}>📂 {item.category}</p>}
            {item.location_found && <p style={styles.meta}>📍 {item.location_found}</p>}
            {item.description && <p style={styles.desc}>{item.description}</p>}
            {item.date_found && (
              <p style={styles.meta}>📅 {new Date(item.date_found).toLocaleDateString()}</p>
            )}
            {token && item.status === "available" && (
              <button style={styles.claimBtn} onClick={() => navigate("claim", item.id)}>
                Claim This Item
              </button>
            )}
            {!token && (
              <p style={styles.loginHint}>
                <span style={styles.linkText} onClick={() => navigate("login")}>Login</span> to claim this item
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { margin: 0 },
  btn: { background: "#222", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  grid: { display: "flex", flexDirection: "column", gap: "12px" },
  card: { background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "16px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  itemTitle: { fontWeight: "600", fontSize: "16px" },
  badge: { padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "500" },
  meta: { margin: "4px 0", fontSize: "13px", color: "#555" },
  desc: { margin: "8px 0", fontSize: "14px", color: "#333" },
  claimBtn: { marginTop: "12px", background: "#0066cc", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  empty: { color: "#888", textAlign: "center", marginTop: "48px" },
  error: { background: "#fee", border: "1px solid #fcc", color: "#c00", padding: "10px", borderRadius: "6px" },
  loginHint: { margin: "12px 0 0", fontSize: "13px", color: "#888" },
  linkText: { color: "#0066cc", cursor: "pointer" },
};
