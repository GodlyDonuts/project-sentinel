export interface ScamRecord {
  id: string;
  content: string;
  analysis_result: string;
  source: string;
  created_at: Date;
}

export interface CreateScamRecordRequest {
  content: string;
  analysis_result: string;
  source: string;
}
