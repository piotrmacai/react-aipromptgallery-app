
export interface NotionProperty {
  id: string;
  type: string;
  [key: string]: any;
}

export interface ArtPromptItem {
  id: string;
  slug: string; // New field for friendly URLs
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  imageUrl: string;
  lastEdited: string;
}

// Updated based on specific user request
export interface ParsedPrompt {
  imageType: string;
  object: string;
  background: string;
  style: string;
  texture: string;
  lighting: string;
  details: string;
  aspectRatio: string;
}

export interface GeminiAnalysisResult {
  prompt: string;
  confidence: number;
}
