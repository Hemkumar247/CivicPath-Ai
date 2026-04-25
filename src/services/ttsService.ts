import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Audio Context to play the PCM buffer returned by the TTS response natively in browser.
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export async function stopPlayback() {
  if (currentSource) {
    try {
      currentSource.stop();
    } catch(e) {}
    currentSource = null;
  }
}

export async function playTTS(text: string, voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' = 'Kore'): Promise<void> {
  // Stop existing playback if firing a new one
  await stopPlayback();
  
  if (!text) return;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      if (!audioCtx) {
        audioCtx = new window.AudioContext({ sampleRate: 24000 });
      } else if (audioCtx.state === 'suspended') {
         await audioCtx.resume();
      }

      // decode base64
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert 16-bit PCM to Float32
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
          float32Data[i] = int16Data[i] / 32768.0;
      }
      
      const buffer = audioCtx.createBuffer(1, float32Data.length, 24000);
      buffer.copyToChannel(float32Data, 0);

      currentSource = audioCtx.createBufferSource();
      currentSource.buffer = buffer;
      currentSource.connect(audioCtx.destination);
      currentSource.start(0);
    }
  } catch (error) {
    console.error("Gemini TTS Error:", error);
  }
}

export async function fetchTopicExplainer(topicId: string, lang: string): Promise<{content: string, ttsPrompt: string}> {
  const cacheKey = `topic_${topicId}_${lang}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch(e) {}

  const languageMap: Record<string, string> = { 'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil' };
  const targetLang = languageMap[lang] || 'English';
  
  let directives = '';
  if (topicId === 'how_conducted') {
    directives = 'Explain step-by-step how general elections are conducted in India (from code of conduct, nomination, voting phases, EVMs, to counting).';
  } else if (topicId === 'authority') {
    directives = 'Explain what the Election Commission of India (ECI) is, its constitutional power (Article 324), independence, and the role of the Chief Election Commissioner.';
  } else {
    directives = 'Explain the importance of the Model Code of Conduct and how citizens can use the cVIGIL app to report violations.';
  }

  const prompt = `You are an engaging voice-over artist and election educator. 
  Task: ${directives}
  
  Write a highly engaging, structured short article (2-3 paragraphs) explaining this for a young first-time voter in India.
  Use ${targetLang} language.
  
  Format the output logically. Also provide a specific plain string version stripped of all markdown specifically designed to be read aloud by a Text-To-Speech engine.
  
  Provide the response in JSON format.
  {
    "content": "The markdown version for reading on screen",
    "ttsPrompt": "The plain text version for reading aloud (e.g., spelled out acronyms, pauses)"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      const cleanJson = response.text.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      try { sessionStorage.setItem(cacheKey, JSON.stringify(parsed)); } catch(e) {}
      return parsed;
    }
    return {content: "Content error.", ttsPrompt: "Error"};
  } catch (error) {
    console.error("Gemini Content Error:", error);
    return {content: "Connection error.", ttsPrompt: ""};
  }
}
