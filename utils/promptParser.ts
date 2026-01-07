
import { ParsedPrompt } from '../types';

/**
 * Parses a raw prompt string into a structured JSON object.
 * Uses heuristics to identify image types, subjects, and attributes.
 */
export const parsePrompt = (rawText: string): ParsedPrompt => {
  let text = rawText.trim();
  
  const result: ParsedPrompt = {
    imageType: '',
    object: '',
    background: '',
    style: '',
    texture: '',
    lighting: '',
    details: '',
    aspectRatio: '4:5', // Default
  };

  // 1. Extract Aspect Ratio (--ar X:Y or --aspect X:Y)
  const arRegex = /--(?:ar|aspect)\s+(\d+:\d+)/i;
  const arMatch = text.match(arRegex);
  if (arMatch) {
    result.aspectRatio = arMatch[1];
    text = text.replace(arMatch[0], '').trim();
  }

  // 2. Colon Detection for Explicit Type Definition
  // Example: "Editorial fashion photo: A model walking..."
  // We treat the part before the first colon as Image Type if it's reasonably short (< 60 chars)
  const firstColonIndex = text.indexOf(':');
  if (firstColonIndex > -1 && firstColonIndex < 60) {
    const potentialType = text.substring(0, firstColonIndex).trim();
    const potentialObject = text.substring(firstColonIndex + 1).trim();
    
    // Check if the part before colon looks like a prompt segment (not just "Subject")
    if (potentialType.length > 2) {
      result.imageType = potentialType;
      text = potentialObject; // Continue parsing the rest as the prompt body
    }
  }

  // 3. Split into comma-separated segments for analysis
  let segments = text.split(',').map(s => s.trim()).filter(s => s.length > 0);

  if (segments.length === 0) return result;

  // 4. Analyze the first segment (Main Subject) if Object not already partially processed
  // If we stripped a Type via colon, the first segment of `text` is the Object.
  // If we didn't, we need to check for "Type of Object" pattern.
  
  const firstSeg = segments[0];

  if (result.imageType) {
    // We already found the type (via colon), so the first segment is the Object
    // Check for "in [background]" inside this object segment
    const backgroundSplit = firstSeg.split(/\s+in\s+|\s+at\s+/);
    result.object = backgroundSplit[0];
    if (backgroundSplit.length > 1) {
      result.background = backgroundSplit.slice(1).join(' in ');
    }
  } else {
    // Traditional "Type of Object" parsing
    const typeKeywords = [
      'photograph', 'photo', 'portrait', 'close-up', 'macro shot', 'painting', 
      'oil painting', 'sketch', 'illustration', '3d render', 'render', 
      'digital art', 'concept art', 'cinematic shot', 'editorial'
    ];
    
    const lowerFirst = firstSeg.toLowerCase();
    // Sort keywords by length desc to match "oil painting" before "painting"
    typeKeywords.sort((a, b) => b.length - a.length);
    
    let typeFound = typeKeywords.find(t => lowerFirst.startsWith(t));
    
    if (typeFound) {
      result.imageType = firstSeg.substring(0, typeFound.length); // Keep original casing
      
      // Remove type from the segment to find object
      let remainder = firstSeg.substring(typeFound.length).trim();
      
      // Clean up connectors like "of", "shows", etc.
      if (remainder.toLowerCase().startsWith('of ')) {
        remainder = remainder.substring(3).trim();
      } else if (remainder.startsWith(':')) {
        remainder = remainder.substring(1).trim();
      }
      
      const backgroundSplit = remainder.split(/\s+in\s+|\s+at\s+/);
      result.object = backgroundSplit[0];
      if (backgroundSplit.length > 1) {
        result.background = backgroundSplit.slice(1).join(' in ');
      }
    } else {
      // No recognized type, assume object
      const backgroundSplit = firstSeg.split(/\s+in\s+|\s+at\s+/);
      result.object = backgroundSplit[0];
      if (backgroundSplit.length > 1) {
        result.background = backgroundSplit.slice(1).join(' in ');
      }
    }
  }

  // 5. Analyze remaining segments for attributes
  const styleKeys = ['style', 'aesthetic', 'vibe', 'punk', 'wave', 'core', 'minimalist', 'abstract', 'surreal', 'vintage', 'modern'];
  const lightKeys = ['light', 'lighting', 'shadow', 'glow', 'sun', 'dark', 'bright', 'neon', 'volumetric', 'cinematic'];
  const textureKeys = ['texture', 'skin', 'fabric', 'wood', 'metal', 'smooth', 'rough', 'detailed', 'grain', 'sharp', 'focus'];
  
  const detailsArr: string[] = [];

  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    const lowerSeg = seg.toLowerCase();
    
    if (styleKeys.some(k => lowerSeg.includes(k))) {
      result.style = result.style ? `${result.style}, ${seg}` : seg;
    } else if (lightKeys.some(k => lowerSeg.includes(k))) {
      result.lighting = result.lighting ? `${result.lighting}, ${seg}` : seg;
    } else if (textureKeys.some(k => lowerSeg.includes(k))) {
      result.texture = result.texture ? `${result.texture}, ${seg}` : seg;
    } else {
      detailsArr.push(seg);
    }
  }
  
  result.details = detailsArr.join(', ');

  return result;
};

/**
 * Rebuilds a text prompt from the structured JSON object.
 */
export const constructPrompt = (data: ParsedPrompt): string => {
  const parts: string[] = [];

  // Logic: "ImageType: Object, Background, Attributes..." OR "ImageType of Object in Background, Attributes..."
  // If ImageType is long (likely a sentence), use colon. If short (keyword), use "of".
  
  let core = '';
  
  if (data.imageType) {
    core += data.imageType;
    if (data.imageType.length > 20 || data.imageType.includes(' ')) {
        // Assume complex type, use colon separator style if Object exists
        if (data.object) core += ': ';
    } else {
        // Simple type, use 'of' if object exists
        if (data.object) core += ' of ';
    }
  }
  
  if (data.object) {
    // If no type, object is start. If type added colon, just append. If type added 'of', just append.
    // If type was empty, just object.
    core += data.object;
  }
  
  if (data.background) {
    const bgLower = data.background.toLowerCase();
    if (core) {
        if (bgLower.startsWith('in ') || bgLower.startsWith('at ')) {
            core += ' ' + data.background;
        } else {
            core += ' in ' + data.background;
        }
    } else {
        core += data.background;
    }
  }
  
  if (core) parts.push(core);

  // Append attributes
  if (data.style) parts.push(data.style);
  if (data.lighting) parts.push(data.lighting);
  if (data.texture) parts.push(data.texture);
  if (data.details) parts.push(data.details);

  // Join with commas
  let finalString = parts.join(', ');

  // Append parameters
  if (data.aspectRatio) {
    finalString += ` --ar ${data.aspectRatio}`;
  }

  return finalString;
};
