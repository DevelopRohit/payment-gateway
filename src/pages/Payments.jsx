import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";
import "../styles/payments.css";

const FLOW_CONFIG = {
  "add-money": {
    title: "Add Money",
    description: "Load money into your wallet from cards and popular UPI apps.",
    endpoint: "/add-money",
    submitLabel: "Add Money",
    successTitle: "Money Added",
    minAmount: 10,
    maxAmount: 100000,
    quickAmounts: [500, 1000, 2000, 5000],
  },
  "send-money": {
    title: "Send Money",
    description: "Send money to any 10-digit mobile number with your preferred method.",
    endpoint: "/send-money",
    submitLabel: "Send Money",
    successTitle: "Payment Successful",
    minAmount: 1,
    maxAmount: 100000,
    quickAmounts: [199, 499, 999, 1999],
    requiresMobile: true,
  },
  recharge: {
    title: "Mobile Recharge",
    description: "Recharge prepaid numbers in seconds using card or UPI checkout.",
    endpoint: "/recharge",
    submitLabel: "Recharge Now",
    successTitle: "Recharge Successful",
    minAmount: 1,
    maxAmount: 50000,
    quickAmounts: [149, 249, 399, 699],
    requiresMobile: true,
  },
};

const PAYMENT_METHODS = [
  {
    id: "debit-card",
    label: "Debit Card",
    badge: "Card",
    category: "card",
    caption: "Linked savings and RuPay/Visa cards",
    colors: ["#14b8a6", "#0f766e"],
  },
  {
    id: "credit-card",
    label: "Credit Card",
    badge: "Card",
    category: "card",
    caption: "Reward cards with instant checkout",
    colors: ["#6366f1", "#4338ca"],
  },
  {
    id: "google-pay",
    label: "Google Pay",
    badge: "UPI",
    category: "upi",
    caption: "Pay with your linked Google Pay account",
    colors: ["#4285f4", "#0f9d58"],
  },
  {
    id: "phonepe",
    label: "PhonePe",
    badge: "UPI",
    category: "upi",
    caption: "Launch PhonePe and complete the request",
    colors: ["#6d28d9", "#4c1d95"],
  },
  {
    id: "paytm",
    label: "Paytm",
    badge: "UPI",
    category: "upi",
    caption: "Confirm through your Paytm UPI flow",
    colors: ["#0ea5e9", "#0369a1"],
  },
];

function normalizeFlow(value) {
  return FLOW_CONFIG[value] ? value : "add-money";
}

function createEmptyForm() {
  return {
    mobile: "",
    amount: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  };
}

function getMethodConfig(methodId) {
  return (
    PAYMENT_METHODS.find((method) => method.id === methodId) || PAYMENT_METHODS[0]
  );
}

function formatCardNumberInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups = digits.match(/.{1,4}/g);

  return groups ? groups.join(" ") : "";
}

function formatExpiryInput(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function getPreviewCardNumber(value) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "1234 5678 9012 3456";
  }

  const padded = digits.padEnd(16, "#");
  return padded.match(/.{1,4}/g).join(" ");
}

function buildSuccessMessage(flowKey, amount, mobile, methodLabel) {
  const formattedAmount = formatCurrency(amount);

  if (flowKey === "add-money") {
    return `${formattedAmount} added to your wallet using ${methodLabel}.`;
  }

  if (flowKey === "send-money") {
    return `${formattedAmount} sent to ${mobile} using ${methodLabel}.`;
  }

  return `${formattedAmount} recharge completed for ${mobile} using ${methodLabel}.`;
}

function Payments() {
  const { token, user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("debit-card");
  const [form, setForm] = useState(createEmptyForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeFlow = normalizeFlow(searchParams.get("action"));
  const flowConfig = FLOW_CONFIG[activeFlow];
  const methodConfig = getMethodConfig(selectedMethod);
  const currentAmount = Number.parseFloat(form.amount || 0);
  const walletBalance = Number(user?.balance || 0);
  const projectedBalance =
    activeFlow === "add-money" && Number.isFinite(currentAmount)
      ? walletBalance + currentAmount
      : walletBalance;

  const handleFlowChange = (nextFlow) => {
    setSearchParams({ action: nextFlow });
    setErrors({});
    setPopup(null);
  };

  const handleFieldChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors.cardName;
      delete nextErrors.cardNumber;
      delete nextErrors.expiry;
      delete nextErrors.cvv;
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const parsedAmount = Number.parseFloat(form.amount);

    if (!form.amount.trim()) {
      nextErrors.amount = "Amount is required";
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Enter a valid amount";
    } else if (parsedAmount < flowConfig.minAmount) {
      nextErrors.amount = `Minimum amount is ${flowConfig.minAmount}`;
    } else if (parsedAmount > flowConfig.maxAmount) {
      nextErrors.amount = `Maximum limit is ${flowConfig.maxAmount.toLocaleString("en-IN")}`;
    }

    if (flowConfig.requiresMobile) {
      if (!form.mobile.trim()) {
        nextErrors.mobile = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(form.mobile.trim())) {
        nextErrors.mobile = "Enter a valid 10-digit mobile number";
      }
    }

    if (methodConfig.category === "card") {
      const cardDigits = form.cardNumber.replace(/\D/g, "");

      if (!form.cardName.trim() || form.cardName.trim().length < 3) {
        nextErrors.cardName = "Card holder name is required";
      }

      if (cardDigits.length !== 16) {
        nextErrors.cardNumber = "Enter a valid 16-digit card number";
      }

      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.expiry)) {
        nextErrors.expiry = "Use MM/YY format";
      }

      if (!/^[0-9]{3}$/.test(form.cvv)) {
        nextErrors.cvv = "Enter a valid 3-digit CVV";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    return parsedAmount;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsedAmount = validateForm();

    if (!parsedAmount) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        amount: parsedAmount,
        payment_method: selectedMethod,
      };

      if (flowConfig.requiresMobile) {
        payload.mobile = form.mobile.trim();
      }

      const response = await API.post(flowConfig.endpoint, payload);

      if (response.data?.user) {
        updateUser(response.data.user);
      } else if (activeFlow === "add-money" && !token) {
        updateUser({
          ...user,
          balance: walletBalance + parsedAmount,
        });
      }

      const successMessage = buildSuccessMessage(
        activeFlow,
        parsedAmount,
        form.mobile.trim(),
        methodConfig.label,
      );

      setToast({
        message: successMessage,
        type: "success",
      });
      setPopup({
        title: flowConfig.successTitle,
        message: successMessage,
      });
      setForm(createEmptyForm());
    } catch (error) {
      setToast({
        message:
          error.response?.data?.error || "Payment could not be completed.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="payments-header">
        <div>
          <p className="payments-kicker">Card and UPI Checkout</p>
          <h2>{flowConfig.title}</h2>
          <p className="payments-subtitle">{flowConfig.description}</p>
        </div>
        <div className="payments-balance-pill">
          <span>Wallet Balance</span>
          <strong>{formatCurrency(walletBalance)}</strong>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="payments-layout">
        <section className="payments-main-card">
          <div className="payments-flow-tabs">
            {Object.entries(FLOW_CONFIG).map(([flowKey, config]) => (
              <button
                key={flowKey}
                type="button"
                className={`payments-flow-tab ${activeFlow === flowKey ? "active" : ""}`}
                onClick={() => handleFlowChange(flowKey)}
              >
                <span>{config.title}</span>
                <small>
                  Up to{" "}
                  {formatCurrency(config.maxAmount, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </small>
              </button>
            ))}
          </div>

          <form className="payments-form" onSubmit={handleSubmit}>
            <div className="payments-quick-grid">
              {flowConfig.quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`payments-quick-amount ${form.amount === amount.toString() ? "active" : ""}`}
                  onClick={() => handleFieldChange("amount", amount.toString())}
                >
                  {formatCurrency(amount, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </button>
              ))}
            </div>

            {flowConfig.requiresMobile && (
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  value={form.mobile}
                  onChange={(event) =>
                    handleFieldChange(
                      "mobile",
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                />
                {errors.mobile && <p className="error-text">{errors.mobile}</p>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min={flowConfig.minAmount}
                max={flowConfig.maxAmount}
                value={form.amount}
                onChange={(event) => handleFieldChange("amount", event.target.value)}
              />
              {errors.amount && <p className="error-text">{errors.amount}</p>}
            </div>

            <div className="payments-methods">
              <div className="payments-section-heading">
                <h3>Select Payment Method</h3>
                <p>Choose debit card, credit card, Google Pay, PhonePe or Paytm.</p>
              </div>

              <div className="payments-method-grid">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    className={`payments-method-option ${selectedMethod === method.id ? "selected" : ""}`}
                    onClick={() => handleMethodChange(method.id)}
                  >
                    <div className="payments-method-top">
                      <strong>{method.label}</strong>
                      <span>{method.badge}</span>
                    </div>
                    <p>{method.caption}</p>
                  </button>
                ))}
              </div>
            </div>

            {methodConfig.category === "card" ? (
              <div className="payments-card-fields">
                <div className="form-group">
                  <label htmlFor="cardName">Card Holder Name</label>
                  <input
                    id="cardName"
                    type="text"
                    placeholder="Name on card"
                    value={form.cardName}
                    onChange={(event) =>
                      handleFieldChange("cardName", event.target.value)
                    }
                  />
                  {errors.cardName && (
                    <p className="error-text">{errors.cardName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(event) =>
                      handleFieldChange(
                        "cardNumber",
                        formatCardNumberInput(event.target.value),
                      )
                    }
                  />
                  {errors.cardNumber && (
                    <p className="error-text">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="payments-card-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiry</label>
                    <input
                      id="expiry"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={(event) =>
                        handleFieldChange(
                          "expiry",
                          formatExpiryInput(event.target.value),
                        )
                      }
                    />
                    {errors.expiry && (
                      <p className="error-text">{errors.expiry}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      maxLength="3"
                      value={form.cvv}
                      onChange={(event) =>
                        handleFieldChange(
                          "cvv",
                          event.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                    />
                    {errors.cvv && <p className="error-text">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="payments-upi-note">
                <strong>{methodConfig.label}</strong>
                <p>
                  Your selected app will be used to approve this payment request
                  securely.
                </p>
              </div>
            )}

            <div className="payments-total-box">
              <div>
                <span>Amount</span>
                <strong>{formatCurrency(currentAmount)}</strong>
              </div>
              <div>
                <span>Payment Method</span>
                <strong>{methodConfig.label}</strong>
              </div>
              <div>
                <span>Wallet After Action</span>
                <strong>{formatCurrency(projectedBalance)}</strong>
              </div>
            </div>

            <button type="submit" className="payments-submit-btn" disabled={loading}>
              {loading ? "Processing..." : `${flowConfig.submitLabel} with ${methodConfig.label}`}
            </button>
          </form>
        </section>

        <aside className="payments-side-panel">
          <div
            className="payments-preview-card"
            style={{
              "--card-start": methodConfig.colors[0],
              "--card-end": methodConfig.colors[1],
            }}
          >
            <div className="payments-preview-top">
              <span>{methodConfig.badge}</span>
              <strong>{methodConfig.label}</strong>
            </div>
            <div className="payments-preview-number">
              {methodConfig.category === "card"
                ? getPreviewCardNumber(form.cardNumber)
                : `${methodConfig.label.toUpperCase()} CHECKOUT`}
            </div>
            <div className="payments-preview-bottom">
              <div>
                <small>{methodConfig.category === "card" ? "Card Holder" : "Payment App"}</small>
                <strong>
                  {methodConfig.category === "card"
                    ? form.cardName || "YOUR NAME"
                    : methodConfig.label}
                </strong>
              </div>
              <div>
                <small>{methodConfig.category === "card" ? "Expiry" : "Service"}</small>
                <strong>
                  {methodConfig.category === "card"
                    ? form.expiry || "MM/YY"
                    : flowConfig.title}
                </strong>
              </div>
            </div>
          </div>

          <div className="payments-insight-card">
            <h3>Checkout Summary</h3>
            <div className="payments-insight-row">
              <span>Selected Service</span>
              <strong>{flowConfig.title}</strong>
            </div>
            <div className="payments-insight-row">
              <span>Selected Method</span>
              <strong>{methodConfig.label}</strong>
            </div>
            <div className="payments-insight-row">
              <span>Processing Fee</span>
              <strong>Free</strong>
            </div>
            <div className="payments-insight-row">
              <span>Current Wallet</span>
              <strong>{formatCurrency(walletBalance)}</strong>
            </div>
            <div className="payments-insight-row total">
              <span>Projected Wallet</span>
              <strong>{formatCurrency(projectedBalance)}</strong>
            </div>
          </div>

          <div className="payments-info-card">
            <h3>Included Options</h3>
            <ul>
              <li>Debit card and credit card checkout</li>
              <li>Google Pay, PhonePe and Paytm support</li>
              <li>One page flow for add money, send money and recharge</li>
              <li>Transaction method is saved with the payment record</li>
            </ul>
          </div>
        </aside>
      </div>

      {popup && (
        <div className="popup">
          <div className="popup-card">
            <h2>{popup.title}</h2>
            <p>{popup.message}</p>
            <button onClick={() => setPopup(null)} type="button">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
