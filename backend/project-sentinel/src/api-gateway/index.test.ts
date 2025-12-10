import { describe, it, expect, vi } from 'vitest';
import { createApiGateway } from './utils';
import { Env } from './raindrop.gen';
import { ScamDetectionResponse } from './interfaces';

describe('API Gateway', () => {
  it('should return a 404 for an unknown route', async () => {
    const app = createApiGateway({} as Env);
    const res = await app.request('/unknown-route');
    expect(res.status).toBe(404);
  });

  it('should handle scam detection requests', async () => {
    const mockEnv = {
      INTELLIGENCE_SERVICE: {
        analyze: vi.fn().mockResolvedValue({
          is_scam: true,
          confidence: 0.95,
          details: 'Test details',
        }),
      },
    } as unknown as Env;

    const app = createApiGateway(mockEnv);
    const res = await app.request('/v1/scam/detect', {
      method: 'POST',
      body: JSON.stringify({ content: 'Test content' }),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as ScamDetectionResponse;
    expect(json.is_scam).toBe(true);
  });
});