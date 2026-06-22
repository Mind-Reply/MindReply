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
  const [showSettings, setShowSettings] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mindreply.dev';

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  // Check if already authenticated (from localStorage)
  useEffect(() => {
    const savedAdminId = localStorage.getItem('adminId');
    const savedToken = localStorage.getItem('adminToken');
    if (savedAdminId && savedToken) {
      setAdminId(savedAdminId);
      setToken(savedToken);
      setAuthenticated(true);
      loadSessions(savedAdminId, savedToken);
    }
  }, []);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/admin/auth/login`, {
        email,
        password,
      });

      const newAdminId = response.data.adminId;
      const newToken = response.data.token;

      localStorage.setItem('adminId', newAdminId);
      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminEmail', response.data.email);

      setAdminId(newAdminId);
      setToken(newToken);
      setAuthenticated(true);
      loadSessions(newAdminId, newToken);
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setAuthenticated(false);
    setAdminId('');
    setToken('');
    setSessions([]);
    setCurrentSession(null);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-blue-600">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm mt-2">Secure Private Access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200"
              >
                {loading ? 'Logging in...' : 'Secure Login'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">🔐 Security:</span> This admin interface uses JWT tokens and IP whitelisting. All access is logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 bg-slate-900">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">💬 Chats</h2>
              <button
                onClick={handleLogout}
                className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
            <p className="text-xs text-slate-400">{localStorage.getItem('adminEmail')}</p>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No chats yet</p>
                <p className="text-slate-500 text-xs mt-2">Create one below</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className={`p-3 rounded-lg cursor-pointer transition transform hover:scale-105 ${
                    currentSession?.id === session.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-semibold truncate text-sm">{session.title}</div>
                  <div className="text-xs opacity-75">{session.messages.length} messages</div>
                </div>
              ))
            )}
          </div>

          {/* Create Session */}
          <div className="p-4 border-t border-slate-700 bg-slate-900 space-y-2">
            <div className="flex gap-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="flex-1 px-2 py-2 bg-slate-700 text-white rounded text-xs"
              >
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="anthropic">Claude 3</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Chat title..."
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 text-white rounded text-xs placeholder-slate-400"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
              />
              <button
                onClick={handleCreateSession}
                disabled={!newSessionTitle.trim() || loading}
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full text-left px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600 transition"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {currentSession ? (
            <>
              {/* Header */}
              <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shadow-md">
                <div>
                  <h1 className="text-xl font-bold text-white">{currentSession.title}</h1>
                  <p className="text-xs text-slate-400">Model: {currentSession.model}</p>
                </div>
                <button
                  onClick={() => handleDeleteSession(currentSession.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                >
                  🗑️ Delete
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
                      className={`max-w-2xl px-5 py-3 rounded-lg shadow-md ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-700 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      {msg.connectorsUsed && msg.connectorsUsed.length > 0 && (
                        <div className="text-xs mt-2 opacity-75 flex gap-1 flex-wrap">
                          {msg.connectorsUsed.map(c => (
                            <span key={c} className="bg-opacity-30 bg-white px-2 py-0.5 rounded">
                              🔗 {c}
                            </span>
                          ))}
                        </div>
                      )}
                      {msg.tokensUsed && (
                        <div className="text-xs mt-2 opacity-50">
                          📊 {msg.tokensUsed} tokens
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="bg-slate-800 border-t border-slate-700 p-4 shadow-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask anything... (AI has access to all connectors)"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg placeholder-slate-400 disabled:opacity-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputMessage.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
                  >
                    {loading ? '↳' : '→'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl text-gray-300 mb-2">No chat selected</p>
                <p className="text-sm text-gray-400">Create a new session to start</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
