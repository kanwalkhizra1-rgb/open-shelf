import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddResourceForm({ onClose, onAdded }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "",
    provider: "",
    subject: "Web development",
    level: 1,
    type: "Course",
    cost: "Free",
    time: "medium",
    description: "",
    url: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add resource");
        return;
      }

      setSuccess("Resource added successfully!");
      onAdded(data.resource);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box" style={{ maxWidth: "500px" }}>
        <button type="button" className="auth-close" onClick={onClose}>
          ×
        </button>
        <h2>Add New Resource</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Title *
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Provider *
            <input name="provider" value={form.provider} onChange={handleChange} required />
          </label>
          <label>
            Subject *
            <select name="subject" value={form.subject} onChange={handleChange}>
              <option>Web development</option>
              <option>Programming</option>
              <option>Data & AI</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>Design & UX</option>
              <option>Study skills</option>
            </select>
          </label>
          <label>
            Level
            <select name="level" value={form.level} onChange={handleChange}>
              <option value="1">Beginner</option>
              <option value="2">Intermediate</option>
              <option value="3">Advanced</option>
            </select>
          </label>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Course</option>
              <option>Interactive</option>
              <option>Video</option>
              <option>Reading</option>
              <option>Practice</option>
              <option>Tool</option>
            </select>
          </label>
          <label>
            Cost
            <select name="cost" value={form.cost} onChange={handleChange}>
              <option>Free</option>
              <option>Free to audit</option>
              <option>Freemium</option>
            </select>
          </label>
          <label>
            Time
            <select name="time" value={form.time} onChange={handleChange}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
          </label>
          <label>
            URL
            <input name="url" value={form.url} onChange={handleChange} />
          </label>
          <button type="submit" className="btn btn-primary">
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}