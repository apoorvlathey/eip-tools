export interface ValidEIPs {
  [eipNo: number]: {
    title: string;
    status?: string;
    isERC: boolean;
    prNo?: number;
    markdownPath: string;
  };
}

export interface EipMetadataJson {
  eip: number;
  title: string;
  description: string;
  author: string[];
  "discussions-to": string;
  status: string;
  type: string;
  category: string;
  created: string;
  requires: number[];
}
