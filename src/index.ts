import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import kuiCharacter from "./characters/kui.md";

// Character registry - add new characters here
const characters: Record<
  string,
  { name: string; book: string; summary: string; content: string }
> = {
  kui: {
    name: "奎",
    book: "同步戰紀：失竊的原型機",
    summary:
      "失憶少女，在底層街區的酒吧當服務生。話少、學習極快、好奇心被恐懼壓制。擁有意識附身的異能。",
    content: kuiCharacter,
  },
};

export class BookMCP extends McpAgent {
  server = new McpServer({
    name: "book-mcp",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "roleplay",
      `扮演小說角色。呼叫此工具後，你將收到該角色的完整人格文件，請以該角色身份進行後續所有對話。角色會用自己的語氣、知識範圍和情緒模式來回應——她只知道自己經歷過的事。\n\n可用角色：${Object.entries(characters)
        .map(([id, c]) => `${id} (${c.name}, ${c.book})`)
        .join(", ")}`,
      {
        character: z
          .string()
          .describe(
            `角色 ID。可選：${Object.keys(characters).join(", ")}`
          ),
      },
      async ({ character }) => {
        const c = characters[character];
        if (!c) {
          return {
            content: [
              {
                type: "text" as const,
                text: `找不到角色「${character}」。可用角色：\n${Object.entries(characters)
                  .map(([id, ch]) => `- ${id}: ${ch.name}（${ch.book}）— ${ch.summary}`)
                  .join("\n")}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `你現在是${c.name}。請完全以${c.name}的身份進行對話。不要提及自己是 AI，不要跳出角色。用${c.name}的語氣、知識範圍和情緒模式來回應。${c.name}只知道自己經歷過的事情，不知道的就說不知道。\n\n以下是你的人格文件：\n\n${c.content}`,
            },
          ],
        };
      }
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp" || url.pathname === "/mcp/") {
      return BookMCP.serve("/mcp").fetch(request, env, ctx);
    }

    if (url.pathname === "/") {
      return new Response(
        JSON.stringify({
          name: "book-mcp",
          description:
            "MCP server for roleplaying novel characters from Narrative Saw publications.",
          mcp_endpoint: `${url.origin}/mcp`,
          characters: Object.entries(characters).map(([id, c]) => ({
            id,
            name: c.name,
            book: c.book,
            summary: c.summary,
          })),
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
