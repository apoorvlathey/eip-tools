import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eipDir = path.join(__dirname, "../submodules/EIPs/EIPS");
const ercDir = path.join(__dirname, "../submodules/ERCs/ERCS");

const listFiles = (dir: string, prefix: string): number[] => {
  const files = fs.readdirSync(dir);
  const numbers: number[] = [];

  files.forEach((file) => {
    const match = file.match(new RegExp(`^${prefix}-(\\d+)\\.md$`));
    if (match) {
      numbers.push(parseInt(match[1], 10));
    }
  });

  return numbers;
};

const eips = listFiles(eipDir, "eip");
const ercs = listFiles(ercDir, "erc");

// Combine and sort the EIPs and ERCs, removing duplicates
const combined = Array.from(new Set([...eips, ...ercs])).sort((a, b) => a - b);

fs.writeFileSync(
  path.join(__dirname, "../data/valid-eips.json"),
  JSON.stringify(combined, null, 2)
);

console.log("EIPs and ERCs listed successfully!");
