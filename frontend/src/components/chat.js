import React, { useState } from "react";

// parser จากตัวอย่างก่อนหน้า
function parseGeneralAIResponse(rawText) {
  const result = {};

  const titleMatch = rawText.match(/###\s*(.+)/);
  if (titleMatch) result.title = titleMatch[1].trim();

  const summaryMatch = rawText.match(/\*\*Summary:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (summaryMatch) result.summary = summaryMatch[1].trim();

  const keyPointsMatch = rawText.match(/\*\*Key points:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (keyPointsMatch) {
    result.keyPoints = keyPointsMatch[1]
      .split(/\n\s*\*\s*/)
      .map(line => line.trim())
      .filter(Boolean);
  }

  const shortExpMatch = rawText.match(/\*\*Short explanation:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (shortExpMatch) result.shortExplanation = shortExpMatch[1].trim();

  const analogyMatch = rawText.match(/\*\*Analogy\/Example:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (analogyMatch) result.analogy = analogyMatch[1].trim();

  const followUpMatch = rawText.match(/\*\*Follow-up:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (followUpMatch) result.followUp = followUpMatch[1].trim();

  const referencesMatch = rawText.match(/\*\*References:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (referencesMatch) {
    result.references = referencesMatch[1]
      .split(/\n\s*\*\s*/)
      .map(line => line.trim())
      .filter(Boolean);
  }

  const metaMatch = rawText.match(/\*\*Meta:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
  if (metaMatch) result.meta = metaMatch[1].trim();

  result.raw = rawText;

  return result;
}

// Component แชท
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // แสดงข้อความ user
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      // เรียก API ของเรา (ตัวอย่าง URL)
      const res = await fetch("http://127.0.0.1:5001/anatomix-c8c63/us-central1/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            uid: "4SnEjXzW5NaZTDkPXJBhEQafenM2", 
            conversationId: "2hjLSrLht6vst2FYdH6C", 
            text: input
        }),
      });
      const data = await res.json();

      // parse response AI
      const parsedAI = parseGeneralAIResponse(data.response);

      setMessages(prev => [...prev, { role: "ai", parsed: parsedAI }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "ai", parsed: { raw: "Error contacting AI." } }]);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Demo Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "400px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "1rem" }}>
            {msg.role === "user" ? (
              <div style={{ textAlign: "right", background: "#DCF8C6", display: "inline-block", padding: "0.5rem 1rem", borderRadius: "10px" }}>
                {msg.text}
              </div>
            ) : (
              <div style={{ textAlign: "left" }}>
                {msg.parsed.title && <h4>{msg.parsed.title}</h4>}
                {msg.parsed.summary && <p><strong>Summary:</strong> {msg.parsed.summary}</p>}
                {msg.parsed.keyPoints && (
                  <div>
                    <strong>Key points:</strong>
                    <ul>
                      {msg.parsed.keyPoints.map((kp, idx) => <li key={idx}>{kp}</li>)}
                    </ul>
                  </div>
                )}
                {msg.parsed.shortExplanation && <p><strong>Short explanation:</strong> {msg.parsed.shortExplanation}</p>}
                {msg.parsed.analogy && <p><strong>Analogy/Example:</strong> {msg.parsed.analogy}</p>}
                {msg.parsed.followUp && <p><strong>Follow-up:</strong> {msg.parsed.followUp}</p>}
                {msg.parsed.references && (
                  <div>
                    <strong>References:</strong>
                    <ul>
                      {msg.parsed.references.map((ref, idx) => <li key={idx}>{ref}</li>)}
                    </ul>
                  </div>
                )}
                {!msg.parsed.title && !msg.parsed.summary && <p>{msg.parsed.raw}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={{ padding: "0.5rem 1rem" }}>Send</button>
      </div>
    </div>
  );
}
