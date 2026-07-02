'use client';

import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Wand2,
} from 'lucide-react';

type CampaignVariant = {
  headline: string;
  body: string;
};

type GeneratedImage = {
  prompt: string;
  src: string | null;
  status: 'ok' | 'failed';
  error?: string;
};

type CampaignResult = {
  concept: string;
  strategicAngle: string;
  variants: CampaignVariant[];
  launchChecklist: string[];
  imagePrompts: string[];
};

type ApiResponse = {
  campaign: CampaignResult;
  generatedImages: GeneratedImage[];
  meta: {
    textModel: string;
    imageModel: string;
  };
};

const toneOptions = ['Professional', 'Bold', 'Premium', 'Friendly', 'Playful', 'Minimal', 'Direct', 'Luxury'];
const channelOptions = ['Meta Ads', 'LinkedIn', 'Email', 'Landing Page', 'Google Ads', 'TikTok', 'X', 'YouTube'];
const defaultBrief = 'Launch a focused campaign for a new marketing studio that helps teams create campaign concepts faster.';
const defaultAudience = 'Marketing leads, growth managers, and brand teams at SMBs and mid-market companies.';
const defaultProduct = 'A full-stack campaign concept studio that turns a short brief into a concept, copy variants, launch checklist, and visual direction.';

function cn(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ');
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
    >
      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
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

function LoadingPanel({ step }: { step: string }) {
  return (
    <SectionCard title="Generating your campaign" subtitle="The server is calling OpenAI on the backend and composing copy + visuals.">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
          <Loader2 className="h-5 w-5 animate-spin" />
          <div>
            <p className="font-medium">{step}</p>
            <p className="text-sm text-cyan-100/70">This keeps the OpenAI API key off the client and inside the server route.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function EmptyPanel() {
  return (
    <SectionCard title="Nothing generated yet" subtitle="Fill in the brief and generate a campaign concept, copy set, checklist, and image direction.">
      <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-white/70">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-cyan-300" />
        <p className="text-lg font-medium text-white">Campaign output will appear here</p>
        <p className="mt-2 text-sm text-white/60">The studio will return a concise concept, five copy variants, a launch checklist, image prompts, and generated images.</p>
      </div>
    </SectionCard>
  );
}

export default function CampaignStudioPage() {
  const [brief, setBrief] = useState(defaultBrief);
  const [audience, setAudience] = useState(defaultAudience);
  const [product, setProduct] = useState(defaultProduct);
  const [tone, setTone] = useState('Professional');
  const [channels, setChannels] = useState<string[]>(['Meta Ads', 'LinkedIn', 'Email']);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('Preparing campaign brief…');

  const canSubmit = useMemo(
    () => brief.trim().length > 10 && audience.trim().length > 10 && product.trim().length > 10 && channels.length > 0,
    [brief, audience, product, channels],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(null);
    setStep('Writing the campaign concept…');

    try {
      const response = await fetch('/api/campaign-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, audience, product, tone, channels }),
      });

      const payload = (await response.json()) as ApiResponse & { error?: string };
      if (!response.ok) throw new Error(payload?.error || 'Campaign generation failed.');

      setStep('Generating images…');
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setStep('Preparing campaign brief…');
    }
  }

  function toggleChannel(channel: string) {
    setChannels((current) => (current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel]));
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.15),_transparent_30%),linear-gradient(180deg,_#050816_0%,_#090b1a_60%,_#050816_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
              <Wand2 className="h-3.5 w-3.5" /> Campaign Concept Studio
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Generate campaign strategy, copy, checklists, and visual direction in one flow.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 md:text-base">
              Server-side OpenAI calls keep the key off the client. The backend uses the Responses API for structured campaign output and the image API for generated creative direction.
            </p>
          </div>
          <a href="/" className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 md:inline-flex">
            Back to MindReply
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard title="Campaign brief" subtitle="Give the studio enough context to create a commercially useful direction.">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
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
                    onChange={(e) => setTone(e.target.value)}
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
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                            selected ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-100' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10',
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
                <p className="mt-1">The client sends only the campaign inputs. The API route performs all OpenAI calls on the server and returns structured JSON plus generated image assets.</p>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
                  canSubmit && !isLoading ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'cursor-not-allowed bg-white/10 text-white/40',
                )}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Generate campaign
              </button>
            </form>
          </SectionCard>

          <div className="space-y-6">
            {isLoading ? (
              <LoadingPanel step={step} />
            ) : result ? (
              <>
                <SectionCard title="Campaign concept" subtitle={`Models: ${result.meta.textModel} · ${result.meta.imageModel}`}>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-100/80">Strategic angle</p>
                      <p className="mt-2 text-base leading-7 text-white">{result.campaign.strategicAngle}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Concise concept</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/85">{result.campaign.concept}</p>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Five copy variants" subtitle="Each version is designed to explore a different angle while staying channel-ready.">
                  <div className="space-y-3">
                    {result.campaign.variants.map((variant, index) => (
                      <article key={`${variant.headline}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-cyan-100">Variant {index + 1}</p>
                          <CopyButton text={`${variant.headline}\n\n${variant.body}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{variant.headline}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">{variant.body}</p>
                      </article>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Launch checklist" subtitle="Execution-focused rollout steps to help the campaign ship cleanly.">
                  <ul className="space-y-3">
                    {result.campaign.launchChecklist.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title="Image prompts" subtitle="Prompts that produce different campaign visuals and creative directions.">
                  <div className="space-y-3">
                    {result.campaign.imagePrompts.map((prompt, index) => (
                      <div key={`${prompt}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white">Direction {index + 1}</p>
                          <CopyButton text={prompt} />
                        </div>
                        <p className="text-sm leading-6 text-white/70">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Generated images" subtitle="Rendered server-side after the concept and prompt set are created.">
                  <div className="grid gap-4 md:grid-cols-3">
                    {result.generatedImages.map((image, index) => (
                      <figure key={`${index}-${image.prompt}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        <div className="aspect-square bg-white/5">
                          {image.src ? (
                            <img src={image.src} alt={image.prompt} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center p-5 text-center text-sm text-white/50">
                              <div>
                                <ImageIcon className="mx-auto mb-2 h-6 w-6" />
                                <p>Image generation failed</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <figcaption className="space-y-2 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Prompt</p>
                          <p className="text-sm leading-6 text-white/70">{image.prompt}</p>
                          {image.status === 'failed' ? <p className="text-xs text-rose-300">{image.error}</p> : null}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </SectionCard>
              </>
            ) : error ? (
              <SectionCard title="Generation failed" subtitle="Fix the issue and try again.">
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">{error}</div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  Dismiss
                </button>
              </SectionCard>
            ) : (
              <EmptyPanel />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
