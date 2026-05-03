import { useState } from "react";
import { API_URL } from "../App";

export default function Login({ onLogin, navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Login</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@university.fi"
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={styles.link}>
        No account?{" "}
        <span style={styles.linkText} onClick={() => navigate("register")}>Register</span>
      </p>
    </div>
  );
}

const styles = {
  card: { background: "#fff", padding: "32px", borderRadius: "8px", border: "1px solid #ddd", maxWidth: "400px", margin: "0 auto" },
  title: { marginTop: 0, marginBottom: "24px" },
  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
  input: { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  btn: { width: "100%", padding: "10px", background: "#222", color: "#fff", border: "none", borderRadius: "6px", fontSize: "15px", cursor: "pointer", marginTop: "8px" },
  error: { background: "#fee", border: "1px solid #fcc", color: "#c00", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  link: { textAlign: "center", marginTop: "16px", fontSize: "14px" },
  linkText: { color: "#0066cc", cursor: "pointer" },
};
