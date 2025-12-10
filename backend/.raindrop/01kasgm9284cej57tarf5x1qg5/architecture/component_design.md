# Component Design

## Component Inventory

| Name                | Type      | Visibility |
| ------------------- | --------- | ---------- |
| api-gateway         | service   | public     |
| intelligence-service| service   | private    |
| voice-service       | service   | private    |
| storage-service     | service   | private    |
| memory-service      | actor     | private    |

## Component Responsibilities

- **api-gateway**: Handles incoming API requests, authentication, and routing.
- **intelligence-service**: Analyzes text and other data to detect scams using AI models.
- **voice-service**: Processes voice data, transcribes it, and sends it for analysis.
- **storage-service**: Manages persistent storage of scam records and related data in a SQL database.
- **memory-service**: Manages the agent's memory, including session context and long-term knowledge.

## Inter-component Calls

- `api-gateway` → `intelligence-service.analyze()`
- `api-gateway` → `voice-service.process()`
- `api-gateway` → `storage-service.getScam()`
- `api-gateway` → `storage-service.createScam()`
- `intelligence-service` → `memory-service.search()`
- `voice-service` → `intelligence-service.analyze()`

## File Structure per Component

- **api-gateway**:
  - `index.ts`
  - `interfaces.ts`
  - `utils.ts`
- **intelligence-service**:
  - `index.ts`
  - `interfaces.ts`
  - `utils.ts`
- **voice-service**:
  - `index.ts`
  - `interfaces.ts`
  - `utils.ts`
- **storage-service**:
  - `index.ts`
  - `interfaces.ts`
  - `utils.ts`
- **memory-service**:
  - `index.ts`
  - `interfaces.ts`
  - `utils.ts`
