export async function chatHandler(req: any, res: any) {
  try {
    const { message } = req.body;

    const endpoint = process.env.MCP_ENDPOINT || "https://minssz.app.n8n.cloud/mcp-server/http";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: message,
        source: "mindreply"
      })
    });

    const data = await response.json();

    return res.json({
      reply: data?.output || data?.response || "No response",
      raw: data,
      status: "ok"
    });

  } catch (err: any) {
    console.error('MCP backend error:', err);
    return res.status(502).json({
      reply: "MCP backend error",
      error: String(err),
      status: "error"
    });
  }
}
