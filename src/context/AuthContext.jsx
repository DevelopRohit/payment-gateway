import { useCallback, useEffect, useState } from "react";
import API from "../api";
import { AuthContext } from "./auth-context";

const AUTH_TOKEN_STORAGE_KEY = "token";
const AUTH_USER_STORAGE_KEY = "user";
const GUEST_USER_STORAGE_KEY = "guest-user";

function createGuestUser(userOverrides = {}) {
  const parsedBalance = Number(userOverrides.balance);

  return {
    id: "guest",
    name: userOverrides.name || "Guest User",
    email: userOverrides.email || "guest@payindia.local",
    phone: userOverrides.phone || "",
    balance: Number.isFinite(parsedBalance) ? parsedBalance : 5000,
    created_at: userOverrides.created_at || new Date().toISOString(),
  };
}

function readStoredUser() {
  const savedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function readStoredGuestUser() {
  const savedUser = localStorage.getItem(GUEST_USER_STORAGE_KEY);

  if (!savedUser) {
    return createGuestUser();
  }

  try {
    return createGuestUser(JSON.parse(savedUser));
  } catch {
    localStorage.removeItem(GUEST_USER_STORAGE_KEY);
    return createGuestUser();
  }
}

function clearStoredSession() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "",
  );
  const [user, setUser] = useState(
    () => readStoredUser() || readStoredGuestUser(),
  );
  const [loading, setLoading] = useState(Boolean(token));

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userData));
    localStorage.removeItem(GUEST_USER_STORAGE_KEY);
  }, []);

  const logout = useCallback(() => {
    const guestUser = readStoredGuestUser();

    setUser(guestUser);
    setToken("");
    clearStoredSession();
    localStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(guestUser));
  }, []);

  const updateUser = useCallback(
    (updatedUser) => {
      const nextUser = token ? updatedUser : createGuestUser(updatedUser);

      setUser(nextUser);

      if (token) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(nextUser));
      }
    },
    [token],
  );

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await API.get("/profile");

        if (!isActive) {
          return;
        }

        if (response.data?.user) {
          updateUser(response.data.user);
        }
      } catch {
        if (!isActive) {
          return;
        }

        const guestUser = readStoredGuestUser();

        setUser(guestUser);
        setToken("");
        clearStoredSession();
        localStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(guestUser));
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isActive = false;
    };
  }, [token, updateUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
