import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eipDir = path.join(__dirname, "../submodules/EIPs/EIPS");
const ercDir = path.join(__dirname, "../submodules/ERCs/ERCS");

const extractEIPTitle = (markdown: string): string => {
  const match = markdown.match(/^---[\s\S]*?title:\s*(.*?)[\r\n]/);
  return match ? match[1].trim() : "Unknown Title";
};

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

const getEIPDetails = (
  dir: string,
  prefix: string,
  number: number
): { title: string } => {
  const filePath = path.join(dir, `${prefix}-${number}.md`);
  const content = fs.readFileSync(filePath, "utf-8");
  const title = extractEIPTitle(content);
  return { title };
};

const eipNumbers = listFiles(eipDir, "eip");
const ercNumbers = listFiles(ercDir, "erc");

const combinedNumbers = [...eipNumbers, ...ercNumbers].sort((a, b) => a - b);

const result: { [key: number]: { title: string } } = {};

combinedNumbers.forEach((number) => {
  // checking ERC first because duplicates in EIP folder (but without content)
  if (ercNumbers.includes(number)) {
    result[number] = getEIPDetails(ercDir, "erc", number);
  } else if (eipNumbers.includes(number)) {
    result[number] = getEIPDetails(eipDir, "eip", number);
  }
});

fs.writeFileSync(
  path.join(__dirname, "../data/valid-eips.json"),
  JSON.stringify(result, null, 2)
);

console.log("EIPs and ERCs listed successfully!");
