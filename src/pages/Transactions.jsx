import { useEffect, useState } from "react";
import API from "../api";
import Toast from "../components/Toast";

function Transactions() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const res = await API.get("/transactions");
        setData(res.data);
        setFilteredData(res.data);
        setError("");
      } catch (err) {
        console.error("Failed to load transactions:", err);
        setError("Unable to load transactions. Check your connection.");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let filtered = data;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Search by mobile number or amount
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.mobile.includes(searchTerm) ||
          t.amount.toString().includes(searchTerm),
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, filterType, data]);

  const handleCopyMobile = (mobile) => {
    navigator.clipboard.writeText(mobile);
    setToast({ message: "Mobile number copied!", type: "success" });
  };

  const stats = {
    total: data.length,
    recharges: data.filter((t) => t.type === "Recharge").length,
    transfers: data.filter((t) => t.type === "Send Money").length,
    totalAmount: data.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
  };

  return (
    <div className="page">
      <h2>📊 Transaction History</h2>

      {error && <div className="error">{error}</div>}

      {/* Statistics */}
      {data.length > 0 && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Total Amount</h3>
            <div className="stat-value">Rs. {stats.totalAmount}</div>
          </div>
          <div className="stat-card">
            <h3>Transfers</h3>
            <div className="stat-value">{stats.transfers}</div>
          </div>
          <div className="stat-card">
            <h3>Recharges</h3>
            <div className="stat-value">{stats.recharges}</div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by mobile or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: "12px", margin: "10px 0" }}
        >
          <option value="all">All Types</option>
          <option value="Send Money">Send Money</option>
          <option value="Recharge">Recharge</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && <div className="spinner"></div>}

      {/* No Data State */}
      {!loading && !error && filteredData.length === 0 && data.length === 0 && (
        <p style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
          📭 No transactions yet. Start by sending money or recharging!
        </p>
      )}

      {/* No Results State */}
      {!loading && !error && data.length > 0 && filteredData.length === 0 && (
        <p style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
          🔍 No transactions match your search.
        </p>
      )}

      {/* Transaction List */}
      {!loading &&
        filteredData.map((t) => (
          <div key={t.id} className="transaction-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  className={`transaction-badge ${t.type === "Recharge" ? "badge-recharge" : "badge-send"}`}
                >
                  {t.type}
                </span>
              </div>
              <div style={{ color: "#999", fontSize: "0.9rem" }}>
                ID: {t.id}
              </div>
            </div>

            <p>
              <b>📱 Mobile:</b> {t.mobile}
              <button
                onClick={() => handleCopyMobile(t.mobile)}
                style={{
                  padding: "5px 10px",
                  marginLeft: "10px",
                  fontSize: "0.8rem",
                  background: "#667eea",
                }}
              >
                Copy
              </button>
            </p>

            <p>
              <b>💰 Amount:</b> Rs. {t.amount}
            </p>
          </div>
        ))}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Transactions;
