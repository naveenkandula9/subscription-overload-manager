import { createContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginRequest, register as registerRequest } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("som_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((response) => setUser(response.user))
      .catch(() => {
        localStorage.removeItem("som_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (response) => {
    localStorage.setItem("som_token", response.token);
    setUser(response.user);
  };

  const login = async (payload) => {
    const response = await loginRequest(payload);
    persistSession(response);
    return response;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    persistSession(response);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("som_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

