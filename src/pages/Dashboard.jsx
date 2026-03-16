import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate } from "../utils/formatters";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    totalRecharges: 0,
    totalTransfers: 0,
    rechargeAmount: 0,
    transferAmount: 0,
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadStats() {
      setLoading(true);

      try {
        const response = await API.get("/transactions");
        const data = Array.isArray(response.data) ? response.data : [];

        const recharges = data.filter((item) => item.type === "Recharge");
        const transfers = data.filter((item) => item.type === "Send Money");

        const rechargeAmount = recharges.reduce(
          (sum, item) => sum + Number.parseFloat(item.amount || 0),
          0,
        );
        const transferAmount = transfers.reduce(
          (sum, item) => sum + Number.parseFloat(item.amount || 0),
          0,
        );

        if (!isActive) {
          return;
        }

        setStats({
          totalTransactions: data.length,
          totalAmount: rechargeAmount + transferAmount,
          totalRecharges: recharges.length,
          totalTransfers: transfers.length,
          rechargeAmount,
          transferAmount,
          recentTransactions: data.slice(0, 5),
        });
        setError("");
      } catch (requestError) {
        console.error("Failed to load stats:", requestError);

        if (isActive) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="page">
      <h2>Dashboard and Analytics</h2>

      <div className="balance-section">
        <div className="dashboard-balance-card">
          <div className="balance-header">
            <h3>Account Balance</h3>
            <p className="balance-subtext">Current wallet balance</p>
          </div>
          <div className="balance-display">
            {formatCurrency(user?.balance || 0)}
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="spinner"></div>}

      {!loading && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Transactions</h3>
              <div className="stat-value">{stats.totalTransactions}</div>
              <p style={{ color: "#999", marginTop: "10px" }}>Total count</p>
            </div>

            <div className="stat-card">
              <h3>Total Amount</h3>
              <div className="stat-value">
                {formatCurrency(stats.totalAmount)}
              </div>
              <p style={{ color: "#999", marginTop: "10px" }}>
                All transactions
              </p>
            </div>

            <div className="stat-card">
              <h3>Money Transfers</h3>
              <div className="stat-value">{stats.totalTransfers}</div>
              <p style={{ color: "#999", marginTop: "10px" }}>
                {formatCurrency(stats.transferAmount)}
              </p>
            </div>

            <div className="stat-card">
              <h3>Mobile Recharges</h3>
              <div className="stat-value">{stats.totalRecharges}</div>
              <p style={{ color: "#999", marginTop: "10px" }}>
                {formatCurrency(stats.rechargeAmount)}
              </p>
            </div>
          </div>

          <div style={{ maxWidth: "800px", margin: "40px auto" }}>
            <h3 style={{ color: "white", marginBottom: "20px" }}>
              Recent Transactions
            </h3>

            {stats.recentTransactions.length === 0 ? (
              <p style={{ textAlign: "center", color: "white" }}>
                No transactions yet
              </p>
            ) : (
              <div>
                {stats.recentTransactions.map((transaction) => (
                  <div
                    key={`${transaction.type}-${transaction.id}`}
                    className="transaction-card"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <span
                          className={`transaction-badge ${transaction.type === "Recharge" ? "badge-recharge" : "badge-send"}`}
                        >
                          {transaction.type}
                        </span>
                        <p style={{ marginTop: "10px", color: "#666" }}>
                          Mobile: <b>{transaction.mobile}</b>
                        </p>
                      </div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: "#667eea",
                          textAlign: "right",
                        }}
                      >
                        <div>{formatCurrency(transaction.amount)}</div>
                        <div style={{ fontSize: "0.9rem", color: "#999" }}>
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
