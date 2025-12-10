import { Env } from './raindrop.gen';
import { AnalysisRequest, AnalysisResponse } from './interfaces';

const createPrompt = (content: string): string => {
  return `Is the following text a scam? Respond with only JSON. ${content}`;
};

export async function analyzeContent(
  env: Env,
  request: AnalysisRequest
): Promise<AnalysisResponse> {
  try {
    const result = await env.AI.run('llama-3.1-8b-instant', {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: createPrompt(request.content),
        },
      ],
    });
    return result as unknown as AnalysisResponse;
  } catch {
    // env.logger.error('Error analyzing content', { error });
    throw new Error('Failed to analyze content');
  }
}