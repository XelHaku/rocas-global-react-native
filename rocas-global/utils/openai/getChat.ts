import Constants from 'expo-constants';

export async function getChat(userInput: string): Promise<string> {
  console.log("apikey", Constants.expoConfig);
  const apiKey = process.env.EXPO_PUBLIC_API_URL;

  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  const content = `Responde en español: ${userInput}`;

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
        max_tokens: 1000 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    return result;
  } catch (error) {
    console.error('Error al obtener respuesta del chat:', error);
    throw error;
  }
}