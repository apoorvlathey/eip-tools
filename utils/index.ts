export const extractEipNumber = (eipOrNo: string): string => {
  const match = eipOrNo.match(/^eip-(\d+)(?:\.md)?$|^(\d+)$/);
  if (match) {
    return match[1] || match[2];
  } else {
    throw new Error("Invalid EIP format");
  }
};

export const extractEIPTitle = (markdown: string): string => {
  const match = markdown.match(/^---[\s\S]*?title:\s*(.*?)[\r\n]/);
  return match ? match[1].trim() : "Unknown Title";
};
