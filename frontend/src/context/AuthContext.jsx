import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("agenda_token"));
  const [role, setRole] = useState(localStorage.getItem("agenda_role"));

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("agenda_token", res.data.token);
    localStorage.setItem("agenda_role", res.data.role);

    setToken(res.data.token);
    setRole(res.data.role);

    return res.data.role;
  };

  const logout = () => {
    localStorage.removeItem("agenda_token");
    localStorage.removeItem("agenda_role");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);