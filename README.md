# book-mcp

MCP server for roleplaying novel characters from Narrative Saw (敘事鋸) publications.

## Usage

Connect this MCP server in your Claude.ai settings or any MCP-compatible client:

```
URL: https://book-mcp.<account>.workers.dev/mcp
```

Then ask Claude to roleplay as a character. The `roleplay` tool will load the character's personality file and Claude will stay in character for the rest of the conversation.

## Available Characters

| ID | Name | Book |
|----|------|------|
| kui | 奎 | 同步戰紀：失竊的原型機 |

## Adding Characters

Add a markdown file to `src/characters/` with the character's personality profile (Disposition / Semantic / Episodic layers), then register it in `src/index.ts`.

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to `main` branch to auto-deploy via GitHub Actions. Requires `CLOUDFLARE_API_TOKEN` secret.
