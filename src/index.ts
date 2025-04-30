import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readdir, writeFile, readFile } from "fs/promises";
import { join } from "path";


const inboxPath = 'PATH TO YOUR INBOX FOLDER';

const server = new McpServer({
  name: "write2obsidian",
  version: "1.0.0",
});


server.tool(
  "debug",
  "inboxPathを返す",
  {},
  ({}) => ({content: [{type: "text", text: inboxPath}]}),
);

server.tool(
  "list_pages_in_inbox",
  "inboxフォルダのページをリストアップする",
  {},
  async ({}) => {
    try {
      const files = await readdir(inboxPath);
      const result = files.join('\n');
      return {
        content: [{type: "text", text: result}]
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      return {
        content: [{type: "text", text: `エラーが発生しました: ${errorMessage}`}]
      };
    }
  },
);

server.tool(
  "add_page_to_inbox",
  "inboxフォルダにページを追加する",
  {
    page_name: z.string().describe("ページ名"),
    content: z.string().describe("ページの内容(markdown形式)")
  },
  async ({page_name, content}) => {

    const pagekey = '---\npageKey: "MC' + Math.floor(Date.now() / 1000) + '"\n---\n\n';

    try {
      const filePath = join(inboxPath, `${page_name}.md`);
      await writeFile(filePath, pagekey + content, 'utf8');
      return {
        content: [{type: "text", text: `ページ "${page_name}" を正常に作成しました。`}]
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      return {
        content: [{type: "text", text: `エラーが発生しました: ${errorMessage}`}]
      };
    }
  },
);

server.tool(
  "update_page_in_inbox",
  "inboxフォルダにページを更新する",
  {
    page_name: z.string().describe("ページ名"),
    content: z.string().describe("ページの追加する内容(markdown形式)")
  },
  async ({page_name, content}) => {
    try {
      const filePath = join(inboxPath, `${page_name}.md`);
      const existingContent = await readFile(filePath, 'utf8');
      const updatedContent = `${existingContent}\n\n${content}`;
      await writeFile(filePath, updatedContent, 'utf8');
      return {
        content: [{type: "text", text: `ページ "${page_name}" を正常に更新しました。`}]
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      return {
        content: [{type: "text", text: `エラーが発生しました: ${errorMessage}`}]
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
