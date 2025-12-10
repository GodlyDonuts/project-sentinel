# Database Design

```sql
CREATE TABLE scams (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    analysis_result TEXT,
    source TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_records (
    id TEXT PRIMARY KEY,
    audio_blob BLOB NOT NULL,
    transcription TEXT,
    scam_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(scam_id) REFERENCES scams(id)
);

CREATE INDEX idx_scams_created_at ON scams(created_at);
CREATE INDEX idx_voice_records_created_at ON voice_records(created_at);
```