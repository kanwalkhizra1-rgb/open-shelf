import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SavedProvider } from "./context/SavedContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SavedProvider>
        <App />
      </SavedProvider>
    </AuthProvider>
  </React.StrictMode>
);