import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../constants";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const reverseEngineerImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    // Clean base64 string if it contains the header
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: "Act as an expert AI Art Prompt Engineer. Analyze this image and provide a high-fidelity, detailed text prompt that could be used to generate a similar image using Midjourney or Stable Diffusion. Focus on subject, lighting, style, camera settings, and composition. Format the output as a single, continuous prompt string without introductory text."
          }
        ]
      },
      config: {
        temperature: 0.4,
        maxOutputTokens: 500,
      }
    });

    return response.text || "Could not generate prompt.";
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    throw new Error("Failed to analyze image.");
  }
};