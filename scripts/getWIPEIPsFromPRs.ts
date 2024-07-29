import { config } from "dotenv";
config({ path: ".env.local" });

import axios from "axios";
import { convertMetadataToJson, extractMetadata } from "@/utils";
import { ValidEIPs } from "@/types";

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { updateFileData } from "./fetchValidEIPs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
};

async function getOpenPRNumbers(
  orgName: string,
  repo: string
): Promise<Array<number>> {
  console.log(`Fetching open PRs for ${orgName}/${repo}...`);
  try {
    const apiUrl = `https://api.github.com/repos/${orgName}/${repo}/pulls?state=open`;
    const response = await axios.get(apiUrl, { headers });
    const openPRs = response.data;

    const prNumbers = openPRs.map((pr: { number: number }) => pr.number);
    return prNumbers;
  } catch (error) {
    console.error(`Failed to fetch open PRs: ${error}`);
    return [];
  }
}

async function getPRData(orgName: string, prNumber: number, repo: string) {
  // Define the GitHub API endpoint for the PR
  const apiUrl = `https://api.github.com/repos/${orgName}/${repo}/pulls/${prNumber}`;

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

async function getEIPNoFromDiff(
  diffUrl: string,
  folderName: string,
  filePrefix: string
) {
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

        if (filePath.includes(`${folderName}/`)) {
          eipNumber = extractEIPNumber(filePath, folderName, filePrefix);
        }
      }
    });

    return eipNumber;
  } catch (error) {
    console.error(`Failed to fetch or parse diff: ${error}`);
    return 0;
  }
}

function extractEIPNumber(
  filePath: string,
  folderName: string,
  filePrefix: string
) {
  // Define the regular expression to match the EIP number
  const regex = new RegExp(`b/${folderName}/${filePrefix}-(\\d+)\\.md`);
  const match = filePath.match(regex);

  if (match && match[1]) {
    // Return the extracted number as an integer
    return parseInt(match[1]);
  } else {
    // Return null if no match is found
    return 0;
  }
}

const fetchDataFromOpenPRs = async ({
  orgName,
  repo,
  folderName,
  filePrefix,
  isERC,
}: {
  orgName: string;
  repo: string;
  folderName: string;
  filePrefix: string;
  isERC?: boolean;
}) => {
  const prNumbers = await getOpenPRNumbers(orgName, repo);

  const result: ValidEIPs = {};

  // loop through each PR and get the diff URL
  // future: _.chunk incase gh rate limits
  await Promise.all(
    prNumbers.map(async (prNo) => {
      const prData = await getPRData(orgName, prNo, repo);
      if (!prData) return;
      const { diffUrl, repoOwnerAndName, branchName } = prData;
      const eipNo = await getEIPNoFromDiff(diffUrl, folderName, filePrefix);

      if (eipNo > 0) {
        const markdownPath = `https://raw.githubusercontent.com/${repoOwnerAndName}/${branchName}/${folderName}/${filePrefix}-${eipNo}.md`;
        const eipMarkdownRes: string = (await axios.get(markdownPath)).data;
        const { metadata } = extractMetadata(eipMarkdownRes);
        const { title, status } = convertMetadataToJson(metadata);

        console.log(`Found WIP ${filePrefix}: ${eipNo}: ${title}`);

        result[eipNo] = {
          title,
          status,
          isERC,
          prNo,
          markdownPath,
        };
      }
    })
  );

  return result;
};

const updateEIPData = async () => {
  const resOpenEIPs = await fetchDataFromOpenPRs({
    orgName: "ethereum",
    repo: "EIPs",
    folderName: "EIPS",
    filePrefix: "eip",
  });
  const resOpenERCs = await fetchDataFromOpenPRs({
    orgName: "ethereum",
    repo: "ERCs",
    folderName: "ERCS",
    filePrefix: "erc",
    isERC: true,
  });
  const result = { ...resOpenEIPs, ...resOpenERCs };

  updateFileData(result, "valid-eips.json");
};

const updateRIPData = async () => {
  const resOpenRIPs = await fetchDataFromOpenPRs({
    orgName: "ethereum",
    repo: "RIPs",
    folderName: "RIPS",
    filePrefix: "rip",
  });

  updateFileData(resOpenRIPs, "valid-rips.json");
};

const updateCAIPData = async () => {
  const resOpenCAIPs = await fetchDataFromOpenPRs({
    orgName: "ChainAgnostic",
    repo: "CAIPs",
    folderName: "CAIPs",
    filePrefix: "caip",
  });

  updateFileData(resOpenCAIPs, "valid-caips.json");
};

const main = async () => {
  updateEIPData();
  updateRIPData();
  updateCAIPData();
};

main();
