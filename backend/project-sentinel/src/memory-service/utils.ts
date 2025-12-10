import { Env } from './raindrop.gen';
import { MemoryRecord, CreateMemoryRequest } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

const createMemoryRecord = (
  request: CreateMemoryRequest
): MemoryRecord => {
  return {
    id: uuidv4(),
    ...request,
    created_at: new Date(),
  };
};

export async function createMemory(
  env: Env,
  request: CreateMemoryRequest
): Promise<MemoryRecord> {
  const newRecord = createMemoryRecord(request);

  try {
    await env.AGENT_MEMORY.putSemanticMemory(
      Object.fromEntries(
        Object.entries(newRecord).map(([key, value]) => [
          key,
          value instanceof Date ? value.toISOString() : value,
        ])
      )
    );
    return newRecord;
  } catch {
    // env.logger.error('Error creating memory', { error });
    throw new Error('Failed to create memory');
  }
}

export async function searchMemory(
  env: Env,
  query: string
): Promise<MemoryRecord[]> {
  try {
    const result = await env.AGENT_MEMORY.searchSemanticMemory(query);
    return (result.documentSearchResponse?.results as MemoryRecord[]) || [];
  } catch {
    // env.logger.error('Error searching memory', { error });
    throw new Error('Failed to search memory');
  }
}