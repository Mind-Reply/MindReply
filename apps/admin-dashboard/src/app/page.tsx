'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  tokensUsed?: number;
  connectorsUsed?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  updatedAt: string;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [token, setToken] = useState('');

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-4-turbo');
  const [newSessionTitle, setNewSessionTitle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/admin/auth/login`, {
        email,
        password,
      });

      setAdminId(response.data.adminId);
      setToken(response.data.token);
      setAuthenticated(true);
      loadSessions(response.data.adminId, response.data.token);
    } catch (err: any) {
      alert(`Login failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load sessions
  const loadSessions = async (id: string, tok: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/chat/sessions`, {
        headers: {
          'x-admin-id': id,
          'x-admin-token': tok,
        },
      });

      setSessions(response.data.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  // Create new session
  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/admin/chat/session`,
        { title: newSessionTitle, model },
        {
          headers: {
            'x-admin-id': adminId,
            'x-admin-token': token,
          },
        }
      );

      const newSession = response.data.data;
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
      setNewSessionTitle('');
    } catch (err) {
      console.error('Failed to create session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentSession) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/admin/chat/${currentSession.id}/message`,
        { message: inputMessage, model: currentSession.model },
        {
          headers: {
            'x-admin-id': adminId,
            'x-admin-token': token,
          },
        }
      );

      const updatedSession = {
        ...currentSession,
        messages: [
          ...currentSession.messages,
          response.data.userMessage,
          response.data.assistantMessage,
        ],
      };

      setCurrentSession(updatedSession);
      setInputMessage('');
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Delete this session?')) return;

    try {
      await axios.delete(`${API_URL}/api/admin/chat/${sessionId}`, {
        headers: {
          'x-admin-id': adminId,
          'x-admin-token': token,
        },
      });

      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">
            Admin Dashboard
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            🔒 Secure private access only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Chat Sessions</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setCurrentSession(session)}
                className={`p-3 rounded cursor-pointer transition ${
                  currentSession?.id === session.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                }`}
              >
                <div className="font-semibold truncate">{session.title}</div>
                <div className="text-sm opacity-75">{session.messages.length} messages</div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700 space-y-2">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded text-sm"
            >
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="anthropic">Claude 3 Sonnet</option>
            </select>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New chat title"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 text-white rounded text-sm placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
              />
              <button
                onClick={handleCreateSession}
                disabled={!newSessionTitle.trim() || loading}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {currentSession ? (
            <>
              {/* Header */}
              <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">{currentSession.title}</h1>
                <button
                  onClick={() => handleDeleteSession(currentSession.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentSession.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.connectorsUsed && msg.connectorsUsed.length > 0 && (
                        <div className="text-xs mt-2 opacity-75">
                          🔗 Used: {msg.connectorsUsed.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="bg-slate-800 border-t border-slate-700 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded placeholder-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? '...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-xl mb-4">No chat selected</p>
                <p className="text-sm">Create a new session to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
