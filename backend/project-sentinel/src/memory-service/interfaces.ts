export interface MemoryRecord {
  id: string;
  content: string;
  created_at: Date;
}

export interface CreateMemoryRequest {
  content: string;
}
