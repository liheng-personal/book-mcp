declare module "*.md" {
  const content: string;
  export default content;
}

interface Env {
  MCP_OBJECT: DurableObjectNamespace;
}
