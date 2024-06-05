import { EipMetadataJson } from "@/types";

export const extractEipNumber = (eipOrNo: string): string => {
  const match = eipOrNo.match(/^eip-(\d+)(?:\.md)?$|^(\d+)$/);
  if (match) {
    return match[1] || match[2];
  } else {
    throw new Error("Invalid EIP format");
  }
};

export const extractMetadata = (text: string) => {
  const regex = /---\n([\s\S]*?)\n---\n([\s\S]*)/;
  const match = text.match(regex);

  if (match) {
    return {
      metadata: match[1],
      markdown: match[2],
    };
  } else {
    return {
      metadata: "",
      markdown: text,
    };
  }
};

export const convertMetadataToJson = (
  metadataText: string
): EipMetadataJson => {
  const lines = metadataText.split("\n");
  const jsonObject: any = {};

  lines.forEach((line) => {
    const [key, value] = line.split(/: (.+)/);
    if (key && value) {
      if (key.trim() === "eip") {
        jsonObject[key.trim()] = parseInt(value.trim());
      } else if (key.trim() === "requires") {
        jsonObject[key.trim()] = value.split(",").map((v) => parseInt(v));
      } else if (key.trim() === "author") {
        jsonObject[key.trim()] = value
          .split(",")
          .map((author: string) => author.trim());
      } else {
        jsonObject[key.trim()] = value.trim();
      }
    }
  });

  return jsonObject as EipMetadataJson;
};

export const EIPStatus: {
  [status: string]: {
    bg: string;
    prefix: string;
    description: string;
  };
} = {
  Draft: {
    bg: "yellow.500",
    prefix: "⚠️",
    description:
      "This EIP is not yet recommended for general use or implementation, as it is subject to normative (breaking) changes.",
  },
  Review: {
    bg: "yellow.500",
    prefix: "⚠️",
    description:
      "This EIP is not yet recommended for general use or implementation, as it is subject to normative (breaking) changes.",
  },
  "Last Call": {
    bg: "green.500",
    prefix: "📢",
    description:
      "This EIP is in the last call for review stage. The authors wish to finalize the EIP and ask you to provide feedback.",
  },
  Final: {
    bg: "green.500",
    prefix: "🎉",
    description: "This EIP has been accepted and implemented.",
  },
  Stagnant: {
    bg: "red.500",
    prefix: "🚧",
    description:
      "This EIP had no activity for at least 6 months. This EIP should not be used.",
  },
  Withdrawn: {
    bg: "red.500",
    prefix: "🛑",
    description: "This EIP has been withdrawn, and should not be used.",
  },
};
