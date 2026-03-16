import { useEffect, useState } from "react";
import API from "../api";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDate } from "../utils/formatters";
import "../styles/profile.css";

function Profile() {
  const { token, updateUser, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    created_at: user?.created_at || "",
    balance: user?.balance || 0,
  });
  const [stats, setStats] = useState({
    send_transactions: 0,
    recharge_transactions: 0,
    total_sent: 0,
    total_recharged: 0,
  });
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    let isActive = true;

    async function fetchProfile() {
      if (!token) {
        setProfile({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          created_at: user?.created_at || "",
          balance: user?.balance || 0,
        });
        setEditForm({
          name: user?.name || "",
          phone: user?.phone || "",
        });
        setStats({
          send_transactions: 0,
          recharge_transactions: 0,
          total_sent: 0,
          total_recharged: 0,
        });
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isActive) {
          return;
        }

        if (response.data.user) {
          setProfile(response.data.user);
          setEditForm({
            name: response.data.user.name,
            phone: response.data.user.phone || "",
          });
          updateUser(response.data.user);
        }

        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } catch {
        if (isActive) {
          setToast({ message: "Failed to load profile", type: "error" });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isActive = false;
    };
  }, [token, updateUser, user]);

  const handleUpdateProfile = async () => {
    const nextErrors = {};

    if (!editForm.name.trim()) {
      nextErrors.name = "Name is required";
    } else if (editForm.name.trim().length < 3) {
      nextErrors.name = "Name must be at least 3 characters";
    }

    if (editForm.phone && !/^[0-9]{10}$/.test(editForm.phone)) {
      nextErrors.phone = "Phone must be 10 digits";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const updatedProfile = { ...profile, ...editForm };

      if (token) {
        await API.put("/profile", editForm, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setEditing(false);
      setToast({ message: "Profile updated successfully", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "Failed to update profile",
        type: "error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!token) {
      setToast({
        message: "Password settings are not available in guest mode.",
        type: "error",
      });
      return;
    }

    const nextErrors = {};

    if (!passwordForm.old_password) {
      nextErrors.old_password = "Current password is required";
    }

    if (!passwordForm.new_password) {
      nextErrors.new_password = "New password is required";
    } else if (passwordForm.new_password.length < 6) {
      nextErrors.new_password = "Password must be at least 6 characters";
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      nextErrors.confirm_password = "Passwords do not match";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await API.post(
        "/change-password",
        {
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setShowPasswordForm(false);
      setToast({ message: "Password changed successfully", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "Failed to change password",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>My Profile</h2>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="profile-info-header">
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>
            <p className="member-since">
              Member since {formatDate(profile.created_at)}
            </p>
          </div>
          <div className="balance-card">
            <p className="balance-label">Account Balance</p>
            <div className="balance-amount">
              {formatCurrency(profile.balance)}
            </div>
          </div>
          {!token && <button className="logout-btn">Guest Account</button>}
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Money Transferred</h3>
            <div className="stat-value">{formatCurrency(stats.total_sent)}</div>
            <p style={{ color: "#999", marginTop: "10px" }}>
              {stats.send_transactions} transactions
            </p>
          </div>

          <div className="stat-card">
            <h3>Recharges Done</h3>
            <div className="stat-value">
              {formatCurrency(stats.total_recharged)}
            </div>
            <p style={{ color: "#999", marginTop: "10px" }}>
              {stats.recharge_transactions} transactions
            </p>
          </div>

          <div className="stat-card">
            <h3>Total Activity</h3>
            <div className="stat-value">
              {stats.send_transactions + stats.recharge_transactions}
            </div>
            <p style={{ color: "#999", marginTop: "10px" }}>All transactions</p>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Account Details</h3>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => {
                    setEditForm({ ...editForm, name: event.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: "" });
                    }
                  }}
                  style={{ borderColor: errors.name ? "#f44336" : "#e0e0e0" }}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(event) => {
                    setEditForm({ ...editForm, phone: event.target.value });
                    if (errors.phone) {
                      setErrors({ ...errors, phone: "" });
                    }
                  }}
                  maxLength="10"
                  placeholder="10-digit number"
                  style={{ borderColor: errors.phone ? "#f44336" : "#e0e0e0" }}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={handleUpdateProfile}>
                  Save Changes
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setEditForm({
                      name: profile.name,
                      phone: profile.phone || "",
                    });
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{profile.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">
                  {profile.phone || "Not provided"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Joined</span>
                <span className="detail-value">
                  {formatDate(profile.created_at)}
                </span>
              </div>
            </div>
          )}
        </div>

        {token && (
          <div className="profile-section">
            <div className="section-header">
              <h3>Security</h3>
              {!showPasswordForm && (
                <button
                  className="edit-btn"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordForm && (
              <div className="edit-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.old_password}
                    onChange={(event) => {
                      setPasswordForm({
                        ...passwordForm,
                        old_password: event.target.value,
                      });
                      if (errors.old_password) {
                        setErrors({ ...errors, old_password: "" });
                      }
                    }}
                    placeholder="Enter current password"
                    style={{
                      borderColor: errors.old_password ? "#f44336" : "#e0e0e0",
                    }}
                  />
                  {errors.old_password && (
                    <p className="error-text">{errors.old_password}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(event) => {
                      setPasswordForm({
                        ...passwordForm,
                        new_password: event.target.value,
                      });
                      if (errors.new_password) {
                        setErrors({ ...errors, new_password: "" });
                      }
                    }}
                    placeholder="Enter new password"
                    style={{
                      borderColor: errors.new_password ? "#f44336" : "#e0e0e0",
                    }}
                  />
                  {errors.new_password && (
                    <p className="error-text">{errors.new_password}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(event) => {
                      setPasswordForm({
                        ...passwordForm,
                        confirm_password: event.target.value,
                      });
                      if (errors.confirm_password) {
                        setErrors({ ...errors, confirm_password: "" });
                      }
                    }}
                    placeholder="Confirm new password"
                    style={{
                      borderColor: errors.confirm_password
                        ? "#f44336"
                        : "#e0e0e0",
                    }}
                  />
                  {errors.confirm_password && (
                    <p className="error-text">{errors.confirm_password}</p>
                  )}
                </div>

                <div className="form-actions">
                  <button className="save-btn" onClick={handleChangePassword}>
                    Update Password
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        old_password: "",
                        new_password: "",
                        confirm_password: "",
                      });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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

export default Profile;
