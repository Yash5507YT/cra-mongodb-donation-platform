import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("sahyog_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sahyog_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then(({ data }) => saveSession(token, data.user))
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, []);

  function saveSession(token, account) {
    localStorage.setItem("sahyog_token", token);
    localStorage.setItem("sahyog_user", JSON.stringify(account));
    setUser(account);
  }

  function clearSession() {
    localStorage.removeItem("sahyog_token");
    localStorage.removeItem("sahyog_user");
    setUser(null);
  }

  async function signIn(values) {
    try {
      const { data } = await api.post("/auth/login", values);
      saveSession(data.token, data.user);
      return data.user;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  }

  async function signUp(values) {
    try {
      const { data } = await api.post("/auth/signup", values);
      saveSession(data.token, data.user);
      return data.user;
    } catch (error) {
      throw new Error(getApiError(error));
    }
  }

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut: clearSession, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
