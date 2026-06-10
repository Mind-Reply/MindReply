# MindReply Homepage Strategy

Status: canonical homepage strategy.

Purpose: turn the homepage into a revenue path. The page must sell the first useful output, then use repeat overload to move buyers into credits, packs, Growth, or Pro.

Strategic spine:
MindReply earns the first purchase by fixing one urgent message, then earns upgrades when communication overload becomes a repeated business cost.

## Non-Negotiable Copy Rules

- Lead with buyer jobs, not internal category language.
- Use "paste one messy thread" as the entry action.
- Tie every abstract claim to a paid behavior.
- Make Growth and Pro triggers visible on the homepage.
- Use concrete receipts for trust proof.
- Remove internal phrases from public copy: "demand wedge", "high-demand lane", "authority layer", "next revenue move", "try the concept", and any founder-strategy language.
- Never make privacy sound like a slogan. Show what is protected.
- Do not lead with category labels. Use product depth only after the buyer sees the first output.

## Ruthless Diagnosis

### What Converts

- "Reclaim 2+ hours daily within 24 hours" works because it is measurable, near-term, and tied to pain the buyer already feels.
- "No long setup" lowers friction for overloaded founders and operators.
- "Action queue or send-ready message" gives the buyer a clear first-use outcome.
- Ops Overload Analyzer, Prospect Reply Analyzer, and Email Polisher are strong because each tool names a familiar job.
- "Buy a pack when the first output proves the time saving" is the correct paid sequence.
- "Private by design" has value because the product handles sensitive professional messages.

### What Is Still Vague

- The current page does not make Growth and Pro different enough in visible copy.
- The page talks about depth before it proves the first output.
- "Behavioral communication intelligence" is valuable only after the buyer sees role-aware language, risk control, and receipt discipline.
- "Overload" needs concrete examples: missed replies, slow follow-ups, stale prospects, client risk, and handoff drag.
- Premium membership depth is underused as a buying reason.

### What Weakens Trust

- Trust claims without receipts feel soft.
- Big time-saving promises need a visible proof path.
- Any capability claim must be visibly live, prepared, or clearly described.
- Sensitive communication buyers need control before send.
- Public proof must not expose raw messages, customer names, attachments, deal details, or full thread history.

### What Weakens Upgrade Pressure

- Credits, packs, Growth, and Pro must map to different workload moments.
- Growth must trigger on repeat overload, not vague interest.
- Pro must trigger on team handoffs, sensitive volume, receipts, lexicons, and leadership visibility.
- The page needs to say when credits are no longer the best path.
- The upgrade path should feel forced by workload, not sold by feature lists.

### Remove Or Rewrite Immediately

- Remove public copy that sounds like internal strategy: category claims, founder notes, demand labels, and vague market framing.
- Rewrite "try the concept" into "paste one messy thread."
- Rewrite vague trust language into receipt examples that show what improved and what stayed private.
- Rewrite soft plan copy into explicit Growth and Pro triggers.
- Remove any path that asks users to choose before they have seen the first output.

## Homepage Strategy In Two Layers

### Layer 1: Immediate Relief And Operational Value

This layer owns the first screen.

Buyer problem:
- Replies are late.
- Follow-ups are scattered.
- Prospect answers need sharper wording.
- Client threads carry tone and timing risk.
- Operators spend too much time deciding what to answer first.

Homepage promise:
Paste one messy message. MindReply returns a cleaned-up version, risk notes, and the next action.

Buying behavior:
- The buyer tries one thread.
- The first output proves whether time was saved.
- The buyer pays to clear the next thread, then the queue.

### Layer 2: Premium Authority And Communication Intelligence Depth

This layer appears after the buyer understands the first output.

Premium proof:
- 20+ professional categories and lexicons adapt language to the role and situation.
- 10 refinement tools handle repeat jobs: polish, shorten, soften, sharpen, clarify, risk-check, follow up, prioritize, reframe, and prepare.
- Private receipts create reviewable proof without exposing sensitive context.
- Premium membership depth supports saved behavior, recurring pressure, higher-stakes review, and team visibility.

Buying behavior:
- The buyer starts with one output.
- The buyer buys credits or a pack when the output saves time.
- The buyer upgrades to Growth when the same overload repeats.
- The buyer upgrades to Pro when the work becomes shared, sensitive, high-volume, receipt-driven, or lexicon-specific.

## New Hero Section

Headline:
Turn today's messy replies into send-ready messages in 10 minutes.

Subhead:
Built for founders, operators, and client-facing teams who can lose hours to sensitive communication. Paste one messy email, prospect reply, or client message. Get a cleaned-up version, risk notes, and the next action.

Primary CTA:
Get my first send-ready reply
- Behavior: opens the homepage intake panel focused on the message textarea.
- Auth: no account gate before the first output.
- Event: `homepage_cta_first_reply_clicked`.

Secondary CTA:
See the paid path after the first output
- Behavior: scrolls to the paid path section, not checkout.
- Event: `homepage_cta_paid_path_clicked`.

Proof strip:
- Action queue or send-ready message
- Ops Overload Analyzer
- Prospect Reply Analyzer
- Email Polisher
- 20+ professional lexicons
- 10 refinement tools
- Private by design

Proof strip UI:
- Render as seven non-clicking chips under the hero.
- Wrap chips on mobile.
- Counts must match visible inventory before public launch.

## Trust Block

Headline:
Show the improvement, not the private message.

Body:
MindReply is built for client replies, sales objections, founder messages, support escalations, and internal follow-ups where a slow or poorly judged message can delay revenue, trigger escalation, or force senior rewrite.

First-session receipt example:

```text
Input:
A messy client reply, prospect objection, or overdue follow-up.

Output:
A send-ready message with clearer intent, safer tone, sharper next step, and less risk of sounding defensive, vague, or desperate.

Receipt:
You pasted a stalled prospect reply. MindReply returned a cleaner response that acknowledged the objection, protected your authority, and asked for the next decision without over-explaining.

Protected:
Customer names, deal details, inbox text, attachments, and full message history are excluded from public proof.
```

Strategy guardrail for trust copy:
- Trust is tied to visible output.
- The buyer can see what improved before paying.
- Proof uses anonymized labels such as "Prospect objection", "Client delay", and "Internal escalation".
- Privacy language says what is protected and why it matters.
- No long setup is stated near the first action.
- The buyer sees a human-readable output before deeper purchase.

Trust UI:
- Render the receipt as a bordered receipt card.
- Use four labels: Input, Output, Receipt, Protected.
- Do not display real customer names, deal details, inbox text, attachments, or full thread history.

## How It Works Block

UI treatment:
- Render as a four-step card row on desktop and a stacked stepper on mobile.
- Each card uses a numeric marker, one action heading, and one sentence.
- Visual hierarchy: step number, heading, body, then optional micro-proof.
- Keep cards equal height on desktop and avoid carousel behavior.

1. Paste the messy thread.
MindReply reads the reply pressure, deadline, risk, intent, missing owner, and next step.

2. Get the first usable output.
You receive an action queue or a send-ready message with risk and follow-up logic.

3. Buy credits or a pack.
Use credits for occasional replies. Buy a pack when there is a visible backlog.

4. Upgrade when the pattern repeats.
Growth handles repeat overload. Pro handles team handoffs, sensitive volume, receipts, lexicons, and leadership visibility.

## Pricing And Paid Path Block

Headline:
Pay when the first output proves the time saving. Upgrade when the pattern repeats.

Layout:
- Show four sequential cards: Credits, GBP 600 Pack, Growth, Pro.
- Each card needs buyer moment, price display, deliverable, trigger, and CTA.
- Do not invent missing prices for Credits, Growth, or Pro.

Credits:
- Card title: Credits
- Price display: First paid credit pack
- Buyer moment: the first output was useful and the buyer wants one more reply.
- Deliverable: one additional send-ready reply or refined variant with risk note.
- Use when the buyer wants one more reply after proof.
- Buy when the first output is copied, reused, or turned into a real send.
- Prompt after value is visible: copied reply, receipt viewed, risk flag opened, second variation requested, or one additional thread attempted.
- CTA: Buy reply credits

Pack:
- Card title: GBP 600 Completion Pack
- Price display: GBP 600
- Use for a visible backlog.
- GBP 600 completion pack scope: up to 10 stuck messages or one same-day reply queue, cleaned into send-ready replies, risk notes, next actions, and private receipts.
- Buy when there are 3+ urgent threads, stale prospects, or same-day client follow-ups.
- CTA: Clear the queue.

Growth:
- Card title: Growth
- Price display: Show configured membership price only.
- Buyer moment: the same reply pressure returns across the week.
- Deliverable: recurring queue cleanup, saved context, follow-up memory, and weekly reply continuity.
- Use for repeat overload.
- Trigger when the same message category returns across two separate workdays in one week.
- Trigger when the same category returns twice.
- Trigger when credits are bought twice within 14 days and the buyer is still handling recurring replies.
- Trigger when 5+ outputs are completed in 7 days across follow-ups, client messages, or prospect replies.
- CTA: Upgrade to Growth for daily overload control.

Pro:
- Card title: Pro
- Price display: Show configured membership price only.
- Buyer moment: sensitive communication becomes shared across a team or high-stakes account.
- Deliverable: team review path, role-specific standards, exported receipts, and visibility for repeated sensitive work.
- Use for team communication control.
- Trigger when several people touch the same client, prospect, or account.
- Trigger when sensitive messages need review before send.
- Trigger when receipts are exported, saved, or requested.
- Trigger when role-specific lexicons become team standards for sales, client trust, hiring, leadership, or sensitive follow-up.
- Trigger when volume reaches 10+ high-trust outputs in 30 days.
- Trigger when leadership needs visibility.
- CTA: Upgrade to Pro for team communication control.

## Growth And Pro Upgrade Block

Growth line:
Credits are for occasional work. Growth is for the week your reply queue keeps coming back across replies, follow-ups, and client messages.

Pack line:
The GBP 600 pack is for a visible backlog: up to 10 stuck messages or one same-day queue turned into send-ready replies, risk notes, next actions, and private receipts.

Growth modal:
You are not testing MindReply anymore. You are using it to recover time repeatedly. Growth is the economic path when credits keep covering the same weekly bottleneck.

Pro line:
Pro is not more credits. Pro is for the moment a bad message can cost revenue, damage trust, or delay operations.

Pro modal:
This is now team communication infrastructure. Use this copy only when shared lexicons, refinement standards, approval receipts, handoff history, and leadership visibility are implemented or service-backed.

## Authority Block

Headline:
Built for high-trust professional communication, not generic writing help.

Body:
MindReply uses 20+ professional communication lexicons and 10 refinement tools to tune messages for sales, client trust, operations, leadership, hiring, and sensitive follow-up. That depth prevents generic replies from costing a deal, triggering escalation, slowing approval, or weakening consistency across a team.

Proof:
- 20+ professional categories for sales objections, client escalations, hiring replies, investor notes, leadership updates, and sensitive follow-up.
- Role and category lexicons for sharper language.
- 10 refinement tools for tone, clarity, urgency, risk, and conversion.
- Private by design for sensitive professional communication.
- Built for operators, founders, client-facing teams, and leaders who need communication to move work forward.
- Ops Overload Analyzer: find what needs action today.
- Prospect Reply Analyzer: turn hesitant replies into the next best response.
- Email Polisher: make a rough message send-ready without losing intent.

Buying reason:
The paid reason is concrete: better replies, lower risk, less senior rewrite time, and faster sending for sensitive work.

Claim discipline:
- Counts must match the visible product inventory before launch.
- Growth and Pro promises must be implemented or backed by a named service path.
- Public copy may say what the buyer receives, not what the internal system intends.
- Use "Reply copied" as the visible proof event when a buyer uses the first output.

## Outbound DMs

1. Founder overload:
You should not be the final editor for every sensitive reply. Send me one message your team is stuck on and I will return a cleaner reply plus the reason it works.

2. Operator backlog:
Your queue is not slow because people are lazy. It is slow because every reply needs judgment. Send one messy thread and I will show the next action, reply, and risk flag.

3. Sales lead leak:
Slow prospect replies look small until they cost a booked call. Send one stuck prospect reply and I will return a sharper response plus the reason it moves the conversation forward.

4. Client-facing team:
The risk is not just response time. It is tone drift across the team. Send one client thread and I will return a send-ready reply, risk flag, and private receipt.

5. Premium trust angle:
Generic polish is not enough for sensitive professional replies. MindReply uses role-aware lexicons and refinement tools to produce language you can actually send. Send one message and I will return the teardown.

## Cold Emails

### Cold Email 1: Founder

Subject: Your reply queue is costing senior time

Hi {{first_name}},

Most overloaded teams do not need more templates. They need fewer messages stuck waiting for a senior rewrite.

MindReply turns one messy thread into the next action, the send-ready reply, the risk flag, and a private receipt.

No long setup. The first output proves whether it saves time.

Send me one reply your team is stuck on, or I can show you a 10-minute message teardown.

### Cold Email 2: Operator

Subject: Cut the rewrite loop

Hi {{first_name}},

Operators lose time in the same place every day: scanning messages, deciding what matters, rewriting replies, and remembering who needs the next touch.

MindReply gives you an action queue or send-ready message from a pasted thread.

Use credits for occasional replies. Buy a pack when there is a queue. Move to Growth when the same overload keeps returning.

Send one reply your team would normally rewrite twice.

### Cold Email 3: Client-Facing Team

Subject: For client messages that need judgment

Hi {{first_name}},

Client-facing teams do not just need faster replies. They need the right reply, with the right owner, risk level, and next step.

MindReply reviews a thread and returns a narrow receipt plus a message you can edit and send.

It is built for sensitive communication where tone and timing affect revenue, trust, and escalation risk.

Send one sensitive client thread and I will show the output before you buy.

## Follow-Ups

### Follow-Up 1

Subject: One thread is enough

Hi {{first_name}},

You do not need to move a whole inbox to test this.

Paste one messy reply, stale follow-up, or prospect thread. MindReply should return the next action, the reply, and the risk flag.

The expensive part is not writing the reply. It is the second and third pass by someone senior. If the first output saves time, the paid path is obvious. If it does not, you know fast.

### Follow-Up 2

Subject: The upgrade trigger is repeat overload

Hi {{first_name}},

The useful test is simple: does the same reply pressure repeat every week?

If this is not blocking revenue yet, credits are enough.
If the same reply pressure returns weekly, Growth is the better path.
If the work involves team handoffs, sensitive clients, repeated risk, or receipts, Pro is the better path.

Send one reply that is currently waiting on judgment.

## Call Booking Message

I can show you MindReply in 15 minutes using one real thread. Bring the message your team would normally rewrite twice. We will turn it into an action queue, a send-ready reply, a risk flag, and a private receipt, then identify whether credits, the GBP 600 pack, Growth, or Pro matches the workload.

## Objections Handling

### "We already use writing tools."

Writing tools improve sentences. MindReply handles the business job: what needs action, what is at risk, what should be sent, and what follow-up is owed.

### "We already use blank chat prompts."

Then the question is whether your team has a repeatable judgment layer. MindReply is not blank prompting. It applies professional lexicons, refinement tools, and high-trust tone control to sensitive messages.

### "We do not want a long setup."

Good. The first action is one pasted thread. The first output should be useful before any setup discussion.

### "We are worried about privacy."

The receipt shows what changed without exposing raw private context. Customer names, deal details, inbox text, attachments, and full history stay out of public proof, and the user reviews before sending.

### "Why not just buy credits?"

Buy credits when usage is occasional. Upgrade to Growth when the same overload repeats weekly. Move to Pro when the work includes team handoffs, higher volume, professional lexicons, or private receipts.

### "Our team already has templates."

Templates fail when context changes. MindReply is for messages where the template is close but still risky, flat, or too slow to send.

### "How do we know it saves time?"

Measure the first session: time to action queue, time to send-ready message, number of stale threads cleared, and whether the output avoided another rewrite cycle.

## First-Session Conversion Logic

First user action:
Paste one messy message. Do not start with the whole queue.

First output:
Return a send-ready rewrite plus action and risk notes. If the message reveals backlog, surface the queue after the first output.

Aha moment:
The buyer sees: this saved me from thinking through tone, risk, and next step.

Credit purchase trigger:
Show the credit prompt only after value is proven: copied reply, receipt viewed, risk flag opened, second variation requested, or second thread attempted. Buy when this output is worth using today.

Pack trigger:
Show the pack prompt when there is a backlog: 3+ urgent threads, same-day cleanup pressure, stale prospects, or batch processing need.

Growth trigger:
Show Growth when overload repeats every week: two sessions in one week, recurring follow-ups, saved prospects, repeated credit purchases, 3+ outputs in 7 days, or credits bought twice within 14 days. Growth unlocks saved context, recurring follow-up memory, prospect continuity, and weekly queue management.

Pro trigger:
Show Pro when messages affect revenue, trust, or sensitive decisions: teammate review, sensitive client risk, delegated replies, exported receipts, recurring high-stakes work, or 10+ high-trust outputs in 30 days.

Trigger hierarchy:
- Credits: one-off continuation after proof.
- Pack: 3+ thread backlog or same-day cleanup.
- Growth: recurring individual routine.
- Pro: shared, sensitive, high-volume routine with receipts or team review.

First-session measurement events:
- `thread_pasted`: user enters the first message.
- `first_output_generated`: system returns rewrite, action, risk note, and receipt.
- `reply_copied`: user copies the send-ready reply.
- `risk_flag_viewed`: user expands or reads the risk note.
- `receipt_opened`: user views the private receipt card.
- `second_thread_attempted`: user attempts another message after first output.
- `credit_prompt_shown`: credit CTA appears after value proof.
- `pack_prompt_shown`: GBP 600 pack CTA appears after backlog signal.
- `growth_prompt_shown`: Growth CTA appears after recurring overload signal.
- `pro_prompt_shown`: Pro CTA appears after team, receipt, sensitive-volume, or leadership signal.

Primary conversion rule:
Do not sell the plan first. Sell the first output, then let repeat overload push the buyer into the correct paid path.

## Homepage Implementation Checklist

- First screen says "paste one messy thread."
- First screen names action queue, send-ready message, risk flag, and private receipt.
- Trust block shows a receipt example.
- Pricing block separates credits, pack, Growth, and Pro.
- Growth trigger is repeat overload.
- Pro trigger is shared sensitive work.
- Authority block mentions 20+ categories, lexicons, 10 refinement tools, and high-trust communication.
- No internal strategy phrases appear in public copy.
