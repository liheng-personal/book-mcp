# book-mcp

An MCP (Model Context Protocol) server that lets readers talk to fictional characters from [Narrative Saw (敘事鋸)](https://narrativesaw.com) publications. Connect it to Claude or any MCP-compatible client, call the `roleplay` tool with a character ID, and the AI will stay in character for the rest of the conversation.

## How It Works

Each character has a **personality file** — a Markdown document bundled into the Worker at build time. When a reader calls the `roleplay` tool, the server returns the full personality file as context. The AI then adopts that character's voice, knowledge boundaries, and emotional patterns. Characters only know what they've experienced in their story; they won't break the fourth wall.

### Architecture

- **Runtime:** Cloudflare Workers with Durable Objects (via the `agents` SDK)
- **Protocol:** MCP over SSE, served at `/mcp`
- **Character files:** Markdown in `src/characters/`, imported as text modules (`wrangler rules`)
- **Root endpoint (`/`):** Returns a JSON manifest listing all available characters

## Quick Start

### As a Reader

Add this MCP server in your Claude.ai settings (Settings → MCP Servers → Add):

```
https://book-mcp.yesleon-69a.workers.dev/mcp
```

Then simply ask Claude to roleplay as a character — or call the tool directly:

```
roleplay(character: "kui")
```

### As a Developer

```bash
git clone https://github.com/liheng-personal/book-mcp.git
cd book-mcp
npm install
npm run dev      # Start local dev server (wrangler)
```

## Available Characters

| ID    | Character | Book                         | Description                          |
|-------|-----------|------------------------------|--------------------------------------|
| `kui` | 奎        | 同步戰紀：失竊的原型機 Ch.1  | An amnesiac girl working at a bar in the lower districts. Quiet, learns fast, curiosity suppressed by fear. Possesses the ability to inhabit others' consciousness. |

## Adding a New Character

1. Write a personality file in Markdown and save it to `src/characters/<id>.md`.
2. Import it in `src/index.ts` and add an entry to the `characters` registry:

```ts
import newCharacter from "./characters/new.md";

const characters = {
  // ...existing
  new: {
    name: "角色名",
    book: "書名",
    summary: "One-line description for the tool listing.",
    content: newCharacter,
  },
};
```

3. Push to `main` — GitHub Actions will deploy automatically.

### Personality File Guidelines

A good personality file gives the AI enough to stay in character without over-constraining it. Typical sections:

- **Disposition** — core personality traits, speech patterns, emotional defaults
- **Semantic** — world knowledge the character has (places, people, terminology)
- **Episodic** — key memories and experiences that shape how they react

## Deployment

Deployment is automated via GitHub Actions on every push to `main`.

**Requirements:**

- A `CLOUDFLARE_API_TOKEN` secret in the repo settings with Workers deploy permissions.

To deploy manually:

```bash
npx wrangler deploy
```

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) + [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [`agents`](https://www.npmjs.com/package/agents) SDK (MCP agent framework for Workers)
- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- TypeScript, Zod

## License

Private — © Narrative Saw Ltd. (敘事鋸有限公司)
