import { describe, it, expect, vi } from 'vitest';
import { analyzeVoice } from './utils';
import { Env } from './raindrop.gen';
import { VoiceAnalysisRequest } from './interfaces';

describe('Voice Service', () => {
  it('should analyze voice and return a scam detection result', async () => {
    const mockEnv = {
      AI: {
        run: vi.fn().mockResolvedValue({
          text: 'This is a test transcription.',
        }),
      },
      INTELLIGENCE_SERVICE: {
        analyze: vi.fn().mockResolvedValue({
          is_scam: true,
          confidence: 0.95,
          details: 'AI analysis details',
        }),
      },
    } as unknown as Env;

    const request: VoiceAnalysisRequest = {
      audio: new Blob(['test audio']),
    };

    const result = await analyzeVoice(mockEnv, request);
    expect(result.transcription).toBe('This is a test transcription.');
  });
});