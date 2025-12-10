import { Env } from './raindrop.gen';
import {
  VoiceAnalysisRequest,
  VoiceAnalysisResponse,
} from './interfaces';

const transcribeAudio = async (env: Env, audio: Blob) => {
  const buffer = await audio.arrayBuffer();
  const audioData = Array.from(new Uint8Array(buffer));
  return await env.AI.run('whisper', {
    audio: audioData,
    contentType: 'audio/wav',
  });
};

const analyzeTranscription = async (env: Env, text: string) => {
  return await env.INTELLIGENCE_SERVICE.analyze({
    content: text,
  });
};

export async function analyzeVoice(
  env: Env,
  request: VoiceAnalysisRequest
): Promise<VoiceAnalysisResponse> {
  try {
    const transcriptionResult = await transcribeAudio(env, request.audio);
    const analysisResult = await analyzeTranscription(
      env,
      transcriptionResult.text
    );

    return {
      transcription: transcriptionResult.text,
      analysis: analysisResult,
    };
  } catch {
    // env.logger.error('Error analyzing voice', { error });
    throw new Error('Failed to analyze voice');
  }
}
