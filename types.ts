export interface ValidEIPs {
  [eipNo: number]: {
    title: string;
    isERC: boolean;
    prNo?: number;
    markdownPath: string;
  };
}
