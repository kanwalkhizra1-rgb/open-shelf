import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginForm({ onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const url = isRegister
      ? "/api/register"
      : "/api/login";

    const body = isRegister
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        setMessage("Registered successfully! Please login.");
        setIsRegister(false);
      } else {
        login(data.user, data.token);
        onClose();
      }
    } catch (err) {
      setError("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <button type="button" className="auth-close" onClick={onClose}>
          ×
        </button>
        <h2>{isRegister ? "Create Account" : "Login"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "12px" }}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMessage("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}