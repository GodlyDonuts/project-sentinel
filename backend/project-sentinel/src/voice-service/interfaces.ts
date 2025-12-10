export interface VoiceAnalysisRequest {
  audio: Blob;
}

export interface VoiceAnalysisResponse {
  transcription: string;
  analysis: {
    is_scam: boolean;
    confidence: number;
    details: string;
  };
}
