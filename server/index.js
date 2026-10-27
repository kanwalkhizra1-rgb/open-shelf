import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { resources } from "./Data/resources.js";
import { users, saveUsers } from "./Data/users.js";

const app = express();
const PORT = 5000;
const SECRET = "openshelf-secret-key";

app.use(cors());
app.use(express.json());

// ========== PUBLIC ROUTES ==========

app.get("/", (req, res) => {
  res.json({ message: "Open Shelf Backend is running" });
});

app.get("/api/resources", (req, res) => {
  res.json(resources);
});

// Register → always creates a normal user
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: "user",
  };

  users.push(newUser);
  saveUsers(); // persist to users.json so the account survives restarts

  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  let isMatch = false;
  if (user.password === password) {
    isMatch = true;
  } else {
    isMatch = await bcrypt.compare(password, user.password);
  }

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const role = user.role || "user";

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role },
    SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email, role },
  });
});

// ========== PROTECTED ROUTES ==========

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// Add resource (admin only)
app.post("/api/resources", authMiddleware, adminMiddleware, (req, res) => {
  const { title, provider, subject, level, type, cost, time, description, url } = req.body;

  if (!title || !provider || !subject) {
    return res.status(400).json({ message: "Title, provider and subject are required" });
  }

  const newResource = {
    id: Date.now().toString(),
    title,
    provider,
    subject,
    level: Number(level) || 1,
    type: type || "Course",
    cost: cost || "Free",
    time: time || "medium",
    description: description || "",
    url: url || "#",
    tags: [],
  };

  resources.push(newResource);

  res.status(201).json({
    message: "Resource added successfully",
    resource: newResource,
  });
});

// Delete resource (admin only)
app.delete("/api/resources/:id", authMiddleware, adminMiddleware, (req, res) => {
  const id = req.params.id;
  const index = resources.findIndex((r) => String(r.id) === String(id));

  if (index === -1) {
    return res.status(404).json({ message: "Resource not found" });
  }

  const removed = resources.splice(index, 1)[0];

  res.json({
    message: "Resource deleted successfully",
    resource: removed,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});