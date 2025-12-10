# Interface Design

## Endpoints

| Method | Path                | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | /v1/scam/detect     | Analyzes content for potential scams. |
| POST   | /v1/voice/analyze   | Analyzes voice data for scams.   |
| GET    | /v1/scams/{id}      | Retrieves a specific scam record. |
| POST   | /v1/scams           | Creates a new scam record.       |

## Authentication

- **Type**: API Key
- **Scope**: `scam:detect`, `voice:analyze`, `scam:read`, `scam:write`

## Error Response Codes

| Code | Meaning             |
| ---- | ------------------- |
| 400  | Bad Request         |
| 401  | Unauthorized        |
| 404  | Not Found           |
| 500  | Internal Server Error |