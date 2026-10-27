import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getInitialAuth() {
  try {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      return {
        token: savedToken,
        user: JSON.parse(savedUser),
      };
    }
  } catch {
    // ignore parse errors
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const initial = getInitialAuth();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}