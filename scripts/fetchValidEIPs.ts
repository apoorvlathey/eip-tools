import { ValidEIPs } from "@/types";
import { extractEIPTitle } from "@/utils";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eipDir = path.join(__dirname, "../submodules/EIPs/EIPS");
const ercDir = path.join(__dirname, "../submodules/ERCs/ERCS");

const listFiles = (dir: string, isERC: boolean): number[] => {
  const files = fs.readdirSync(dir);
  const numbers: number[] = [];

  files.forEach((file) => {
    const match = file.match(
      new RegExp(`^${isERC ? "erc" : "eip"}-(\\d+)\\.md$`)
    );
    if (match) {
      numbers.push(parseInt(match[1], 10));
    }
  });

  return numbers;
};

const getEIPTitle = (dir: string, prefix: string, number: number): string => {
  const filePath = path.join(dir, `${prefix}-${number}.md`);
  const content = fs.readFileSync(filePath, "utf-8");
  const title = extractEIPTitle(content);
  return title;
};

const main = async () => {
  const eipNumbers = listFiles(eipDir, false);
  const ercNumbers = listFiles(ercDir, true);

  const combinedNumbers = [...eipNumbers, ...ercNumbers].sort((a, b) => a - b);

  const result: ValidEIPs = {};

  combinedNumbers.forEach((number) => {
    // checking ERC first because duplicates in EIP folder (but without content)
    if (ercNumbers.includes(number)) {
      result[number] = {
        title: getEIPTitle(ercDir, "erc", number),
        isERC: true,
        markdownPath: `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${number}.md`,
      };
    } else if (eipNumbers.includes(number)) {
      result[number] = {
        title: getEIPTitle(eipDir, "eip", number),
        isERC: false,
        markdownPath: `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${number}.md`,
      };
    }
  });

  const validEIPs = await fs.promises.readFile(
    path.join(__dirname, "../data/valid-eips.json"),
    "utf-8"
  );
  const validEIPsJSON = JSON.parse(validEIPs);

  const updatedValidEIPs = { ...validEIPsJSON, ...result };

  await fs.promises.writeFile(
    path.join(__dirname, "../data/valid-eips.json"),
    JSON.stringify(updatedValidEIPs, null, 2)
  );

  console.log("EIPs and ERCs listed successfully!");
};

main();
