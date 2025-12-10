# API Definitions

## POST /v1/scam/detect

### Request Example

```json
{
  "content": "You have won a free car! Click here to claim your prize."
}
```

### Response Example

```json
{
  "is_scam": true,
  "confidence": 0.95,
  "details": "The message uses urgency and promises a free prize, which are common scam tactics."
}
```

### Validation Rules

- `content` (string, required): The text content to be analyzed.

## POST /v1/voice/analyze

### Request Example

- Body: `(binary audio data)`
- Content-Type: `audio/wav`

### Response Example

```json
{
  "transcription": "Hello, this is a message from the IRS...",
  "analysis": {
    "is_scam": true,
    "confidence": 0.88,
    "details": "Impersonation of a government agency is a common scam tactic."
  }
}
```

### Validation Rules

- Request body must be a valid audio file.

## POST /v1/scams

### Request Example

```json
{
  "content": "Another scam message.",
  "source": "email"
}
```

### Response Example

```json
{
  "id": "scam-123",
  "content": "Another scam message.",
  "source": "email",
  "created_at": "2025-11-23T23:26:21.635Z"
}
```

### Validation Rules

- `content` (string, required): The content of the scam.
- `source` (string, optional): The source of the scam.