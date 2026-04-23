import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const sourceDir = path.join(rootDir, "storage");
const targetDir = path.join(rootDir, "dist", "storage");

if (!fs.existsSync(sourceDir)) {
  console.log("storage directory not found, skipping copy");
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
console.log(`Storage copied to ${path.relative(rootDir, targetDir)}`);
