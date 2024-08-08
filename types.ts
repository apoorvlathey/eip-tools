export interface ValidEIPs {
  [eipNo: number]: {
    title: string;
    status?: string;
    isERC?: boolean;
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

export enum EIPType {
  EIP = "EIP",
  RIP = "RIP",
  CAIP = "CAIP",
}

export interface IPageVisit {
  eipNo: number;
  type?: EIPType;
  timestamp: Date;
}

export interface IAISummary {
  eipNo: number;
  summary: string;
  eipStatus: string;
  timestamp: Date;
}

export interface FilteredSuggestion {
  title: string;
  status?: string;
  isERC?: boolean;
  prNo?: number;
  markdownPath: string;
  eipNo: number;
  type: EIPType;
}

export interface SearchSuggestion {
  label: string;
  data: FilteredSuggestion;
}
