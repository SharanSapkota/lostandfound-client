import { useState } from "react";
import { API_URL } from "../App";

export default function ReportItem({ token, navigate }) {
  const [form, setForm] = useState({ title: "", description: "", category: "", location_found: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div style={styles.card}>
        <p>You must be logged in to report a found item.</p>
        <button style={styles.btn} onClick={() => navigate("login")}>Go to Login</button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to report item");
      setSuccess(true);
      setTimeout(() => navigate("items"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.card}>
        <p style={styles.successMsg}>✅ Item reported successfully! Redirecting...</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Report Found Item</h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Title *</label>
          <input style={styles.input} name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Blue Backpack" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <input style={styles.input} name="category" value={form.category} onChange={handleChange} placeholder="e.g. Bags, Electronics, Documents" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Location Found</label>
          <input style={styles.input} name="location_found" value={form.location_found} onChange={handleChange} placeholder="e.g. Main Library, Floor 2" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea style={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Any additional details about the item..." rows={3} />
        </div>
        <div style={styles.btns}>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate("items")}>Cancel</button>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Submitting..." : "Report Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: { background: "#fff", padding: "32px", borderRadius: "8px", border: "1px solid #ddd" },
  title: { marginTop: 0, marginBottom: "24px" },
  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
  input: { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", resize: "vertical" },
  btns: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" },
  btn: { background: "#222", color: "#fff", border: "none", padding: "9px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  cancelBtn: { background: "none", border: "1px solid #ccc", padding: "9px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  error: { background: "#fee", border: "1px solid #fcc", color: "#c00", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  successMsg: { color: "#155724", fontSize: "16px", textAlign: "center" },
};
