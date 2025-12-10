import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import { createApiGateway } from './utils';

export default class extends Service<Env> {
  async fetch(request: Request): Promise<Response> {
    const app = createApiGateway(this.env);
    return app.fetch(request);
  }
}