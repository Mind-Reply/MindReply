'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { CampaignResponse } from '../../../lib/campaign-studio';

const tones = ['Professional', 'Bold', 'Premium', 'Friendly', 'Playful', 'Minimal', 'Direct', 'Luxury'] as const;
const channels = ['Meta Ads', 'LinkedIn', 'Email', 'Landing Page', 'Google Ads', 'TikTok', 'X', 'YouTube'] as const;
const stages = ['Reading the brief…', 'Drafting the concept…', 'Writing copy angles…', 'Preparing visuals…'];

const defaults = {
  brief: 'Launch a focused campaign for a modern studio that turns a short brief into a publishable launch pack.',
  audience: 'Marketing leads, growth managers, founders, and brand teams that need faster content production.',
  product: 'A campaign studio that creates a concise concept, five copy angles, a launch checklist, and visual direction.',
};

export function CampaignStudioFront() {
  const [brief, setBrief] = useState(defaults.brief);
  const [audience, setAudience] = useState(defaults.audience);
  const [productDetails, setProductDetails] = useState(defaults.product);
  const [tone, setTone] = useState<(typeof tones)[number]>('Professional');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Meta Ads', 'LinkedIn', 'Email']);
  const [result, setResult] = useState<CampaignResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(() => setStageIndex((s) => (s + 1) % stages.length), 1300);
    return () => window.clearInterval(timer);
  }, [loading]);

  const canSubmit = useMemo(() => {
    return brief.trim().length > 10 && audience.trim().length > 10 && productDetails.trim().length > 10 && selectedChannels.length > 0;
  }, [brief, audience, productDetails, selectedChannels]);

  function toggleChannel(channel: string) {
    setSelectedChannels((current) =>
      current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel],
    );
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/campaign-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, audience, productDetails, tone, channels: selectedChannels }),
      });
      const payload = (await response.json()) as CampaignResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Campaign generation failed.');
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_30%),linear-gradient(180deg,_#050816_0%,_#090b1a_60%,_#050816_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
            <Wand2 className="h-3.5 w-3.5" /> Campaign Studio
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Turn a brief into a launch pack with copy, checklist, and visual direction.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 md:text-base">
            Built for teams that need fast campaign production, clear channel angles, and a clean handoff to social, landing pages, and paid media.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <form onSubmit={handleGenerate} className="space-y-5">
              <Field label="Campaign brief" value={brief} onChange={setBrief} rows={4} />
              <Field label="Target audience" value={audience} onChange={setAudience} rows={3} />
              <Field label="Product details" value={productDetails} onChange={setProductDetails} rows={4} />

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as (typeof tones)[number])}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    {tones.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Desired channels</label>
                  <div className="flex flex-wrap gap-2">
                    {channels.map((channel) => {
                      const selected = selectedChannels.includes(channel);
                      return (
                        <button key={channel} type="button" onClick={() => toggleChannel(channel)} className={channelChip(selected)}>
                          {channel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                The client sends only campaign inputs. The server route handles generation and returns structured copy plus visuals.
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
                  canSubmit && !loading ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'cursor-not-allowed bg-white/10 text-white/40',
                )}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate campaign
              </button>
            </form>
          </section>

          <section className="space-y-6">
            {loading ? (
              <Card title="Generating your campaign" subtitle={stages[stageIndex]}>
                <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
              </Card>
            ) : error ? (
              <Card title="Generation failed" subtitle="Check the inputs or server environment variables and try again.">
                <p className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">{error}</p>
              </Card>
            ) : result ? (
              <>
                <Card title="Campaign concept" subtitle={`Text: ${result.models.text} · Visuals: ${result.models.image}`}>
                  <p className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-white/90">{result.concept}</p>
                </Card>

                <Card title="Copy angles" subtitle="Five distinct headline/body combinations.">
                  <div className="grid gap-4">
                    {result.variants.map((variant, index) => (
                      <article key={`${variant.channel}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-cyan-200/70">{variant.channel}</p>
                            <h3 className="mt-1 text-lg font-semibold text-white">{variant.headline}</h3>
                          </div>
                          <button type="button" onClick={() => navigator.clipboard.writeText(`${variant.headline}\n\n${variant.body}`)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
                            Copy
                          </button>
                        </div>
                        <p className="text-sm leading-6 text-white/75">{variant.body}</p>
                      </article>
                    ))}
                  </div>
                </Card>

                <Card title="Launch checklist" subtitle="Use this to prepare the release.">
                  <ol className="space-y-3 text-sm text-white/75">
                    {result.launchChecklist.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <span className="font-semibold text-cyan-300">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </Card>

                <Card title="Image prompts" subtitle="These prompts guide visual exploration.">
                  <div className="space-y-3 text-sm text-white/75">
                    {result.imagePrompts.map((item, index) => (
                      <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="font-medium text-white">Direction {index + 1}</p>
                        <p className="mt-2">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card title="Nothing generated yet" subtitle="Fill in the brief and generate a concept, copy set, checklist, and image direction.">
                <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-white/70">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-cyan-300" />
                  <p className="text-lg font-medium text-white">Campaign output will appear here</p>
                </div>
              </Card>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/80">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      />
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(' ');
}

function channelChip(selected: boolean) {
  return cx(
    'rounded-full border px-3 py-1.5 text-xs font-medium transition',
    selected ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-100' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10',
  );
}
