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

export interface IPageVisit {
  eipNo: number;
  timestamp: Date;
}

export interface IAISummary {
  eipNo: number;
  summary: string;
  eipStatus: string;
  timestamp: Date;
}
