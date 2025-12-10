import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import { analyzeContent } from './utils';
import { AnalysisRequest } from './interfaces';

export default class extends Service<Env> {
  async fetch(): Promise<Response> {
    return new Response('Not Implemented', { status: 501 });
  }

  async analyze(request: AnalysisRequest) {
    return analyzeContent(this.env, request);
  }
}