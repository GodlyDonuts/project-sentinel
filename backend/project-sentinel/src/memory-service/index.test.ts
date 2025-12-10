import { describe, it, expect, vi } from 'vitest';
import { createMemory, searchMemory } from './utils';
import { Env } from './raindrop.gen';
import { CreateMemoryRequest } from './interfaces';

describe('Memory Service', () => {
  it('should create a memory record', async () => {
    const mockMemory = {
      putSemanticMemory: vi.fn().mockResolvedValue({ success: true }),
    };
    const mockEnv = {
      AGENT_MEMORY: mockMemory,
    } as unknown as Env;

    const request: CreateMemoryRequest = {
      content: 'Test memory content',
    };

    const result = await createMemory(mockEnv, request);
    expect(result).toBeDefined();
  });

  it('should search memory', async () => {
    const mockMemory = {
      searchSemanticMemory: vi
        .fn()
        .mockResolvedValue({ success: true, results: [] }),
    };
    const mockEnv = {
      AGENT_MEMORY: mockMemory,
    } as unknown as Env;

    const result = await searchMemory(mockEnv, 'test query');
    expect(result).toBeDefined();
  });
});