import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import { createScamRecord, getScamRecord } from './utils';
import { CreateScamRecordRequest } from './interfaces';

export default class extends Service<Env> {
  async fetch(): Promise<Response> {
    return new Response('Not Implemented', { status: 501 });
  }

  async create(request: CreateScamRecordRequest) {
    return createScamRecord(this.env, request);
  }

  async get(id: string) {
    return getScamRecord(this.env, id);
  }
}