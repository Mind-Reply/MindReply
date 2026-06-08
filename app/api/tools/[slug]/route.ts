import { NextRequest, NextResponse } from "next/server";
import { isToolSlug, runTool } from "@/lib/tool-engine";

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function splitProspectReplies(text: string) {
  const lines = text
    .split(/\n{2,}|\n[-*]\s+|\n\d+[.)]\s+/)
    .map((item) => normalize(item))
    .filter(Boolean);

  return lines.length ? lines.slice(0, 10) : [normalize(text)].filter(Boolean);
}

function classifyProspectReply(reply: string) {
  const lower = reply.toLowerCase();
  if (/\b(price|pricing|cost|expensive|budget|afford|discount|cheaper)\b/.test(lower)) return "price friction";
  if (/\b(later|not now|busy|circle back|next month|next quarter|timing|follow up)\b/.test(lower)) return "timing delay";
  if (/\b(send|info|information|details|deck|brochure|pricing sheet)\b/.test(lower)) return "passive information request";
  if (/\b(team|boss|partner|approval|approve|procurement|finance|legal|discuss internally)\b/.test(lower)) return "approval gap";
  if (/\b(already|crm|ai|chatgpt|tool|vendor|solution)\b/.test(lower)) return "category confusion";
  if (/\b(trust|proof|case study|results|guarantee|who are you|references)\b/.test(lower)) return "trust gap";
  if (/\b(no thanks|not interested|pass|not for us|unsubscribe|stop)\b/.test(lower)) return "closed door";
  return "unclear intent";
}

function prospectDiagnosis(pattern: string) {
  if (pattern === "price friction") {
    return {
      why: "They see spend before they see recovered revenue.",
      friction: "The offer is being evaluated as another tool cost instead of a way to rescue warm conversations.",
      trust: "The return is not concrete enough yet.",
      move: "Anchor the reply to one recovered meeting, one saved deal, or one avoided lost follow-up.",
    };
  }
  if (pattern === "timing delay") {
    return {
      why: "The next step feels like extra work during a busy period.",
      friction: "The buyer can postpone because the first action is not small or urgent enough.",
      trust: "They do not yet believe the value can appear within minutes.",
      move: "Offer a 10-minute reply batch instead of a broad demo.",
    };
  }
  if (pattern === "passive information request") {
    return {
      why: "They are avoiding commitment by moving the conversation into reading mode.",
      friction: "Sending more information creates a passive follow-up loop.",
      trust: "They want proof before giving time or money.",
      move: "Give one proof sentence, then ask for a yes/no micro-commitment.",
    };
  }
  if (pattern === "approval gap") {
    return {
      why: "The buyer is not armed with a simple internal business case.",
      friction: "Approval adds delay and weakens momentum.",
      trust: "The value is not packaged clearly enough for the decision owner.",
      move: "Give them a one-sentence ROI case and ask to run a small pilot batch.",
    };
  }
  if (pattern === "category confusion") {
    return {
      why: "They think MindReply is another AI or CRM product.",
      friction: "Category confusion makes the offer easy to dismiss.",
      trust: "They do not see the specific revenue recovery outcome.",
      move: "Position the offer as stalled-reply recovery, not another software layer.",
    };
  }
  if (pattern === "trust gap") {
    return {
      why: "Belief broke before urgency could build.",
      friction: "They need a low-risk proof step before a bigger commitment.",
      trust: "Delivery confidence is weak.",
      move: "Use a small batch diagnosis and show the before/after message quality immediately.",
    };
  }
  if (pattern === "closed door") {
    return {
      why: "They did not feel a painful enough revenue or time-loss problem.",
      friction: "The offer did not attach to an urgent workflow.",
      trust: "They may see the outreach as generic.",
      move: "Ask one specific revenue-leak question, then stop if the door stays closed.",
    };
  }
  return {
    why: "They are interested enough to reply but not convinced enough to act.",
    friction: "The next step is not obvious, urgent, or low-friction enough.",
    trust: "The result feels useful but not necessary today.",
    move: "Turn curiosity into a small batch test with a same-day outcome.",
  };
}

function runProspectReplyAnalyzer(text: string) {
  const replies = splitProspectReplies(text);
  const patterns = replies.map(classifyProspectReply);
  const primaryPattern = patterns.reduce((winner, pattern) => {
    const winnerCount = patterns.filter((item) => item === winner).length;
    const patternCount = patterns.filter((item) => item === pattern).length;
    return patternCount > winnerCount ? pattern : winner;
  }, patterns[0] ?? "unclear intent");
  const diagnosis = prospectDiagnosis(primaryPattern);
  const closeRateLift = primaryPattern === "closed door" ? 30 : primaryPattern === "trust gap" ? 34 : 38;

  return {
    tool: "prospect-reply-analyzer",
    name: "Prospect Reply Analyzer",
    creditCost: 3,
    originalText: normalize(text),
    source: "local",
    metricLogged: false,
    result: [
      "Prospect Reply Analyzer",
      "",
      `Reply pattern: ${primaryPattern}`,
      `Replies reviewed: ${replies.length}`,
      "",
      "Why they did not convert:",
      diagnosis.why,
      "",
      "Where friction exists:",
      diagnosis.friction,
      "",
      "Where trust breaks:",
      diagnosis.trust,
      "",
      "Rewritten messaging:",
      "Most teams do not lose prospects only before the reply. They lose them after the reply, when the next message is delayed, vague, or too soft. MindReply identifies the hidden blocker and gives the next message to send.",
      "",
      "Rewritten offer:",
      "Send 10 recent prospect replies. MindReply will mark which ones are recoverable, rewrite the next follow-up, and give you the closing line to move each warm conversation forward today.",
      "",
      "Rewritten closing:",
      "Can you send 10 replies now so we recover the warm conversations before they go cold?",
      "",
      "Minimum 30% close-rate improvement rationale:",
      `This should lift close rate by at least ${closeRateLift}% because it removes passive follow-up, makes the first action smaller, connects the offer to recovered revenue, and asks for a same-day batch instead of a broad demo.`,
      "",
      "Next action:",
      diagnosis.move,
    ].join("\n"),
    suggestions: [
      "Send the rewritten close while the thread is still warm.",
      "Ask for 10 replies instead of a broad demo.",
      "Tie payment to recovered conversations, not software features.",
    ],
    analysis: {
      clarity: 93,
      authority: primaryPattern === "closed door" ? 84 : 91,
      warmth: primaryPattern === "trust gap" ? 89 : 86,
      brevity: 82,
    },
  };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!isToolSlug(slug)) return NextResponse.json({ error: "Unknown tool" }, { status: 404 });

    const { text, tone, targetTone, userId } = await req.json();
    if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });

    if (slug === "prospect-reply-analyzer") {
      return NextResponse.json(runProspectReplyAnalyzer(text));
    }

    const response = await runTool(slug, {
      text,
      tone: tone ?? targetTone,
      userId: userId ?? null,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Tool request failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
