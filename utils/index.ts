export const extractEipNumber = (eipOrNo: string): string => {
  const match = eipOrNo.match(/^eip-(\d+)(?:\.md)?$|^(\d+)$/);
  if (match) {
    return match[1] || match[2];
  } else {
    throw new Error("Invalid EIP format");
  }
};
