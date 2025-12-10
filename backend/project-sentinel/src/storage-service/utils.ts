import { Env } from './raindrop.gen';
import {
  ScamRecord,
  CreateScamRecordRequest,
} from './interfaces';
import { v4 as uuidv4 } from 'uuid';

const insertScamRecord = async (
  db: Env['SENTINEL_DB'],
  record: ScamRecord
) => {
  return await db
    .prepare(
      'INSERT INTO Scam (id, content, analysis_result, source, createdAt) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(
      record.id,
      record.content,
      record.analysis_result,
      record.source,
      record.created_at.toISOString()
    )
    .run();
};

export async function createScamRecord(
  env: Env,
  request: CreateScamRecordRequest
): Promise<ScamRecord> {
  const newRecord: ScamRecord = {
    id: uuidv4(),
    ...request,
    created_at: new Date(),
  };

  try {
    await insertScamRecord(env.SENTINEL_DB, newRecord);
    return newRecord;
  } catch {
    // env.logger.error('Error creating scam record', { error });
    throw new Error('Failed to create scam record');
  }
}

export async function getScamRecord(
  env: Env,
  id: string
): Promise<ScamRecord | null> {
  try {
    const result = await env.SENTINEL_DB.prepare(
      'SELECT * FROM Scam WHERE id = ?'
    )
      .bind(id)
      .first();

    return result as ScamRecord | null;
  } catch {
    // env.logger.error('Error getting scam record', { error });
    throw new Error('Failed to get scam record');
  }
}
