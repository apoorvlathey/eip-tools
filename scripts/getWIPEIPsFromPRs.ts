import { config } from "dotenv";
config({ path: ".env.local" });

import axios from "axios";
import { convertMetadataToJson, extractMetadata } from "@/utils";
import { ValidEIPs } from "@/types";

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
};

async function getOpenPRNumbers(repo: string) {
  console.log(`Fetching open PRs for ${repo}...`);
  try {
    const apiUrl = `https://api.github.com/repos/ethereum/${repo}/pulls?state=open`;
    const response = await axios.get(apiUrl, { headers });
    const openPRs = response.data;

    const prNumbers = openPRs.map((pr: { number: number }) => pr.number);
    return prNumbers;
  } catch (error) {
    console.error(`Failed to fetch open PRs: ${error}`);
    return [];
  }
}

async function getPRData(prNumber: number, repo: string) {
  // Define the GitHub API endpoint for the PR
  const apiUrl = `https://api.github.com/repos/ethereum/${repo}/pulls/${prNumber}`;

  try {
    // Send a GET request to the GitHub API
    const response = await axios.get(apiUrl, { headers });
    const prData = response.data;

    // Extract the branch name and repository URL
    const diffUrl = prData.diff_url;
    const repoOwnerAndName = prData.head.repo.full_name;
    const branchName = prData.head.ref;
    return { diffUrl, repoOwnerAndName, branchName };
  } catch (error) {
    console.error(`Failed to fetch PR details: ${error}`);
  }
}

async function getEIPNoFromDiff(diffUrl: string, isERC: boolean) {
  try {
    // Fetch the diff content
    const response = await axios.get(diffUrl);
    const diffContent = response.data;

    // Split the diff content into lines
    const lines = diffContent.split("\n");

    let eipNumber: number = 0;

    // Parse the diff content to find new files
    lines.forEach((line: string, index: number) => {
      if (line.startsWith("new file mode")) {
        // 3 lines after this should contain the file path
        const filePathLine = lines[index + 3];
        const filePath = filePathLine.split(" ")[1];

        if (!filePath) return;

        if (filePath.includes("EIPS/") || filePath.includes("ERCS/")) {
          eipNumber = extractEIPNumber(filePath, isERC);
        }
      }
    });

    return eipNumber;
  } catch (error) {
    console.error(`Failed to fetch or parse diff: ${error}`);
    return 0;
  }
}

function extractEIPNumber(filePath: string, isERC: boolean) {
  // Define the regular expression to match the EIP number
  let regex = /b\/EIPS\/eip-(\d+)\.md/;
  if (isERC) {
    regex = /b\/ERCS\/erc-(\d+)\.md/;
  }
  const match = filePath.match(regex);

  if (match && match[1]) {
    // Return the extracted number as an integer
    return parseInt(match[1]);
  } else {
    // Return null if no match is found
    return 0;
  }
}

const fetchDataFromOpenPRs = async ({ isERC }: { isERC: boolean }) => {
  const repo = isERC ? "ERCs" : "EIPs";

  const prNumbers = await getOpenPRNumbers(repo);

  const result: ValidEIPs = {};

  // loop through each PR and get the diff URL
  for (const prNumber of prNumbers) {
    const prData = await getPRData(prNumber, repo);
    if (!prData) continue;
    const { diffUrl, repoOwnerAndName, branchName } = prData;
    const eipNo = await getEIPNoFromDiff(diffUrl, isERC);

    if (eipNo > 0) {
      const markdownPath = `https://raw.githubusercontent.com/${repoOwnerAndName}/${branchName}/${
        isERC ? "ERCS" : "EIPS"
      }/${isERC ? "erc" : "eip"}-${eipNo}.md`;
      const eipMarkdownRes: string = await fetch(markdownPath).then(
        (response) => response.text()
      );
      const { metadata } = extractMetadata(eipMarkdownRes);
      const { title, status } = convertMetadataToJson(metadata);

      console.log(`Found WIP ${isERC ? "ERC" : "EIP"}: ${eipNo}: ${title}`);

      result[eipNo] = {
        title,
        status,
        isERC,
        prNo: prNumber,
        markdownPath,
      };
    }
  }

  return result;
};

// TODO: cache the EIPs in a local file to avoid fetching the same EIP data multiple times
const main = async () => {
  const resOpenEIPs = await fetchDataFromOpenPRs({ isERC: false });
  const resOpenERCs = await fetchDataFromOpenPRs({ isERC: true });

  const validEIPs = await fs.promises.readFile(
    path.join(__dirname, "../data/valid-eips.json"),
    "utf-8"
  );
  const validEIPsJSON = JSON.parse(validEIPs);

  const updatedValidEIPs = { ...validEIPsJSON, ...resOpenEIPs, ...resOpenERCs };

  await fs.promises.writeFile(
    path.join(__dirname, "../data/valid-eips.json"),
    JSON.stringify(updatedValidEIPs, null, 2)
  );

  console.log("Successfully added WIP EIPs");
};

main();
