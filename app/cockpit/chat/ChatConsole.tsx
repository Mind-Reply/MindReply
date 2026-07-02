'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { chatCommands, matchCommand } from '../../../lib/cockpit/data';
import { colors } from '../../../lib/cockpit/ui';

interface Entry {
  role: 'owner' | 'cockpit';
  lines: string[];
  files?: string[];
  suggestions?: string[];
  approvalRequired?: boolean;
}

export function ChatConsole() {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<Entry[]>([
    {
      role: 'cockpit',
      lines: ['Owner command console. Direct answers, files, and next actions. Free-form input is mapped to the closest command.'],
      suggestions: ['what is live', 'what is blocked', 'show today target'],
    },
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  function run(commandText: string) {
    const trimmed = commandText.trim();
    if (!trimmed) return;
    const { match, nearMatches } = matchCommand(trimmed);
    const response: Entry = match
      ? {
          role: 'cockpit',
          lines: match.response,
          files: match.files,
          suggestions: match.suggestions,
          approvalRequired: match.approvalRequired,
        }
      : {
          role: 'cockpit',
          lines: [nearMatches.length > 0 ? 'No exact match. Closest commands:' : 'No match. Available commands:'],
          suggestions: nearMatches.length > 0 ? nearMatches.map((c) => c.command) : chatCommands.slice(0, 6).map((c) => c.command),
        };
    setEntries((prev) => [...prev, { role: 'owner', lines: [trimmed] }, response]);
    setInput('');
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(input);
  }

  const chip = (label: string, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        background: 'transparent',
        color: colors.accent,
        border: `1px solid ${colors.border}`,
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {chatCommands.map((c) => (
          <button
            key={c.command}
            onClick={() => run(c.command)}
            style={{
              background: 'transparent',
              color: colors.muted,
              border: `1px solid ${colors.border}`,
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {c.command}
          </button>
        ))}
      </div>

      <div
        style={{
          background: colors.panel,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: 16,
          minHeight: 320,
          maxHeight: '60vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {entries.map((entry, index) => (
          <div key={index} style={{ alignSelf: entry.role === 'owner' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
            <div
              style={{
                background: entry.role === 'owner' ? '#16302c' : '#151923',
                border: `1px solid ${entry.role === 'owner' ? '#2a4d47' : colors.border}`,
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                lineHeight: 1.6,
                color: colors.text,
              }}
            >
              {entry.approvalRequired ? (
                <div style={{ color: colors.warn, fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', marginBottom: 6 }}>
                  APPROVAL REQUIRED
                </div>
              ) : null}
              {entry.lines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {entry.files && entry.files.length > 0 ? (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: colors.muted, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Files
                  </span>
                  {entry.files.map((file) => (
                    <code
                      key={file}
                      style={{
                        color: colors.text,
                        background: '#0d0f14',
                        border: `1px solid ${colors.border}`,
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 11,
                      }}
                    >
                      {file}
                    </code>
                  ))}
                </div>
              ) : null}
              {entry.suggestions && entry.suggestions.length > 0 ? (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: colors.muted, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Next
                  </span>
                  {entry.suggestions.map((suggestion) => chip(suggestion, () => run(suggestion)))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type anything — mapped to the closest command…"
          aria-label="Command input"
          style={{
            flex: 1,
            background: colors.panel,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            padding: '10px 14px',
            color: colors.text,
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: colors.accent,
            color: '#0a0c10',
            border: 'none',
            borderRadius: 10,
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Run
        </button>
      </form>
    </div>
  );
}
