export interface ScamDetectionRequest {
  content: string;
}

export interface ScamDetectionResponse {
  is_scam: boolean;
  confidence: number;
  details: string;
}

export interface VoiceAnalysisResponse {
  transcription: string;
  analysis: ScamDetectionResponse;
}
