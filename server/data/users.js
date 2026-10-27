import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");

function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch {
    // file missing or invalid – fall back to default admin
  }
  return [
    {
      id: 1,
      name: "Admin",
      email: "admin@openshelf.com",
      password: "admin123",
      role: "admin",
    },
  ];
}

export let users = loadUsers();

export function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}