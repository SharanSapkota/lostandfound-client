import { useState } from "react";
import { API_URL } from "../App";

export default function ClaimItem({ token, itemId, navigate }) {
  const [proofDetails, setProofDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div style={styles.card}>
        <p>You must be logged in to claim an item.</p>
        <button style={styles.btn} onClick={() => navigate("login")}>Go to Login</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/items/${itemId}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proof_details: proofDetails, proof_image_url: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to submit claim");
      setSuccess(true);
      setTimeout(() => navigate("items"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.card}>
        <p style={styles.successMsg}>✅ Claim submitted! An admin will review it. Redirecting...</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Claim Item #{itemId}</h2>
      <p style={styles.hint}>Describe why this item belongs to you. Be as specific as possible — the admin will review your claim.</p>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Proof of Ownership *</label>
          <textarea
            style={styles.textarea}
            value={proofDetails}
            onChange={(e) => setProofDetails(e.target.value)}
            required
            rows={5}
            placeholder="e.g. This is my backpack. It has a red keychain attached and contains my laptop and student ID card inside the front pocket."
          />
        </div>
        <div style={styles.btns}>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate("items")}>Cancel</button>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: { background: "#fff", padding: "32px", borderRadius: "8px", border: "1px solid #ddd" },
  title: { marginTop: 0, marginBottom: "8px" },
  hint: { color: "#666", fontSize: "14px", marginBottom: "24px" },
  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" },
  textarea: { width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", resize: "vertical" },
  btns: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" },
  btn: { background: "#0066cc", color: "#fff", border: "none", padding: "9px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  cancelBtn: { background: "none", border: "1px solid #ccc", padding: "9px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  error: { background: "#fee", border: "1px solid #fcc", color: "#c00", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontSize: "14px" },
  successMsg: { color: "#155724", fontSize: "16px", textAlign: "center" },
};
