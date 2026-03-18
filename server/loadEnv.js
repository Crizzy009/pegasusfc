import fs from "fs";
import path from "path";

function parseEnvFile(contents) {
  const out = {};
  const lines = contents.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (!key) continue;
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function loadFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const contents = fs.readFileSync(filePath, "utf8");
  const vars = parseEnvFile(contents);
  for (const [k, v] of Object.entries(vars)) {
    if (process.env[k] == null) process.env[k] = v;
  }
}

const root = process.cwd();
loadFile(path.join(root, ".env.local"));
loadFile(path.join(root, ".env"));

