
import Constants from 'expo-constants';

interface SummaryResponse {
  abstract: string;
  teaching: string;
}

export async function getChapterSummary(
  book: string,
  chapter: number,
  abstractWordCount: number = 300,
  teachingWordCount: number = 200
): Promise<SummaryResponse> {
  console.log("apikey", Constants.expoConfig);

  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  const bookName = book.replace('.json', '');

  const content = `Dame un resumen del capítulo ${chapter} del libro ${bookName} y sus enseñanzas según el apóstol Guillermo Maldonado. Estructura tu respuesta en dos partes: 1) Resumen y 2) Enseñanzas.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content }],
        temperature: 0.7,
        max_tokens: (abstractWordCount + teachingWordCount) * 2
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Dividir la respuesta en resumen y enseñanzas
    const parts = result.split(/\d\)\s+/);
    const abstract = parts[1] || '';
    const teaching = parts[2] || '';

    const summaryResponse: SummaryResponse = {
      abstract: limitWords(abstract.trim(), abstractWordCount),
      teaching: limitWords(teaching.trim(), teachingWordCount)
    };

    return summaryResponse;
  } catch (error) {
    console.error('Error al obtener el resumen del capítulo:', error);
    throw error;
  }
}

function limitWords(text: string, limit: number): string {
  const words = text.split(' ');
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(' ') + '...';
}