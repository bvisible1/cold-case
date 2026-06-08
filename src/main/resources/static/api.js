// api.js — thin wrapper around window.claude.complete
// Two patterns:
//   evaluate(systemPrompt) → returns parsed JSON object (LLM-as-judge)
//   streamChat({system, messages, onChunk, onDone}) → simulated streaming chat

window.HEIST_API = (() => {

  // Strip code fences and try to parse the first JSON object in the text.
  function extractJSON(text) {
    if (!text) return null;
    let t = String(text).trim();
    t = t.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    // find first { and matching last }
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    try {
      return JSON.parse(t.slice(start, end + 1));
    } catch (e) {
      return null;
    }
  }

  async function evaluate(systemPrompt) {
    if (!window.claude || !window.claude.complete) {
      console.warn("[HEIST_API] claude unavailable — returning fallback");
      return {
        tier: "developing",
        feedback: "(Offline fallback) Your submission was received. AI scoring is unavailable in this environment.",
        coach: "Connect Claude to enable scoring.",
      };
    }
    try {
      const raw = await window.claude.complete(systemPrompt);
      const parsed = extractJSON(raw);
      if (parsed) return parsed;
      return {
        tier: "developing",
        feedback: raw.slice(0, 240),
        coach: "Could not parse AI response — showing raw text.",
      };
    } catch (e) {
      console.error("[HEIST_API] evaluate failed", e);
      return {
        tier: "developing",
        feedback: "Evaluation failed: " + e.message,
        coach: "Try again.",
      };
    }
  }

  // Chunk a finished string into typed-feeling deltas.
  function chunk(text, onChunk) {
    return new Promise((resolve) => {
      const words = text.split(/(\s+)/);
      let i = 0;
      const interval = setInterval(() => {
        if (i >= words.length) {
          clearInterval(interval);
          resolve();
          return;
        }
        // Emit 1-3 words per tick for natural pacing
        const burst = Math.min(words.length - i, 1 + Math.floor(Math.random() * 3));
        const piece = words.slice(i, i + burst).join("");
        i += burst;
        onChunk(piece);
      }, 28 + Math.random() * 30);
    });
  }

  async function chat({ system, messages, onChunk }) {
    if (!window.claude || !window.claude.complete) {
      const fallback = "(Offline) Persona AI is unavailable. The trainer would be skeptical here.";
      if (onChunk) await chunk(fallback, onChunk);
      return fallback;
    }
    try {
      // Build a single composed conversation for window.claude.complete.
      // The Claude helper takes either a string or {messages}. We use messages.
      const composed = {
        messages: [
          { role: "user", content:
            `[SYSTEM INSTRUCTIONS — follow strictly]\n${system}\n\n[CONVERSATION SO FAR]\n` +
            messages.map(m => (m.role === "user" ? "Rep: " : `${m.role === "assistant" ? "You" : "System"}: `) + m.content).join("\n") +
            `\n\nRespond now, in character. Plain text only. Max sentence cap as specified above.`
          }
        ],
      };
      const raw = await window.claude.complete(composed);
      const text = (raw || "").trim();
      if (onChunk) await chunk(text, onChunk);
      return text;
    } catch (e) {
      console.error("[HEIST_API] chat failed", e);
      const fallback = "[Connection issue — try again]";
      if (onChunk) await chunk(fallback, onChunk);
      return fallback;
    }
  }

  // Score the conversation so far (used at end of cold call / discovery)
  async function scoreConversation({ transcript, mode, persona }) {
    const sys = `You are a sales training scoring engine. The rep represents Dynatrace (a unified observability + security platform) and is working Meridian Capital Group — a Category III regional bank mid-integration, recovering from a public mobile-banking outage, with monitoring tool sprawl (Splunk + IBM Instana), an AWS/Kubernetes buildout, and a prior Dynatrace evaluation that went cold. Strong reps tie discovery to those realities (earlier detection/MTTD, MTTR, tool consolidation cost, OCC/Category III exam readiness, instrumenting AI workloads) rather than pitching features.

Analyze this ${mode} conversation transcript with persona ${persona.name} (${persona.title}).

Transcript:
${transcript.map(m => `${m.role === "user" ? "Rep" : persona.name}: ${m.content}`).join("\n")}

Score these dimensions 0-100 each:
- implication: did the rep probe consequences / what NOT solving means (e.g. a repeat outage during the OCC exam, the cost of tool sprawl, stalled AI rollout)?
- champion: did the rep build rapport / earn trust with this contact?
- economicBuyer: did the rep surface budget / decision authority / process (CIO/CTO/CFO, the lifted freeze, the prior evaluation)?
- quality: overall conversational quality (avoided clichés, asked specific researched questions, listened)

Also determine:
- meetingEarned: true if the persona agreed to a follow-up meeting (cold call only). For discovery, true if a clear next step was earned.
- endedEarly: true if the call was cut short by hostility.

Return ONLY JSON:
{
  "implication": 0-100,
  "champion": 0-100,
  "economicBuyer": 0-100,
  "quality": 0-100,
  "meetingEarned": true | false,
  "endedEarly": true | false,
  "summary": "2-sentence read of the conversation."
}`;
    return await evaluate(sys);
  }

  // Simple research-agent chat (not full streaming — single-turn replies based on scenario)
  async function researchAgent(question) {
    const sys = `You are a research assistant helping a sales rep research Meridian Capital Group (a fictitious training account). Be concise (2-4 sentences). What you know:
- Meridian Capital Group: ~$4.8B net revenue (FY2025), ~14,200 employees, $310B total assets, 420+ branches across the US Southeast & Mid-Atlantic. HQ Charlotte, NC. Mid-tier regional commercial bank, wealth management, and capital markets.
- March 14, 2026: a ~6-hour mobile banking outage caused by a failed payments-middleware deployment — not detected until customers were impacted. Covered by Charlotte Business Journal and American Banker.
- Crossed $100B total assets in Q3 2025, so it is now a Category III institution under enhanced OCC examination (began January 2026) of technology risk, incident response, and operational resilience.
- Heritage Southern acquisition (2023) is ~70% integrated. Dual core banking: FIS Modern Banking Platform (primary) + legacy Fiserv Premier (migrating, final 40% of branches by Q4 2026). This dual stack drives fragmented pipelines, inconsistent logging, and monitoring blind spots.
- Monitoring today: IBM Instana (from Heritage) + Splunk (enterprise log management) + point tools. Job postings reference 'next-generation observability platforms' and OpenTelemetry — an active evaluation.
- Meridian Forward Phase 3: AWS-first cloud-native buildout (Kubernetes, Terraform, ArgoCD), a real-time payments hub, the 'Merit' AI assistant, zero-trust. AI efficiency target of ~$80M annual gains by 2027.
- Prior Dynatrace deal: a POC ran Nov 2024–Jan 2025 (shortlisted with Datadog; Dynatrace scored higher on AI causal analysis and Kubernetes observability). It stalled in April 2025 after a Q1 NII miss triggered a 90-day IT spend freeze. No rejection — went quiet ~13 months ago. The freeze has since lifted.
- Leadership: CIO Robert Callahan (ex-Wells Fargo, the original economic buyer). First-ever CTO Brian Sorrell (ex-Capital One, May 2026; an observability-first proponent who used Dynatrace at Capital One). CISO Kevin Landers (since June 2025). CFO Thomas Greer.
- Playable personas: Rachel Morgan (VP, Infrastructure & Platform Engineering) → reports to CTO Brian Sorrell. Daniel Hughes (Director, Site Reliability Engineering) → reports to Rachel. Priya Natarajan (Manager, Observability & Monitoring) → reports to Daniel.
- The rep represents Dynatrace (unified observability + security platform). Competition in the room: Datadog, Splunk (Cisco), IBM Instana.

Rep's question:
"""
${question}
"""

Respond as a research analyst. Don't speculate beyond the above. If asked something unknowable, say so.`;
    if (!window.claude || !window.claude.complete) {
      return "[Offline] Research agent unavailable. Try the other tools.";
    }
    try {
      const raw = await window.claude.complete(sys);
      return (raw || "").trim();
    } catch (e) {
      return "[Connection issue]";
    }
  }

  return { evaluate, chat, scoreConversation, researchAgent };
})();
