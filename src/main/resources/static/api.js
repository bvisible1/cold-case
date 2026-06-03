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
    const sys = `You are a sales training scoring engine. Analyze this ${mode} conversation transcript with persona ${persona.name} (${persona.title}).

Transcript:
${transcript.map(m => `${m.role === "user" ? "Rep" : persona.name}: ${m.content}`).join("\n")}

Score these dimensions 0-100 each:
- implication: did the rep probe consequences / what NOT solving means?
- champion: did the rep build rapport / earn trust with this contact?
- economicBuyer: did the rep surface budget / decision authority / process?
- quality: overall conversational quality (avoided clichés, asked specific questions, listened)

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
    const sys = `You are a research assistant helping a sales rep research Delta Air Lines. Be concise (2-4 sentences). What you know:
- Delta Air Lines: ~$58B revenue (FY2024), ~100,000 employees, ~900 aircraft, 7 major US hubs.
- July 2024 CrowdStrike outage was the worst for Delta of any airline: ~7,000 cancellations, ~$500M financial impact, ongoing litigation and DOT scrutiny.
- Board greenlit a multi-year resilience and modernization program. CIO Rahul Samant publicly committed to a 5× MTTR improvement.
- Hybrid cloud: Microsoft Azure is the strategic primary (since 2018), AWS for select workloads, ops-critical workloads still on-prem at the Atlanta OCC.
- Storage estate: four primary platforms, ~25% of arrays 5+ years old, several past end-of-support.
- Backup success rate ~91% vs 99% target; last full restore test took 11 hours.
- Key personas: Sarah Chen (VP, Global Data Infrastructure) → reports to CIO Rahul Samant. Michael Torres (Director, Data Platform Engineering) → reports to Sarah. Marcus Webb (Manager, Storage Infrastructure) → reports to Michael.
- Open hiring: Principal Architect AI Infrastructure, Director Hybrid Cloud Engineering, Senior SRE (OCC), Manager Storage Operations.
- The rep represents NetApp. Competition in the room: Pure Storage, Dell, HPE.

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
