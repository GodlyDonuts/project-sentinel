import { describe, it, expect, vi } from 'vitest';
import { createScamRecord, getScamRecord } from './utils';
import { Env } from './raindrop.gen';
import { CreateScamRecordRequest } from './interfaces';

describe('Storage Service', () => {
  it('should create a scam record', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      run: vi.fn().mockResolvedValue({}),
    };
    const mockEnv = {
      SENTINEL_DB: mockDb,
    } as unknown as Env;

    const request: CreateScamRecordRequest = {
      content: 'Test scam content',
      analysis_result: 'Scam',
      source: 'email',
    };

    const result = await createScamRecord(mockEnv, request);
    expect(result).toBeDefined();
  });

  it('should get a scam record', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnThis(),
      bind: vi.fn().mockReturnThis(),
      first: vi.fn().mockResolvedValue({ id: '123' }),
    };
    const mockEnv = {
      SENTINEL_DB: mockDb,
    } as unknown as Env;

    const result = await getScamRecord(mockEnv, '123');
    expect(result).toBeDefined();
    expect(result?.id).toBe('123');
  });
});