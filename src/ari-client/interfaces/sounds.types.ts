export interface Sound {
  id: string;
  text?: string;
  formats: string[];
  language: string;
}

export interface SoundListRequest {
  lang?: string;
  format?: string;
}
