'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { CampaignResponse } from '../../../lib/campaign-studio';

const toneOptions = ['Professional', 'Bold', 'Premium', 'Friendly', 'Playful', 'Minimal', 'Direct', 'Luxury'] as const;
const channelOptions = ['Meta Ads', 'LinkedIn', 'Email', 'Landing Page', 'Google Ads', 'TikTok', 'X', 'YouTube'] as const;

const defaultBrief = 'Launch a focused campaign for a new marketing studio that helps teams create campaign concepts faster.';
const defaultAudience = 'Marketing leads, growth managers, and brand teams at SMBs and mid-market companies.';
const defaultProduct = 'A full-stack campaign concept studio that turns a short brief into a concept, copy variants, launch checklist, and visual direction.';

const loadingStages = [
  'Reading the campaign brief…',
  'Drafting the campaign concept…',
  'Writing five copy variants…',
  'Building the launch checklist…',
  'Generating visual direction…',
];

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(' ');
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1000);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function EmptyState() {
  return (
    <Panel title="Nothing generated yet" subtitle="Fill in the brief and generate a concept, copy set, checklist, and image direction.">
      <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-white/70">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-cyan-300" />
        <p className="text-lg font-medium text-white">Campaign output will appear here</p>
        <p className="mt-2 text-sm text-white/60">
          The studio will return a concise campaign concept, five copy variants, a launch checklist, image prompts, and generated images.
        </p>
      </div>
    </Panel>
  );
}

function LoadingState({ stage }: { stage: string }) {
  return (
    <Panel title="Generating your campaign" subtitle="OpenAI is called only from the server route.">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
          <Loader2 className="h-5 w-5 animate-spin" />
          <div>
            <p className="font-medium">{stage}</p>
            <p className="text-sm text-cyan-100/70">Responses API for text, image generation API for visuals.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Panel title="Generation failed" subtitle="Check the inputs or server environment variables and try again.">
      <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">
        <p className="font-medium">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Retry
      </button>
    </Panel>
  );
}

export function CampaignStudioClient() {
  const [brief, setBrief] = useState(defaultBrief);
  const [audience, setAudience] = useState(defaultAudience);
  const [productDetails, setProductDetails] = useState(defaultProduct);
  const [tone, setTone] = useState<(typeof toneOptions)[number]>('Professional');
  const [channels, setChannels] = useState<string[]>(['Meta Ads', 'LinkedIn', 'Email']);
  const [result, setResult] = useState<CampaignResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setStageIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % loadingStages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isLoading]);

  const canSubmit = useMemo(() => {
    return brief.trim().length > 10 && audience.trim().length > 10 && productDetails.trim().length > 10 && channels.length > 0;
  }, [brief, audience, productDetails, channels]);

  function toggleChannel(channel: string) {
    setChannels((current) =>
      current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel],
    );
  }

  async function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/campaign-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, audience, productDetails, tone, channels }),
      });

      const payload = (await response.json()) as CampaignResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || 'Campaign generation failed.');
      }

      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_30%),linear-gradient(180deg,_#050816_0%,_#090b1a_60%,_#050816_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
              <Wand2 className="h-3.5 w-3.5" />
              Campaign Concept Studio
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Generate campaign strategy, copy, checklists, and visual direction in one flow.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 md:text-base">
              Server-side OpenAI calls keep the key off the client. The backend uses the current Responses API for structured campaign output and the image API for generated creative direction.
            </p>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 md:inline-flex">
            Model-aware · production-ready
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Campaign brief" subtitle="Give the studio enough context to create a commercially useful direction.">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Campaign brief</label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Describe the campaign goal, product moment, or business outcome."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Target audience</label>
                <textarea
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Who is this for, and what matters to them?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Product details</label>
                <textarea
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="What is the product, offer, or service?"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as (typeof toneOptions)[number])}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    {toneOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-950">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Desired channels</label>
                  <div className="flex flex-wrap gap-2">
                    {channelOptions.map((channel) => {
                      const selected = channels.includes(channel);
                      return (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => toggleChannel(channel)}
                          className={cx(
                            'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                            selected
                              ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-100'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10',
                          )}
                        >
                          {channel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                <p className="font-medium text-white/85">Boundary</p>
                <p className="mt-1">
                  The client sends only campaign inputs. The API route performs all OpenAI calls on the server and returns structured JSON plus generated image assets.
                </p>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
                  canSubmit && !isLoading
                    ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                    : 'cursor-not-allowed bg-white/10 text-white/40',
                )}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate campaign
              </button>
            </form>
          </Panel>

          <div className="space-y-6">
            {isLoading ? (
              <LoadingState stage={loadingStages[stageIndex]} />
            ) : error ? (
              <ErrorState message={error} onRetry={() => setError(null)} />
            ) : result ? (
              <>
                <Panel title="Campaign concept" subtitle={`Models: ${result.models.text} · ${result.models.image}`}>
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100/80">Core direction</p>
                    <p className="mt-2 text-sm leading-6 text-white/90">{result.concept}</p>
                  </div>
                </Panel>

                <Panel title="Copy variants" subtitle="Five distinct headline/body combinations.">
                  <div className="grid gap-4">
                    {result.variants.map((variant, index) => (
                      <article key={`${variant.channel}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-cyan-200/70">{variant.channel}</p>
                            <h3 className="mt-1 text-lg font-semibold text-white">{variant.headline}</h3>
                          </div>
                          <CopyButton text={`${variant.headline}\n\n${variant.body}`} />
                        </div>
                        <p className="text-sm leading-6 text-white/75">{variant.body}</p>
                      </article>
                    ))}
                  </div>
                </Panel>

                <div className="grid gap-6 md:grid-cols-2">
                  <Panel title="Launch checklist" subtitle="Use this to prepare the campaign release.">
                    <ol className="space-y-3 text-sm text-white/75">
                      {result.launchChecklist.map((item, index) => (
                        <li key={`${item}-${index}`} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <span className="font-semibold text-cyan-300">{index + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </Panel>

                  <Panel title="Image prompts" subtitle="These are the prompts used to create campaign-direction visuals.">
                    <div className="space-y-3 text-sm text-white/75">
                      {result.imagePrompts.map((item, index) => (
                        <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="font-medium text-white">Direction {index + 1}</p>
                            <CopyButton text={item} />
                          </div>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                </div>

                <Panel title="Generated images" subtitle="Server-generated creative concepts returned as data URLs.">
                  {result.generatedImages.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {result.generatedImages.map((src, index) => (
                        <div key={`${src}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                          <div className="aspect-square bg-slate-900">
                            <img src={src} alt={`Campaign visual direction ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-white/60">
                      Image generation did not return a visual asset, but the campaign text is still available.
                    </div>
                  )}
                </Panel>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
