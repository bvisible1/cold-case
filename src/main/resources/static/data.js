// data.js — Delta Air Lines scenario, NetApp personas, AI prompts, scoring config.
// Cold-case sales training simulation.

window.HEIST_DATA = (() => {

  // ───────────────── SCENARIO ─────────────────
  const SCENARIO = {
    account: "Delta Air Lines",
    industry: "Commercial aviation · global hub-and-spoke carrier",
    revenue: "~$58B revenue (FY2024) · ~100,000 employees · ~900 aircraft · 7 major US hubs",
    burningPlatform: [
      "July 2024 CrowdStrike outage hit Delta hardest of any airline — ~7,000 cancellations, ~$500M financial impact, ongoing class actions and DOT scrutiny.",
      "Board greenlit a multi-year resilience and modernization program; storage layer is on the critical path.",
      "~25% of storage arrays are 5+ years old; several past end-of-support across three primary US data centers and the Atlanta Operations Control Center.",
      "Four storage platforms across Microsoft Azure (primary cloud), AWS (select), on-prem in ATL/MSP, and legacy edge — visible operational drag and cost creep.",
      "OCC restore time benchmarked at ~12 hours vs a 1–2 hour target (10× best-in-class peers). Board demanding a 5× MTTR improvement.",
      "Backup success rate 91% against a 99% target; limited immutable copies for ops-critical workloads as aviation ransomware risk rises.",
      "Long-running Microsoft Azure relationship (announced 2018) plus AWS for select workloads; key tension is that OCC and most ops-critical workloads still run on-prem — and that's where CrowdStrike pain was felt.",
      "Active hiring spike for SRE, hybrid-cloud and AI infrastructure roles.",
    ],
    initiatives: [
      "Resilience Modernization (post-CrowdStrike) — 5× MTTR improvement, ransomware-resilient restore, consolidated control plane.",
      "Operations Intelligence Platform — sub-minute ops data, predictive disruption modeling, unified data fabric.",
      "Fleet & MRO Data Modernization — real-time fleet telemetry; AI-driven predictive maintenance at scale.",
      "SkyMiles & Customer Data Unification — unified customer 360; near-real-time personalization; richer Amex co-brand value.",
      "Hybrid Cloud Consolidation — consistent data services across Azure, AWS, on-prem; right-sized OpEx.",
    ],
    productYouAreSelling: "NetApp — unified, hybrid-cloud data services across Azure, AWS, and on-prem; ransomware-resilient restore; consistent data plane and tooling across clouds.",
    icp: "Large enterprise hybrid-cloud estates with ops-critical workloads on-prem and AI/analytics workloads on Azure or AWS.",
    yourCompany: "NetApp",
    yourTitle: "Strategic Account Executive",
    timeMinutes: 45,
    competition: [
      { name: "Pure Storage", pitch: "Evergreen//One STaaS, Flash-only simplicity, DirectFlash for AI.", weakness: "Limited unified file+object story · cloud-tier capabilities lag · higher TCO at multi-PB scale." },
      { name: "Dell Technologies", pitch: "PowerStore + PowerMax for tier-1, PowerProtect for backup, long incumbency in airline IT.", weakness: "Disjointed product portfolio · slow innovation post-merger · weaker hybrid-cloud data services." },
      { name: "HPE", pitch: "Alletra + GreenLake, hybrid-cloud as-a-service narrative, Aruba-tied resilience story.", weakness: "GreenLake consumption complexity · limited native Azure integration depth · smaller proven ops-critical footprint." },
    ],
  };

  // ───────────────── PERSONAS ─────────────────
  // 3 in-game characters (Sarah Chen, Michael Torres, Marcus Webb) + decoys.
  const PERSONAS = [
    {
      id: "sarah",
      level: "executive",
      name: "Sarah Chen",
      title: "VP, Global Data Infrastructure",
      company: "Delta Air Lines",
      reportsTo: "Rahul Samant (EVP & CIO)",
      tenure: "3 years at Delta · prior VP Infra at another Fortune 100 global ops org",
      location: "Atlanta, GA",
      kpis: ["Platform uptime", "Storage TCO", "Data availability", "Recovery time objective (RTO)", "Infrastructure scalability"],
      pains: [
        "Owns the post-CrowdStrike resilience response with personal board exposure.",
        "Four storage platforms across Azure, AWS, on-prem create operational drag.",
        "12-hour OCC restore time vs 1–2 hour target — biggest open board item.",
        "Board demanding ROI clarity on the multi-billion modernization program.",
        "Ransomware risk rising for aviation; needs immutable, recovery-tested architecture.",
        "AI/ML on operations and MRO stalled by fragmented data plane.",
        "Talent: AI infra and SRE roles open; can't run change without bench.",
      ],
      personality: "Composed. Board-savvy. Speaks in transformation outcomes and quantified business impact. Will not engage with feature lists. Tests vendors by how they connect technical wins to the board narrative. Polite but unforgiving with clichés — will end a call with a thank-you, not a fight.",
      sentenceCap: 4,
      delegatesTo: "Michael Torres (Director, Data Platform Engineering) for anything operational or tooling-specific",
      iceCeilings: {
        implication: "high — can speak to board pressure, regulatory exposure, customer-trust impact, fleet recovery economics",
        champion: "self — can sponsor at the EVP/CIO level if convinced; gates access to Rahul",
        economicBuyer: "shared — has program-level discretion; CFO Dan Janki and CIO Rahul Samant gate the multi-year envelope",
      },
      trustLayers: {
        L1: "Cordial and brief. Asks why this conversation should happen now. 2-minute clock running.",
        L2: "Earned by: a research-backed opening that ties to CrowdStrike, the multi-billion modernization program, or board-level resilience SLAs. Will share program shape, the 5× MTTR target, and what's been ruled out.",
        L3: "Earned by: implication questions on what NOT solving means (board exposure, regulatory follow-on, customer-trust dollars, fleet recovery economics). Will share what 'good' looks like in 12 months, who else is in the room when capital is approved, and what would have to be true to displace the current direction.",
      },
      clicheDefenses: [
        "If they say 'I just wanted to learn about your business': 'You can read our 10-K. What's the hypothesis?'",
        "If they ask 'what keeps you up at night': 'A 12-hour OCC restore time. You already knew that. Try a real question.'",
        "If they flip a question back ('what do you think?'): 'I'm not interviewing you to consult you. Make your point.'",
      ],
      photoInitials: "SC",
      tag: "VP TIER · ECONOMIC INFLUENCE",
    },
    {
      id: "michael",
      level: "director",
      name: "Michael Torres",
      title: "Director, Data Platform Engineering",
      company: "Delta Air Lines",
      reportsTo: "Sarah Chen (VP, Global Data Infrastructure)",
      tenure: "5 years at Delta · came up through SRE at a major SaaS before joining",
      location: "Atlanta, GA",
      kpis: ["Uptime SLA", "MTTR", "Storage utilization", "Sprint velocity", "Ops ticket volume"],
      pains: [
        "Managing four different storage platforms across Azure, AWS, on-prem, and legacy edge.",
        "22-person team stretched across 24/7 ops for 290+ destinations.",
        "Zero-downtime migration mandate while remediating CrowdStrike findings.",
        "Tooling sprawl: each platform has its own CLI, API, alerting.",
        "MTTR targets cut in half post-CrowdStrike — current process won't get there.",
        "Vendor support response inconsistent across legacy arrays.",
        "Pressure to move workloads to Azure without breaking the OCC dependency.",
      ],
      personality: "Practical operator. Skeptical of vision slides. Engages on day-2 operations, integration specifics, and honest trade-offs. Has heard every cloud pitch — wants to know what breaks at 2am. Friendly enough but will protect his team's bandwidth.",
      sentenceCap: 5,
      delegatesTo: "Marcus Webb (Manager, Storage Infrastructure) for array-level ops; Sarah for strategy or budget",
      iceCeilings: {
        implication: "medium-high — team burnout, broken handoffs, MTTR delta, escalation cost, capacity planning misses",
        champion: "strong potential — sits in the seat where the pain is most operational",
        economicBuyer: "no — punts everything financial up to Sarah",
      },
      trustLayers: {
        L1: "Friendly but guarded. Vague answers about 'we have some tooling' until you prove you understand his world.",
        L2: "Earned by: specific questions about hybrid ops, day-2 reality, integration with his existing stack — OR by referencing what Sarah is accountable for. Will share team size, tooling sprawl, what the OCC dependency actually looks like.",
        L3: "Earned by: implication questions about how the four-platform reality affects MTTR, team retention, and the Azure migration timeline. Will share specific failure modes, which platforms can't be killed yet, and what would have to be in a pilot for him to recommend it to Sarah.",
      },
      clicheDefenses: [
        "If they say 'how can I help you': 'You can ask me a real question instead of selling.'",
        "If they ask 'what are your biggest pain points': 'I don't have pain points. I have a 22-person team and four platforms. Be specific.'",
        "If they reframe ('what I'm hearing is...'): 'You're not hearing me yet. I haven't said anything specific.'",
      ],
      photoInitials: "MT",
      tag: "DIRECTOR TIER · TECHNICAL BUYER",
    },
    {
      id: "marcus",
      level: "manager",
      name: "Marcus Webb",
      title: "Manager, Storage Infrastructure",
      company: "Delta Air Lines",
      reportsTo: "Michael Torres (Director, Data Platform Engineering)",
      tenure: "8 years at Delta · came over from a storage vendor side before that",
      location: "Atlanta, GA",
      kpis: ["Uptime SLA", "Backup success rate", "Storage utilization", "Ticket resolution time"],
      pains: [
        "Four legacy arrays past end-of-support — multi-week lead time on replacement parts.",
        "Team of 6 managing four different storage platforms with different CLIs and alerting.",
        "Backup success rate 91% vs 99% target — fixing failed jobs on weekends.",
        "Last full restore test took 11 hours; CrowdStrike review demands sub-2.",
        "Vendor escalations for legacy arrays routinely drag past SLA.",
        "Capacity planning is reactive — discovers shortages mid-quarter.",
        "Days a month chasing spare parts across hub sites.",
      ],
      personality: "Hands-on. Burned-out from on-call grind. BS detector calibrated by years on the vendor side himself. Engages on numbers — backup success, restore times, support SLAs. Bored by 'transformation' language. Polite until he's not.",
      sentenceCap: 6,
      delegatesTo: "Michael for anything strategic or budget-related",
      iceCeilings: {
        implication: "low-medium — can describe day-of-incident behavior and ops-grind cost; not board-level",
        champion: "weak — can advocate but isn't in the room when capital is approved",
        economicBuyer: "no",
      },
      trustLayers: {
        L1: "Curt. 'What do you need?' Vendor allergy is strong.",
        L2: "Earned by: showing you actually understand backup posture, restore testing, parts logistics. Will share what's broken, how often, and what he's escalated.",
        L3: "Earned by: asking what would have to be true for him to recommend a proof-of-value to Michael. Will share which array is the worst, what the team tried last time, and what a real first-step engagement should look like.",
      },
      clicheDefenses: [
        "If they pitch 'AI-powered' anything: 'Cool. What model. What latency. What happens to my backup window.'",
        "If they ask 'what tools are you using': 'Read our re:Invent talk. I'm not your sales engineer.'",
        "If they say 'we work with airlines like you': 'Name three. By workload, not logo.'",
      ],
      photoInitials: "MW",
      tag: "MANAGER TIER · USER BUYER",
    },
    // Decoys — visible but ruled out
    {
      id: "decoy-1",
      level: "decoy",
      name: "Janelle Forrester",
      title: "VP, Customer Experience",
      company: "Delta Air Lines",
      decoyReason: "CX owns the customer-facing layer, not the storage and resilience stack.",
      photoInitials: "JF",
    },
    {
      id: "decoy-2",
      level: "decoy",
      name: "Theo Vance",
      title: "Director, SkyMiles Loyalty",
      company: "Delta Air Lines",
      decoyReason: "Loyalty is a downstream consumer of the data plane, not the buyer for the platform under it.",
      photoInitials: "TV",
    },
    {
      id: "decoy-3",
      level: "decoy",
      name: "Priya Anand",
      title: "VP, TechOps Engineering",
      company: "Delta Air Lines",
      decoyReason: "TechOps owns the aircraft and MRO side — adjacent to the program, but not the storage owner.",
      photoInitials: "PA",
    },
  ];

  // ───────────────── INVESTIGATION TOOLS ─────────────────
  const RESEARCH_TOOLS = [
    {
      id: "earnings",
      name: "Earnings Transcript",
      desc: "Q4 2024 earnings call — listen for the resilience narrative.",
      kind: "audio",
    },
    {
      id: "web",
      name: "Public Web Search",
      desc: "News, press releases, CrowdStrike fallout coverage.",
      kind: "web",
    },
    {
      id: "linkedin",
      name: "LinkedIn Intelligence",
      desc: "Profiles, recent posts, org chart changes, headcount trends.",
      kind: "linkedin",
    },
    {
      id: "agent",
      name: "Research Agent",
      desc: "Ask the AI agent anything about Delta.",
      kind: "agent",
    },
    {
      id: "jobs",
      name: "Job Postings",
      desc: "What roles are they hiring? Strong signal of priorities.",
      kind: "jobs",
    },
  ];

  const RESEARCH_CONTENT = {
    earnings: {
      title: "Q4 2024 Earnings — selected excerpts",
      transcript: [
        { speaker: "Ed Bastian, CEO", text: "The July CrowdStrike event cost us approximately $500 million and reinforced our commitment to operational resilience. We are accelerating modernization of the data and operations platforms that underpin the Atlanta OCC." },
        { speaker: "Dan Janki, CFO", text: "We expect multi-year capital investment in resilience and hybrid-cloud modernization to be the largest non-fleet capex line over the planning horizon. ROI is being measured against MTTR, customer compensation expense, and avoided cancellations." },
        { speaker: "Analyst", text: "Can you size the operations restore-time improvement you're targeting coming out of the CrowdStrike review?" },
        { speaker: "Ed Bastian, CEO", text: "We're targeting a five-times improvement in recovery time across ops-critical workloads. That includes consolidation of our storage and data platforms across Azure, AWS, and on-prem." },
        { speaker: "Dan Janki, CFO", text: "We continue to manage cloud OpEx growth tightly. The goal is consistent data services across our hybrid estate, not a single-cloud destination." },
      ],
    },
    web: [
      { url: "wsj.com / 2024-08-08", title: "Delta blames CrowdStrike for ~$500M Q3 hit; CEO calls for resilience overhaul", snip: "Delta Air Lines said the July global IT outage drove approximately 7,000 cancellations and a roughly $500 million financial impact. Ed Bastian framed the response as a multi-year resilience and modernization program." },
      { url: "reuters.com / 2024-10-22", title: "Delta sues CrowdStrike; modernization plan accelerates", snip: "Delta filed suit in Georgia. The airline separately briefed analysts on accelerated investment in hybrid-cloud data infrastructure and operational restore-time targets." },
      { url: "linkedin.com/in/rahul-samant-cio", title: "Rahul Samant — Post: 'Resilience is a design principle, not a recovery step'", snip: "Multi-cloud strategy stands. The question is whether our data plane is consistent enough across Azure, AWS, and on-prem to survive the next event. We are accelerating the answer." },
      { url: "delta.com/careers", title: "Delta Careers — open roles", snip: "Director, Hybrid Cloud Engineering · Senior SRE (OCC) · Principal Architect, AI Infrastructure · Manager, Storage Operations · Staff Data Platform Engineer." },
      { url: "reagonaviation.com / 2025-02-14", title: "Aviation IT Summit: Sarah Chen on rebuilding the data fabric under the OCC", snip: "Chen described the constraint: a strategic Azure direction, an AWS footprint for select data-science workloads, and ops-critical systems that have to stay on-prem at the OCC for the foreseeable future." },
    ],
    jobs: [
      { title: "Principal Architect, AI Infrastructure", team: "Data Platform Engineering", postedDays: 12, signal: "New req. Owns the unified data-fabric blueprint for operations + MRO." },
      { title: "Director, Hybrid Cloud Engineering", team: "Global Data Infrastructure", postedDays: 26, signal: "Reports up to Sarah Chen. Tells you the org is investing in hybrid as a first-class function — not migrating away from on-prem." },
      { title: "Senior SRE (OCC) — 4 open", team: "Operations Control Center", postedDays: 38, signal: "Bench expansion. Direct response to the post-CrowdStrike MTTR mandate." },
      { title: "Manager, Storage Operations", team: "Storage Infrastructure", postedDays: 51, signal: "Backfill below Marcus Webb. Capacity is the constraint." },
    ],
    agent: {
      seedQs: [
        "What was Delta's stated financial impact from the CrowdStrike outage?",
        "Who owns the post-CrowdStrike modernization program at Delta?",
        "What's the public posture on Azure vs AWS vs on-prem?",
        "Which roles is Delta hiring that signal where the program is going?",
      ],
    },
  };

  // ───────────────── AI PROMPTS ─────────────────

  const SCENARIO_SUMMARY = `
Scenario: ${SCENARIO.account} (${SCENARIO.industry}).
What you know about the account from research:
- ${SCENARIO.burningPlatform.join("\n- ")}

Active strategic initiatives at Delta:
- ${SCENARIO.initiatives.join("\n- ")}

You are selling: ${SCENARIO.productYouAreSelling}
Your title: ${SCENARIO.yourTitle} at ${SCENARIO.yourCompany}.
ICP: ${SCENARIO.icp}

Competition in the room:
${SCENARIO.competition.map(c => `- ${c.name}: pitching ${c.pitch} · weakness at Delta: ${c.weakness}`).join("\n")}
`.trim();

  const JUDGE_PROMPTS = {
    hypothesis: ({ submission }) => `You are an expert sales training coach evaluating a sales rep's account-research hypothesis on Delta Air Lines.

${SCENARIO_SUMMARY}

The rep's hypothesis:
"""
${submission}
"""

Evaluate against these criteria:
1. Did they identify a SPECIFIC initiative (post-CrowdStrike resilience, OCC restore time, hybrid-cloud data plane, fleet/MRO data, SkyMiles unification)?
2. Did they reference concrete evidence (earnings call, CrowdStrike financial impact, job postings, Rahul Samant's posture, Sarah Chen's public commentary)?
3. Did they predict business consequences, not just describe the initiative?
4. Did they connect to a buyer's KPI (MTTR, restore time, backup success, board narrative, customer-comp expense, OpEx control)?

COACHING STYLE — IMPORTANT:
- Be PRESCRIPTIVE: name the specific principle or technique the rep should apply.
- DO NOT give away the answer. Don't tell them what to write or which evidence to cite.
- Point to a category, not the specifics. E.g. "Tie your hypothesis to a board-level KPI, not a tactical one" (good) vs "Cite the $500M CrowdStrike impact" (too revealing).
- One concrete improvement, named in 1-2 sentences. No lists.

Return ONLY valid JSON in this exact format:
{
  "tier": "strong" | "developing" | "weak",
  "feedback": "1-2 sentences. Conversational read of the hypothesis quality. Don't echo their text.",
  "coach": "1-2 sentences. Name the specific technique/principle to apply next. Don't write their hypothesis for them."
}
Strong: hits 3-4 criteria. Developing: 2 criteria. Weak: 0-1 criteria.`,

    outreach: ({ submission, channel, personaName, personaTitle }) => `You are an expert sales training coach evaluating a sales rep's outbound message to a Delta Air Lines stakeholder.

${SCENARIO_SUMMARY}

Target persona: ${personaName} — ${personaTitle}
Channel: ${channel}

The rep's message:
"""
${submission}
"""

Evaluate against:
1. Specificity — does it reference something only Delta would care about right now?
2. Brevity — under 100 words is ideal.
3. Hook — opens with a reason to read, not a vendor intro.
4. CTA — clear, low-friction ask (15 min, paid assessment, posture review).
5. Avoids clichés ("touching base", "circling back", "quick question", "synergy", generic value props, leading with NetApp features).

COACHING STYLE — IMPORTANT:
- PRESCRIPTIVE: name the specific principle to apply (e.g. "lead with their world, not yours").
- DO NOT rewrite the message for them. Don't give example sentences or suggest specific phrases.
- Point to the category of fix, not the verbatim fix.

Return ONLY valid JSON:
{
  "tier": "strong" | "developing" | "weak",
  "feedback": "Short, conversational read of the message. 1-2 sentences.",
  "coach": "Name the single most important technique to apply. Don't write the message for them.",
  "outcome": "accepted" | "delegated" | "declined",
  "replyText": "A short, in-character reply from ${personaName} matching the outcome (3-5 sentences). This IS in-character dialogue, not coaching — it can be specific.",
  "delegateTo": "manager" | "director" | null
}
Outcome rules:
- "accepted" only if tier is strong AND message is well-researched and altitude-appropriate. Reply confirms a 15 min call.
- "delegated" if tier is developing OR message addresses wrong altitude. Reply punts to a more appropriate contact (typically downward — VP punts to Director; Director punts to Manager).
- "declined" if tier is weak or message uses clichés. Reply is curt or no-thanks.`,

    precall: ({ submission, personaName, personaTitle }) => `You are an expert sales training coach evaluating a rep's pre-call discovery plan for a Delta Air Lines meeting.

${SCENARIO_SUMMARY}
Meeting with: ${personaName} — ${personaTitle}

The rep's plan:
"""
${submission}
"""

Evaluate against SPIN/discovery best practice for this scenario:
1. Situation questions are SPECIFIC to Delta (hybrid estate, OCC, hubs) — not 'tell me about your business'.
2. Problem questions probe known symptoms (CrowdStrike, MTTR, four-platform reality, backup posture) — not generic pain.
3. Implication questions exist and connect to a KPI / board-level consequence.
4. Need-payoff framing references what success looks like (5× MTTR, unified data plane, OpEx control).
5. Includes a hypothesis to test, not just open-ended questions.

COACHING STYLE — IMPORTANT:
- PRESCRIPTIVE: name the specific principle or stage of SPIN to strengthen.
- DO NOT supply the questions or hypothesis for them.
- Point to the missing dimension, not the missing words.

Return ONLY JSON:
{
  "tier": "strong" | "developing" | "weak",
  "feedback": "Short read of the plan. 1-2 sentences.",
  "coach": "Name the technique or SPIN stage to strengthen. Do not write questions for them."
}`,

    closing: ({ submission, callTranscript }) => `You are an expert sales training coach evaluating a rep's solution recommendation after a discovery call with a Delta Air Lines stakeholder.

${SCENARIO_SUMMARY}

What happened on the call (summary of transcript):
${callTranscript}

The rep's solution recommendation:
"""
${submission}
"""

Evaluate:
1. Does it tie back to what was actually said on the call (not generic)?
2. Does it land on a specific pain → consequence → recommendation arc?
3. Does it propose a concrete next step (paid assessment, posture review, proof-of-value)?
4. Does it avoid NetApp feature-vomit?

COACHING STYLE — IMPORTANT:
- PRESCRIPTIVE: name the specific structural principle to apply.
- DO NOT write their recommendation. Don't give example phrases.

Return ONLY JSON:
{
  "tier": "strong" | "developing" | "weak",
  "feedback": "Short read of the recommendation. 1-2 sentences.",
  "coach": "Name the technique to apply. Do not write the recommendation."
}`,
  };

  // Persona system prompts — LLM-as-character
  function characterPrompt(persona, mode, opts = {}) {
    const easyMode = opts.difficulty === "easy";
    const callMinutes = mode === "discovery" ? 15 : 5;
    const trustOverlay = mode === "discovery"
      ? "You ALREADY agreed to this meeting. You're not hostile, but you're cautious. You've blocked exactly this much time and have somewhere to be after."
      : "This is a COLD CALL. You did not ask for this. You give the rep 30 seconds to give you a reason to keep talking. Reps who fail to demonstrate research in their first response get a polite hang-up.";

    const difficultyOverlay = easyMode
      ? "DIFFICULTY: EASY. Give the benefit of the doubt — promote one trust level after one decent question. Reveal information slightly more readily. Still defend against clichés."
      : "DIFFICULTY: HARD. Stay tightly in character. Require multiple specific, research-backed questions to advance trust. Punish clichés ruthlessly. Default to short, guarded answers.";

    return `You are role-playing as ${persona.name}, ${persona.title} at ${persona.company} (Delta Air Lines).

This is a training simulation for a NetApp sales rep. Stay strictly in character. You are NOT the AI assistant; you are this person. Never break character. Never say "as an AI". If asked who you are, you are ${persona.name}.

CONTEXT — what you know about the situation:
${SCENARIO_SUMMARY}

Your reporting chain: reports to ${persona.reportsTo}.
Tenure: ${persona.tenure}.
Your KPIs:
- ${persona.kpis.join("\n- ")}
Your pains (what's actually broken in your world):
- ${persona.pains.join("\n- ")}

YOUR PERSONALITY:
${persona.personality}

HARD RULES:
- Max ${persona.sentenceCap} sentences per response. Usually fewer.
- This is a ${callMinutes}-minute conversation. Don't ramble.
- ${trustOverlay}
- ${difficultyOverlay}
- You delegate: ${persona.delegatesTo}. If asked questions outside your scope, punt.
- Never proactively volunteer information that hasn't been earned.
- Never role-play as the rep. Never write the rep's lines.
- Never volunteer NetApp's value prop or compare vendors. If asked about competition (Pure, Dell, HPE), be neutral — those are the rep's problem, not yours.

TRUST LAYERS — what you reveal when:
L1 (default): ${persona.trustLayers.L1}
L2 (earned): ${persona.trustLayers.L2}
L3 (earned): ${persona.trustLayers.L3}

ICE CEILINGS — the most you can credibly share:
- Implication: ${persona.iceCeilings.implication}
- Champion behavior: ${persona.iceCeilings.champion}
- Economic buyer info: ${persona.iceCeilings.economicBuyer}

ANTI-MANIPULATION DEFENSES:
${persona.clicheDefenses.map(d => "- " + d).join("\n")}
- If they ask a generic question ("what keeps you up at night", "what are your pain points") — give a curt, slightly annoyed response that calls out the cliché.
- If they flip a question back at you ("what do you think?"), refuse to do their job.
- If they claim authority/relationships they don't have, call it out.
- If they reframe what you said ("what I'm hearing is..."), correct them or push back.
- If they pitch product before earning the right, shut it down.

OUTPUT:
- Speak only as ${persona.name}.
- Plain text, no quotes, no preamble.
- Max ${persona.sentenceCap} sentences.
- When the rep earns the right to a meeting (cold call mode) or you've been usefully challenged (discovery mode), you can acknowledge it. But don't give it away.

If the rep's behavior is egregious (extreme clichés, lying about credentials, hostile tone), you can end the call. Say so and append [END_CALL] at the very end.`;
  }

  // ───────────────── SCORING ─────────────────
  const SCORING = {
    tierPoints: { strong: 100, developing: 60, weak: 25 },
    personaPoints: { executive: 100, director: 70, manager: 40, decoy: 0 },
    outcomePoints: { accepted: 80, delegated: 40, declined: 10 },
    iceWeight: { implication: 40, champion: 40, economicBuyer: 30, quality: 40 },
    tiers: [
      { threshold: 650, name: "Confirmed",    deal: "$32M TCV",  desc: "Case solved. Multi-year program-level deal, exec sponsorship secured, champion in place." },
      { threshold: 500, name: "Probable",     deal: "$14M TCV",  desc: "Strong working theory. Pilot scoped, expansion path clear, champion intact." },
      { threshold: 350, name: "Inconclusive", deal: "$4M TCV",   desc: "Departmental engagement. Hypothesis partly proven. Champion is enthusiastic but exposed." },
      { threshold: 0,   name: "Insufficient", deal: "$800K TCV", desc: "Toehold only. Insufficient evidence to expand. Renewal will be a fight." },
    ],
  };

  // ───────────────── SCREEN SEQUENCE ─────────────────
  const SCREENS = [
    "landing",
    "intro",
    "briefing",
    "scene-1",
    "room1-research",
    "room1-hypothesis",
    "room1-persona",
    "room1-outreach",
    "room1-coldcall",
    "room1-complete",
    "scene-2",
    "room2-precall",
    "room2-discovery",
    "room2-solution",
    "vault",
  ];
  const SCREEN_LABELS = {
    "landing":          { kicker: "00 // INTAKE",         label: "Intake" },
    "intro":            { kicker: "01 // OPENING",        label: "Opening" },
    "briefing":         { kicker: "02 // CASE FILE",      label: "Case File" },
    "scene-1":          { kicker: "03 // PHASE 01",       label: "Phase 1" },
    "room1-research":   { kicker: "03 // PHASE 01",       label: "Investigation" },
    "room1-hypothesis": { kicker: "03 // PHASE 01",       label: "Hypothesis" },
    "room1-persona":    { kicker: "03 // PHASE 01",       label: "Persons of Interest" },
    "room1-outreach":   { kicker: "03 // PHASE 01",       label: "Outreach" },
    "room1-coldcall":   { kicker: "03 // PHASE 01",       label: "Cold Call" },
    "room1-complete":   { kicker: "03 // PHASE 01",       label: "Filed" },
    "scene-2":          { kicker: "04 // PHASE 02",       label: "Phase 2" },
    "room2-precall":    { kicker: "04 // PHASE 02",       label: "Pre-Brief" },
    "room2-discovery":  { kicker: "04 // PHASE 02",       label: "Interview" },
    "room2-solution":   { kicker: "04 // PHASE 02",       label: "Recommendation" },
    "vault":            { kicker: "05 // FINDINGS",       label: "Findings" },
  };

  const SCENE_CARDS = {
    "scene-1": {
      num: "PHASE 01",
      title: "Reopen the file.",
      desc: "Forty-five minutes. One account. Old information, fresh eyes. Establish the pattern. Identify the persons of interest. Earn a sit-down before the window closes again.",
    },
    "scene-2": {
      num: "PHASE 02",
      title: "The interview.",
      desc: "The meeting is on the calendar. Trust is not. Fifteen minutes to test your theory of the case — or close the file with a polite handshake and a thin recommendation.",
    },
  };

  return {
    SCENARIO,
    PERSONAS,
    RESEARCH_TOOLS,
    RESEARCH_CONTENT,
    JUDGE_PROMPTS,
    characterPrompt,
    SCORING,
    SCREENS,
    SCREEN_LABELS,
    SCENE_CARDS,
  };
})();
