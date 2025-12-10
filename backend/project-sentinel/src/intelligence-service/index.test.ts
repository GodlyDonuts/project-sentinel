import { describe, it, expect, vi } from 'vitest';
import { analyzeContent } from './utils';
import { Env } from './raindrop.gen';
import { AnalysisRequest } from './interfaces';

describe('Intelligence Service', () => {
  it('should analyze content and return a scam detection result', async () => {
    const mockEnv = {
      AI: {
        run: vi.fn().mockResolvedValue({
          is_scam: true,
          confidence: 0.95,
          details: 'AI analysis details',
        }),
      },
    } as unknown as Env;

    const request: AnalysisRequest = {
      content: 'Test content for scam detection',
    };

    const result = await analyzeContent(mockEnv, request);
    expect(result.is_scam).toBe(true);
  });
});
