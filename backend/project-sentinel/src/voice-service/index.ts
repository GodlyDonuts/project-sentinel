import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import { analyzeVoice } from './utils';
import { VoiceAnalysisRequest } from './interfaces';

export default class extends Service<Env> {
  async fetch(): Promise<Response> {
    return new Response('Not Implemented', { status: 501 });
  }

  async process(request: VoiceAnalysisRequest) {
    return analyzeVoice(this.env, request);
  }
}