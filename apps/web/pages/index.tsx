import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "") + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setOutput(data.reply || "No response");
    } catch (e) {
      setOutput("Backend not connected");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>MindReply</h1>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        style={{ width: "100%" }}
      />

      <button onClick={send} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>

      <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        {output}
      </div>
    </div>
  );
}
