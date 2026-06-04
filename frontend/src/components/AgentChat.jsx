import React, { useState } from 'react';

const AgentChat = ({ credits, setCredits }) => {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Good afternoon. I am MRagent. How may I assist your communication objectives today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || credits <= 0) return;
    setLoading(true);
    
    // Call Backend
    try {
      const res = await fetch('http://localhost:5000/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, category: 'restructuring' })
      });
      const data = await res.json();
      
      setMessages([...messages, 
        { role: 'user', text: input },
        { role: 'agent', text: data.response }
      ]);
      setCredits(data.remainingCredits);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-slate-400 text-xs">MRagent is analyzing...</div>}
      </div>
      <div className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your communication challenge..."
          className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading || credits <= 0}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          Send (1 Credit)
        </button>
      </div>
    </div>
  );
};

export default AgentChat;
