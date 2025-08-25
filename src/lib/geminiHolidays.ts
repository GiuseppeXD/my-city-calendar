// Gemini AI integration for holiday lookup
// This requires a Gemini API key from Google AI Studio (free tier available)

import { AIHolidayRequest, AIHolidayResponse } from './aiHolidays';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const getHolidaysFromGemini = async (request: AIHolidayRequest): Promise<AIHolidayResponse | null> => {
  // You would need to set this in your environment variables
  const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

  if (!API_KEY) {
    console.warn('Gemini API key not configured');
    return null;
  }

  try {
    const prompt = `
      Por favor, forneça os feriados municipais oficiais e pontos facultativos para ${request.city}, ${request.state || 'Brasil'} em ${request.year}.

      Inclua apenas:
      1. Feriados municipais específicos da cidade
      2. Feriados estaduais se aplicável
      3. Datas exatas no formato YYYY-MM-DD
      4. Nomes oficiais dos feriados em português
      5. Tipo de feriado (municipal, estadual)

      Retorne apenas feriados oficiais, não datas comemorativas.
      
      Formato JSON:
      {
        "holidays": [
          {"date": "YYYY-MM-DD", "name": "Nome do Feriado", "type": "city"}
        ]
      }
      
      Responda apenas com o JSON, sem texto adicional.
    `;

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

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    // Try to parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response');
    }

    const holidayData = JSON.parse(jsonMatch[0]);

    return {
      holidays: holidayData.holidays || [],
      source: 'Gemini AI',
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Gemini holiday lookup failed:', error);
    return null;
  }
};

// Example usage function (commented out for now)
/*
export const getSalvadorHolidaysWithGemini = async (year: number) => {
  const aiResult = await getHolidaysFromGemini({
    city: 'Salvador',
    state: 'Bahia',
    country: 'Brasil',
    year
  });
  
  if (aiResult?.holidays) {
    console.log('Holidays from Gemini:', aiResult.holidays);
    return aiResult.holidays.map(h => ({
      date: h.date,
      name: h.name,
      type: h.type,
      dateObject: new Date(h.date)
    }));
  }
  
  return [];
};
*/
