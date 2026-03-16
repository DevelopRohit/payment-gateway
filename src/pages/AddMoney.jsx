import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";
import "../styles/add-money.css";

function AddMoney() {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    amount: "",
  });

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleQuickAmount = (amount) => {
    setForm({ amount: amount.toString() });
    setErrors({});
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    setForm({ amount: value });

    if (errors.amount) {
      setErrors({ ...errors, amount: "" });
    }
  };

  const handleAddMoney = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    const parsedAmount = Number.parseInt(form.amount, 10);

    if (!form.amount.trim()) {
      nextErrors.amount = "Amount is required";
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Amount must be a positive number";
    } else if (parsedAmount > 100000) {
      nextErrors.amount = "Maximum limit is 100,000";
    } else if (parsedAmount < 10) {
      nextErrors.amount = "Minimum amount is 10";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      if (!token) {
        updateUser({
          ...user,
          balance: Number(user?.balance || 0) + parsedAmount,
        });
      } else {
        const response = await API.post("/add-money", {
          amount: parsedAmount,
        });

        if (response.data.user) {
          updateUser(response.data.user);
        }
      }

      setToast({
        message: `${formatCurrency(parsedAmount)} added to your account.`,
        type: "success",
      });
      setForm({ amount: "" });

      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "Failed to add money.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Add Money to Wallet</h2>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="add-money-container">
        <div className="add-money-card">
          <div className="current-balance">
            <p className="balance-label">Current Balance</p>
            <div className="balance-display">
              {formatCurrency(user?.balance || 0)}
            </div>
          </div>

          <div className="quick-amounts">
            <p className="quick-label">Quick Select</p>
            <div className="quick-buttons">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`quick-btn ${form.amount === amount.toString() ? "active" : ""}`}
                  onClick={() => handleQuickAmount(amount)}
                >
                  {formatCurrency(amount, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddMoney}>
            <div className="form-group">
              <label htmlFor="amount">Enter Amount</label>
              <input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleAmountChange}
                min="10"
                max="100000"
                step="1"
                style={{
                  borderColor: errors.amount ? "#f44336" : "#e0e0e0",
                }}
              />
              {errors.amount && <p className="error-text">{errors.amount}</p>}
            </div>

            {form.amount && !errors.amount && (
              <div className="amount-info">
                <div className="info-row">
                  <span>Amount</span>
                  <span className="amount-value">
                    {formatCurrency(form.amount)}
                  </span>
                </div>
                <div className="info-row">
                  <span>Fee</span>
                  <span className="fee-value">Free</span>
                </div>
                <div className="info-row total">
                  <span>Total Amount</span>
                  <span className="final-amount">
                    {formatCurrency(form.amount)}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="add-money-btn"
              disabled={loading || !form.amount}
            >
              {loading ? "Processing..." : "Add Money Now"}
            </button>
          </form>

          <div className="info-box">
            <p className="info-icon">Info</p>
            <ul className="info-list">
              <li>Minimum amount: 10</li>
              <li>Maximum amount: 100,000</li>
              <li>Amount will be added instantly</li>
              <li>No charges or hidden fees</li>
            </ul>
          </div>
        </div>

        <div className="info-card">
          <h3>How It Works</h3>
          <ol>
            <li>Select or enter the amount you want to add</li>
            <li>Click the Add Money Now button</li>
            <li>Your balance will be updated instantly</li>
            <li>The transaction will be saved in your history</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AddMoney;
