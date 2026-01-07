
import { ArtPromptItem } from '../types';
import { NOTION_API_URL, NOTION_TOKEN, CORS_PROXY, CACHE_KEY, CACHE_DURATION_MS } from '../constants';

interface CacheStructure {
  timestamp: number;
  data: ArtPromptItem[];
}

// Helper to slugify text
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)+/g, ''); // Remove leading/trailing hyphens
};

const mapNotionResultToItem = (result: any): ArtPromptItem => {
  const props = result.properties;
  
  const findProp = (name: string, aliases: string[] = []) => {
    const keys = Object.keys(props);
    const key = keys.find(k => k.toLowerCase() === name.toLowerCase()) || 
                keys.find(k => aliases.includes(k));
    return key ? props[key] : undefined;
  };

  const titleProp = findProp('Title', ['Name']);
  const promptProp = findProp('Prompt');
  const categoryProp = findProp('Category');
  const tagsProp = findProp('Tags');
  const imageProp = findProp('Image', ['Cover', 'Img']);

  const getTitle = (p: any) => p?.title?.[0]?.plain_text || 'Untitled';
  const getRichText = (p: any) => p?.rich_text?.map((t: any) => t.plain_text).join('') || '';
  
  const getCategory = (p: any) => {
    if (p?.select) return p.select.name;
    if (p?.multi_select && p.multi_select.length > 0) return p.multi_select[0].name;
    return 'Uncategorized';
  };
  
  const getMultiSelect = (p: any) => p?.multi_select?.map((t: any) => t.name) || [];
  
  let imageUrl = 'https://picsum.photos/400/600';
  
  if (result.cover) {
    if (result.cover.type === 'external') imageUrl = result.cover.external.url;
    else if (result.cover.type === 'file') imageUrl = result.cover.file.url;
  } else if (imageProp?.files?.length > 0) {
     const fileObj = imageProp.files[0];
     imageUrl = fileObj.type === 'external' ? fileObj.external.url : fileObj.file.url;
  }

  const title = getTitle(titleProp);
  const slug = generateSlug(title);

  return {
    id: result.id,
    slug: slug || result.id, // Fallback to ID if title is empty
    title,
    prompt: getRichText(promptProp),
    category: getCategory(categoryProp),
    tags: getMultiSelect(tagsProp),
    imageUrl,
    lastEdited: result.last_edited_time,
  };
};

export const fetchPrompts = async (): Promise<ArtPromptItem[]> => {
  const CURRENT_CACHE_KEY = `${CACHE_KEY}_v5`; // Bump version for new schema (slug)
  
  const cachedRaw = localStorage.getItem(CURRENT_CACHE_KEY);
  if (cachedRaw) {
    try {
      const cached: CacheStructure = JSON.parse(cachedRaw);
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION_MS;
      if (!isExpired) {
        return cached.data;
      }
    } catch (e) {
      localStorage.removeItem(CURRENT_CACHE_KEY);
    }
  }

  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(NOTION_API_URL)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
        sorts: [
          {
            timestamp: 'created_time',
            direction: 'descending',
          },
        ],
      }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Notion API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    
    if (!data.results) {
        throw new Error("Invalid Notion API response: No 'results' array.");
    }

    const items: ArtPromptItem[] = data.results
      .map(mapNotionResultToItem)
      .filter((item: ArtPromptItem) => item.title !== 'Untitled' && item.prompt.length > 0);

    localStorage.setItem(CURRENT_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: items,
    }));

    return items;
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    throw error;
  }
};
