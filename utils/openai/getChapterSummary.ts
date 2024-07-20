import axios from 'axios';

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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  const content = `dame un resumen del capitulo ${chapter} y libro ${book} y sus enseñanzas segun el apostol guillermo maldonado`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content }],
        temperature: 0.7,
        max_tokens: (abstractWordCount + teachingWordCount) * 2, // Aproximación de tokens
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const result = response.data.choices[0].message.content;
    const parsedResult = JSON.parse(result) as SummaryResponse;

    // Asegurarse de que el resumen y las enseñanzas no excedan el límite de palabras
    parsedResult.abstract = limitWords(parsedResult.abstract, abstractWordCount);
    parsedResult.teaching = limitWords(parsedResult.teaching, teachingWordCount);

    return parsedResult;
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

// Ejemplo de uso:
// getChapterSummary('Génesis', 3)
//   .then(summary => console.log(summary))
//   .catch(error => console.error(error));



// Making requests
// You can paste the command below into your terminal to run your first API request. Make sure to replace $OPENAI_API_KEY with your secret API key. If you are using a legacy user key and you have multiple projects, you will also need to specify the Project Id. For improved security, we recommend transitioning to project based keys instead.

// curl https://api.openai.com/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer $OPENAI_API_KEY" \
//   -d '{
//      "model": "gpt-4o-mini",
//      "messages": [{"role": "user", "content": "Say this is a test!"}],
//      "temperature": 0.7
//    }'
// This request queries the gpt-4o-mini model (which under the hood points to a gpt-4o-mini model variant) to complete the text starting with a prompt of "Say this is a test". You should get a response back that resembles the following:

// {
//     "id": "chatcmpl-abc123",
//     "object": "chat.completion",
//     "created": 1677858242,
//     "model": "gpt-4o-mini",
//     "usage": {
//         "prompt_tokens": 13,
//         "completion_tokens": 7,
//         "total_tokens": 20
//     },
//     "choices": [
//         {
//             "message": {
//                 "role": "assistant",
//                 "content": "\n\nThis is a test!"
//             },
//             "logprobs": null,
//             "finish_reason": "stop",
//             "index": 0
//         }
//     ]
// }
// Now that you've generated your first chat completion, let's break down the response object. We can see the finish_reason is stop which means the API returned the full chat completion generated by the model without running into any limits. In the choices list, we only generated a single message but you can set the n parameter to generate multiple messages choices.

// Request body
// model
// string

// Required
// One of the available TTS models: tts-1 or tts-1-hd

// input
// string

// Required
// The text to generate audio for. The maximum length is 4096 characters.

// voice
// string

// Required
// The voice to use when generating the audio. Supported voices are alloy, echo, fable, onyx, nova, and shimmer. Previews of the voices are available in the Text to speech guide.

// response_format
// string

// Optional
// Defaults to mp3
// The format to audio in. Supported formats are mp3, opus, aac, flac, wav, and pcm.

// speed
// number

// Optional
// Defaults to 1
// The speed of the generated audio. Select a value from 0.25 to 4.0. 1.0 is the default.

// Returns
// The audio file content.

// Request body
// file
// file

// Required
// The audio file object (not file name) to transcribe, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.

// model
// string

// Required
// ID of the model to use. Only whisper-1 (which is powered by our open source Whisper V2 model) is currently available.

// language
// string

// Optional
// The language of the input audio. Supplying the input language in ISO-639-1 format will improve accuracy and latency.

// prompt
// string

// Optional
// An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language.

// response_format
// string

// Optional
// Defaults to json
// The format of the transcript output, in one of these options: json, text, srt, verbose_json, or vtt.

// temperature
// number

// Optional
// Defaults to 0
// The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.

// timestamp_granularities[]
// array

// Optional
// Defaults to segment
// The timestamp granularities to populate for this transcription. response_format must be set verbose_json to use timestamp granularities. Either or both of these options are supported: word, or segment. Note: There is no additional latency for segment timestamps, but generating word timestamps incurs additional latency.

// Returns
// The transcription object or a verbose transcription object.


// por favor hasme una funcion que reciba parametros como book = "Genesís" y el chapter = 3

// role = User
// el content= "dame un resumen del capitulo $chapter y libro $book y sus emseñanzas segun el apostol guillermo maldonado"

// no menciones al apostol el tamaño del resumen hazlo de $abstractWordCount = 300 default y $teachingWordCount = 200 default 

// aprovecha que puedes pedir return en json para que me de el siguiente formato

// [{'abstract': ' resumen del capitulo'},{'teaching': ' enseñanzas del capitulo'} ]