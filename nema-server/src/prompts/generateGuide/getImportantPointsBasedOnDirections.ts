import { OpenAIApi } from 'openai';

export async function getImportantPointsBasedOnDirections(openai: OpenAIApi, inferedImportantPoints: string, directions: string){
  const prompt = `
  Create a list of 5 most important points from this data. 
  Use DIRECTIONS to decide the most important points from the INFERRED_POINTS. 
  Make sure you: respect the DIRECTIONS
  \n 
  \n
  INFERRED_POINTS: ${inferedImportantPoints}
  \n
  \n
  DIRECTIONS: 
  ${directions}
  `;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 500,
    temperature: 0.1,
    frequency_penalty: 0.7,
    presence_penalty: 0.6,
  });

  const data = response.data.choices[0].text?.trim().split('\n').map((question) => question.replace(/^\d+\.\s*/, ''));
  if (data) {
    const filteredOutput = data.filter((item) => item !== '' && item !== data[0]);
    return filteredOutput;
  }
  throw new Error('Failed to generate important points.');
}
