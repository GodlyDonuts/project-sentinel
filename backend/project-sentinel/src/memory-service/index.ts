import { Actor } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import { createMemory, searchMemory } from './utils';
import { CreateMemoryRequest } from './interfaces';

export class MemoryService extends Actor<Env> {
  async fetch(): Promise<Response> {
    return new Response('Not Implemented', { status: 501 });
  }

  async create(request: CreateMemoryRequest) {
    return createMemory(this.env, request);
  }

  async search(query: string) {
    return searchMemory(this.env, query);
  }
}

export default MemoryService;
