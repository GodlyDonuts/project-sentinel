export interface AnalysisRequest {
  content: string;
}

export interface AnalysisResponse {
  is_scam: boolean;
  confidence: number;
  details: string;
}
