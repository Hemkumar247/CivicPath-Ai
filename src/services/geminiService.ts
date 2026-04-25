import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function explainElectionJargon(term: string, lang: string = 'en'): Promise<string> {
  const prompt = `Explain the Indian election term "${term}" in exactly one simple, easy-to-understand sentence for a first-time voter in ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Tamil'} language. Limit to 1-2 sentences. Avoid complex legal jargon. If not related to Indian elections, say you don't know it.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text || "I'm sorry, I couldn't find an explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! Trouble connecting to the AI.";
  }
}

export async function findECIForm(situation: string, lang: string = 'en'): Promise<{form: string, link: string, desc: string} | null> {
  const languageMap: Record<string, string> = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
  const targetLang = languageMap[lang] || 'English';
  const prompt = `A user in India asks about their voter registration situation: "${situation}". Which official ECI Form should they fill (e.g. Form 6, Form 6B, Form 7, Form 8)?`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            form: { type: Type.STRING, description: "The exact Form number (e.g. 'Form 6', 'Form 8'). If unknown, return 'Unknown Form'." },
            link: { type: Type.STRING, description: "Official ECI link, usually 'https://voters.eci.gov.in/'" },
            desc: { type: Type.STRING, description: `A 1-sentence friendly explanation of what this form is for, translated in ${targetLang}.` }
          },
          required: ["form", "link", "desc"]
        }
      }
    });
    if (response.text) {
      const cleanJson = response.text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanJson);
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function explainAffidavit(lang: string = 'en'): Promise<string> {
  const languageMap: Record<string, string> = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
  const targetLang = languageMap[lang] || 'English';
  const prompt = `Explain what an Election Affidavit (Form 26) is in Indian elections, and why checking a candidate's criminal records, education, and assets matters to a first-time voter before they vote. Keep it under 3 short sentences, informative, engaging, and in ${targetLang} language.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text || "Cannot retrieve explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI.";
  }
}

export async function extractVoterIDInfo(base64Image: string): Promise<{name: string, epic: string, dob: string, address: string} | null> {
  const prompt = `Extract the Indian Voter ID card details from this image. If it is NOT a Voter ID card, just return mock placeholder data typical of an Indian Voter ID.`;
  
  // Extract mime type and base64 data from "data:image/jpeg;base64,/9j/4AAQSkZ..."
  const match = base64Image.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) return null;
  const mimeType = match[1];
  const data = match[2];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        prompt,
        {
          inlineData: { data, mimeType }
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The full name of the elector" },
            epic: { type: Type.STRING, description: "The EPIC number (e.g., ABC1234567)" },
            dob: { type: Type.STRING, description: "Date of Birth or Age" },
            address: { type: Type.STRING, description: "Full address string" }
          },
          required: ["name", "epic", "dob", "address"]
        }
      }
    });

    if (response.text) {
      const cleanJson = response.text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanJson);
    }
    return null;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
}

export async function getConstituencyFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Reverse geocode these coordinates in India: Latitude ${lat}, Longitude ${lng}. What is the primary city, district, or Lok Sabha constituency for this location? Respond with ONLY the plain text name (e.g., "Bangalore South" or "New Delhi"). No extra conversational text.`
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Geocoding Error:", error);
    return "";
  }
}

export async function fetchLocalCandidates(location: string, lang: string = 'en'): Promise<any[]> {
  const languageMap: Record<string, string> = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
  const targetLang = languageMap[lang] || 'English';
  
  const prompt = `You are a factual election data reporter. The user is asking about the Indian constituency/location of "${location}".
  Provide a list of EXACTLY 5 to 8 REAL, LEGITIMATE candidates actively preparing or contesting in the upcoming/latest elections (e.g., 2026 Tamil Nadu Assembly elections or latest Lok Sabha) for this exact location or region. 
  
  CRITICAL RULES:
  1. Do NOT invent fictional names. YOU MUST USE REAL DATA verified from live web search.
  2. Include candidates from DMK (SPA Alliance), AIADMK, INC, PMK, BJP, and explicitly TVK (Tamilaga Vettri Kazhagam - led by actor Vijay) if this location is in Tamil Nadu.
  3. Include at least 1 or 2 prominent INDEPENDENT (IND) candidates.
  
  For each candidate, provide:
  1. Their REAL name.
  2. Their REAL political party.
  3. The official party symbol (give a popular Emoji + Name, e.g. "🪷 Lotus").
  4. 3 key REAL manifesto promises or major campaign talking points.
  5. A valid public image URL to the party flag/logo from Wikipedia/Wikimedia Commons. For Independent candidates, provide an empty string.
  
  Format the response STRICTLY as a JSON array. Translate descriptions into ${targetLang}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Real Candidate Name" },
              party: { type: Type.STRING, description: "Real Party Name/Abbreviation" },
              partySymbol: { type: Type.STRING, description: "Emoji and text of the official party symbol" },
              flagImageUrl: { type: Type.STRING, description: "Raw direct image URL of the party flag from Wikipedia. Empty if independent." },
              promises: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              },
              color: { type: Type.STRING, description: "Accurate hex color code for the party (e.g., #FF9933). Include the #." }
            },
            required: ["name", "party", "partySymbol", "promises", "color", "flagImageUrl"]
          }
        }
      }
    });

    if (response.text) {
      const cleanJson = response.text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanJson);
    }
    return [];
  } catch (error) {
    console.error("Gemini Details Error:", error);
    return [];
  }
}

export async function askElectionDoubt(question: string, lang: string): Promise<string> {
  const languageMap: Record<string, string> = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
  const targetLang = languageMap[lang] || 'English';
  
  const QA_CACHE_KEY = 'civicpath_qa_cache';
  const cacheKey = `${lang}_${question.trim().toLowerCase()}`;
  
  try {
    const cachedStr = sessionStorage.getItem(QA_CACHE_KEY);
    if (cachedStr) {
      const cache = JSON.parse(cachedStr);
      if (cache[cacheKey]) return cache[cacheKey];
    }
  } catch(e) {}

  const prompt = `You are a constitutional expert and legal advisor for Indian Elections.
  The user has a question/doubt: "${question}".
  Answer STRICTLY based on the Constitution of India and the Election Commission of India (ECI) guidelines.
  You MUST use the googleSearch tool to verify recent laws, specific rules, or factual details before answering.
  Do NOT provide incorrect or hallucinatory information. Only use legit, official sources.
  Keep it concise (2-3 paragraphs max) and highly accurate.
  Translate your explanation to ${targetLang}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const resultText = response.text || "Sorry, I couldn't find a legal answer for this at the moment.";
    
    try {
      const cachedStr = sessionStorage.getItem(QA_CACHE_KEY) || '{}';
      const cache = JSON.parse(cachedStr);
      cache[cacheKey] = resultText;
      sessionStorage.setItem(QA_CACHE_KEY, JSON.stringify(cache));
    } catch(e) {}

    return resultText;
  } catch (error) {
    console.error("Gemini QA Error:", error);
    return "Failed to fetch accurate legal data. Please try again.";
  }
}
