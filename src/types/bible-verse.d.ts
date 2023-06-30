export interface BibleVerse {
  text: string;
  reference: string;
  version: string;
  url: string;
}

export interface VerseConfig {
  search?: string;
  version: string;
}
