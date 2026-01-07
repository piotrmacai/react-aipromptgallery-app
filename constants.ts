export const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN;
export const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Mocking process.env for the SDK requirements
// @ts-ignore
if (typeof window !== 'undefined') {
  window.process = {
    env: {
      API_KEY: GEMINI_API_KEY
    }
  } as any;
}


export const NOTION_API_URL = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
export const CORS_PROXY = 'https://corsproxy.io/?';

export const CACHE_KEY = 'ainsider_gallery_data';
export const CACHE_DURATION_MS = 360 * 60 * 1000; // 360 minutes

export enum AppRoutes {
  GALLERY = '/',
  ASSISTANT = '/assistant'
}
