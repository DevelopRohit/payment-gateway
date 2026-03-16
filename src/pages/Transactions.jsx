import { useEffect, useState } from "react";
import API from "../api";
import Toast from "../components/Toast";
import { formatCurrency, formatDate } from "../utils/formatters";

function Transactions() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadTransactions() {
      setLoading(true);

      try {
        const response = await API.get("/transactions");
        const items = Array.isArray(response.data) ? response.data : [];

        if (!isActive) {
          return;
        }

        setData(items);
        setFilteredData(items);
        setError("");
      } catch (requestError) {
        console.error("Failed to load transactions:", requestError);

        if (isActive) {
          setError("Unable to load transactions. Check your connection.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let filtered = data;

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.mobile.includes(searchTerm) ||
          item.amount.toString().includes(searchTerm),
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, filterType, data]);

  const handleCopyMobile = async (mobile) => {
    try {
      await navigator.clipboard.writeText(mobile);
      setToast({ message: "Mobile number copied.", type: "success" });
    } catch {
      setToast({
        message: "Copy failed. Please copy the number manually.",
        type: "error",
      });
    }
  };

  const stats = {
    total: data.length,
    recharges: data.filter((item) => item.type === "Recharge").length,
    transfers: data.filter((item) => item.type === "Send Money").length,
    totalAmount: data.reduce(
      (sum, item) => sum + Number.parseFloat(item.amount || 0),
      0,
    ),
  };

  return (
    <div className="page">
      <h2>Transaction History</h2>

      {error && <div className="error">{error}</div>}

      {data.length > 0 && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Total Amount</h3>
            <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
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

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by mobile or amount..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          value={filterType}
          onChange={(event) => setFilterType(event.target.value)}
          style={{ padding: "12px", margin: "10px 0" }}
        >
          <option value="all">All Types</option>
          <option value="Send Money">Send Money</option>
          <option value="Recharge">Recharge</option>
        </select>
      </div>

      {loading && <div className="spinner"></div>}

      {!loading && !error && filteredData.length === 0 && data.length === 0 && (
        <p style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
          No transactions yet. Start by sending money or recharging.
        </p>
      )}

      {!loading && !error && data.length > 0 && filteredData.length === 0 && (
        <p style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
          No transactions match your search.
        </p>
      )}

      {!loading &&
        filteredData.map((transaction) => (
          <div
            key={`${transaction.type}-${transaction.id}`}
            className="transaction-card"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  className={`transaction-badge ${transaction.type === "Recharge" ? "badge-recharge" : "badge-send"}`}
                >
                  {transaction.type}
                </span>
              </div>
              <div style={{ color: "#999", fontSize: "0.9rem" }}>
                {formatDate(transaction.created_at)}
              </div>
            </div>

            <p>
              <b>Mobile:</b> {transaction.mobile}
              <button
                onClick={() => handleCopyMobile(transaction.mobile)}
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
              <b>Amount:</b> {formatCurrency(transaction.amount)}
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
