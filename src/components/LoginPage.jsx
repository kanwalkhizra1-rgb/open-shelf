import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Logo() {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="4" y="6" width="6" height="20" rx="1" fill="#FFD84D" />
      <rect x="13" y="6" width="6" height="20" rx="1" fill="#fff" />
      <rect x="22" y="10" width="6" height="16" rx="1" fill="#fff" />
    </svg>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
  };

  const switchMode = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        if (!email.trim()) {
          setError("Please enter your email address.");
          setLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 800));
        setMessage(
          "If an account exists for that email, you will receive password reset instructions shortly. (This is a demo – no email is actually sent yet.)"
        );
        setLoading(false);
        return;
      }

      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }
      }

      const url =
        mode === "register"
          ? "/api/register"
          : "/api/login";

      const body =
        mode === "register"
          ? { name, email, password }
          : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      if (mode === "register") {
        setMessage("Account created successfully! You can now log in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        setName("");
      } else {
        login(data.user, data.token);
      }
    } catch (err) {
      setError(
        "Unable to reach the server. Please make sure the backend is running (npm run server)."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Decorative background elements */}
      <div className="login-bg-elements" aria-hidden="true">
        <div className="bg-book bg-book-1" />
        <div className="bg-book bg-book-2" />
        <div className="bg-book bg-book-3" />
        <div className="bg-shelf bg-shelf-1" />
        <div className="bg-shelf bg-shelf-2" />
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
        <div className="bg-icon bg-icon-1">📖</div>
        <div className="bg-icon bg-icon-2">🎓</div>
        <div className="bg-icon bg-icon-3">💡</div>
        <div className="bg-icon bg-icon-4">📚</div>
        <div className="bg-icon bg-icon-5">🔍</div>
      </div>

      <div className="login-card">
        <div className="login-brand">
          <Logo />
          <div>
            <h1 className="login-title">Open Shelf</h1>
            <p className="login-tagline">Free learning resources, filtered to fit you</p>
          </div>
        </div>

        <h2 className="login-heading">
          {mode === "login" && "Welcome back"}
          {mode === "register" && "Create your account"}
          {mode === "forgot" && "Reset your password"}
        </h2>

        {error && (
          <div className="login-alert login-alert-error" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="login-alert login-alert-success" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "register" && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Your name"
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
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          {mode !== "forgot" && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder={mode === "register" ? "At least 6 characters" : "••••••••"}
              />
            </label>
          )}

          {mode === "register" && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
              />
            </label>
          )}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Log in"
              : mode === "register"
              ? "Create account"
              : "Send reset link"}
          </button>
        </form>

        <div className="login-links">
          {mode === "login" && (
            <>
              <button type="button" className="link-btn" onClick={() => switchMode("forgot")}>
                Forgot password?
              </button>
              <p>
                Don&apos;t have an account?{" "}
                <button type="button" className="link-btn" onClick={() => switchMode("register")}>
                  Register
                </button>
              </p>
            </>
          )}

          {mode === "register" && (
            <p>
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                Log in
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <p>
              Remember your password?{" "}
              <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                Back to login
              </button>
            </p>
          )}
        </div>

        <p className="login-footer-note">
          Supports UN SDG 4 – Quality Education
        </p>
      </div>
    </div>
  );
}