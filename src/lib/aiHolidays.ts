// AI-powered holiday lookup service
// This can be used with various AI APIs (OpenAI, Anthropic, Gemini, etc.)

import { parseHolidayDate } from './dateUtils';

export interface AIHolidayRequest {
  city: string;
  state?: string;
  country: string;
  year: number;
}

export interface AIHolidayResponse {
  holidays: {
    date: string;
    name: string;
    type: 'national' | 'state' | 'city';
    description?: string;
  }[];
  source: string;
  lastUpdated: string;
}

// Example implementation with a generic AI API
// Note: This would require API keys and proper error handling in production
export const getHolidaysFromAI = async (request: AIHolidayRequest): Promise<AIHolidayResponse | null> => {
  try {
    // This is a template for AI integration
    // You would need to implement with your preferred AI service:
    // - OpenAI GPT API
    // - Google Gemini API
    // - Anthropic Claude API
    // - Or any other AI service

    const prompt = `
      Por favor, forneça os feriados municipais oficiais e pontos facultativos para ${request.city}${request.state ? ', ' + request.state : ''}, ${request.country} em ${request.year}.
      
      Inclua apenas:
      1. Feriados municipais específicos da cidade
      2. Feriados estaduais se aplicável
      3. Datas exatas no formato YYYY-MM-DD
      4. Nomes oficiais dos feriados em português
      5. Tipo de feriado (city para municipal, state para estadual)
      
      Retorne apenas feriados oficiais, não datas comemorativas.
      
      Formato JSON exato:
      {
        "holidays": [
          {"date": "YYYY-MM-DD", "name": "Nome do Feriado", "type": "city"}
        ]
      }
      
      Responda apenas com o JSON, sem texto adicional.
    `;

    // For now, we'll use the Gemini API implementation
    // You can replace this with other AI services
    const response = await callGeminiAPI(prompt);
    return parseAIResponse(response);

  } catch (error) {
    console.error('AI holiday lookup failed:', error);
    return null;
  }
};

// Implementation for Gemini API call
const callGeminiAPI = async (prompt: string): Promise<any> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 10,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  return await response.json();
};

// Parse AI response to extract holiday data
const parseAIResponse = (response: any): AIHolidayResponse | null => {
  try {
    const content = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content received from AI API');
    }

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const holidayData = JSON.parse(jsonMatch[0]);

    return {
      holidays: holidayData.holidays || [],
      source: 'AI Generated',
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
};

// Cache for AI responses to avoid repeated calls
const aiHolidayCache = new Map<string, AIHolidayResponse>();

export const getCachedAIHolidays = async (request: AIHolidayRequest): Promise<AIHolidayResponse | null> => {
  const cacheKey = `${request.city.toLowerCase()}-${request.state?.toLowerCase() || 'none'}-${request.country.toLowerCase()}-${request.year}`;
  
  console.log(`[AI Cache] Checking cache for key: ${cacheKey}`);
  
  if (aiHolidayCache.has(cacheKey)) {
    console.log(`[AI Cache] Cache hit for ${cacheKey}`);
    return aiHolidayCache.get(cacheKey)!;
  }
  
  console.log(`[AI Cache] Cache miss for ${cacheKey}, fetching from AI...`);
  const result = await getHolidaysFromAI(request);
  if (result) {
    aiHolidayCache.set(cacheKey, result);
    console.log(`[AI Cache] Cached result for ${cacheKey}:`, result);
  }
  
  return result;
};

// Helper function to integrate AI holidays with existing system
export const enhanceHolidaysWithAI = async (
  baseHolidays: any[],
  city: string,
  year: number
): Promise<any[]> => {
  try {
    // Determine state based on city
    let state = undefined;
    if (city.toLowerCase() === 'salvador') {
      state = 'Bahia';
    } else if (city.toLowerCase() === 'rio-de-janeiro' || city.toLowerCase() === 'rio') {
      state = 'Rio de Janeiro';
    } else if (city.toLowerCase() === 'sao-paulo' || city.toLowerCase() === 'sp') {
      state = 'São Paulo';
    }
    
    console.log(`[AI Enhancement] Enhancing holidays for ${city} (${state}) in ${year}`);
    
    const aiResult = await getCachedAIHolidays({
      city,
      state,
      country: 'Brazil',
      year
    });
    
    if (aiResult?.holidays) {
      console.log(`[AI Enhancement] Got ${aiResult.holidays.length} AI holidays`);
      // Merge AI holidays with base holidays, avoiding duplicates
      const aiHolidays = aiResult.holidays.map(h => ({
        date: h.date,
        name: h.name,
        type: h.type,
        dateObject: parseHolidayDate(h.date)
      }));

      // Filter out duplicates based on date
      const existingDates = new Set(baseHolidays.map(h => h.date));
      const newHolidays = aiHolidays.filter(h => !existingDates.has(h.date));

      console.log(`[AI Enhancement] Adding ${newHolidays.length} new holidays from AI`);
      return [...baseHolidays, ...newHolidays];
    } else {
      console.log('[AI Enhancement] No AI holidays received');
    }
  } catch (error) {
    console.warn('AI holiday enhancement failed, using base holidays:', error);
  }

  return baseHolidays;
};
