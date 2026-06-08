// screens-room2.jsx — Phase 2, fully built out.
// Pre-Interview Brief · The Interview (discovery) · Theory of the Case · Findings reveal.

const { useState: useStateR2, useEffect: useEffectR2, useRef: useRefR2, useMemo: useMemoR2 } = React;

const PKEY_R2 = { sarah: "rachel", michael: "daniel", marcus: "priya" };
function faceFor(persona) { return "assets/face-" + (PKEY_R2[persona.id] || "rachel") + ".png"; }
function resolveP2Persona(state) {
  const id = state.discoveryPersonaId || state.coldCallPersonaId || state.targetPersona || "sarah";
  return window.HEIST_DATA.PERSONAS.find(p => p.id === id) || window.HEIST_DATA.PERSONAS[0];
}

// Shared dossier card (left rail) ─────────────────────────────
function SubjectDossier({ persona, state, children }) {
  const cs = state.coldCallScore || {};
  const lvl = (n) => n == null ? "open" : n >= 70 ? "lit" : n >= 45 ? "partial" : "open";
  const signals = [
    { k: "Implication of pain", v: cs.implication },
    { k: "Champion rapport", v: cs.champion },
    { k: "Economic buyer", v: cs.economicBuyer },
  ];
  return (
    <aside className="p2-subject">
      <div className="p2-stamp">SUBJECT · ON FILE</div>
      <div className="p2-photo"><span className="p2-photo-tab">Cleared · On File</span><img src={faceFor(persona)} alt={persona.name} /></div>
      <div className="p2-subj-nm">{persona.name}</div>
      <div className="p2-subj-ti">{persona.title}</div>
      <div className="p2-subj-co">{persona.company}</div>

      <div className="p2-divider"></div>
      <div className="p2-est-l">// Established in Phase 01</div>
      <div className="p2-signals">
        {signals.map((s, i) => (
          <div key={i} className={"p2-sig " + lvl(s.v)}>
            <span className="dot"></span><span className="k">{s.k}</span>
            <span className="v">{s.v == null ? "—" : lvl(s.v) === "lit" ? "strong" : lvl(s.v) === "partial" ? "partial" : "thin"}</span>
          </div>
        ))}
      </div>
      {children}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────
// CONTACT REVIEW — meet who you earned in Phase 1
// ─────────────────────────────────────────────────────────
function ContactReviewScreen({ state, nav }) {
  const persona = resolveP2Persona(state);
  const first = persona.name.split(" ")[0];
  const focus = persona.reviewFocus || (persona.pains || []).slice(0, 3);
  return (
    <div className="p2-stage contact-review-stage">
      <div className="p2-grain"></div>
      <div className="cr-wrap">
        <div className="cr-kicker">Case Room 02 · <span className="here">You Are Here</span></div>
        <h1 className="cr-title">Discovery Call</h1>
        <p className="cr-sub">"You earned the sit-down. Now uncover what actually matters — or walk out with a polite brush-off."</p>

        <div className="cr-card">
          <div className="cr-stamp">CLEARED IN PHASE 01</div>
          <div className="cr-head">
            <div className="cr-photo"><img src={faceFor(persona)} alt={persona.name} /></div>
            <div className="cr-id">
              <div className="cr-l">Your Contact</div>
              <div className="cr-nm">{persona.name}</div>
              <div className="cr-ti">{persona.title} · {persona.company}</div>
              <div className="cr-tag">{persona.tag}</div>
            </div>
          </div>
          <p className="cr-bio">{persona.bio}</p>
          <div className="cr-focus">
            <div className="cr-focus-l">// On their desk right now</div>
            <ul>
              {focus.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>

        <div className="cr-goal">
          <span className="cr-goal-l">The goal:</span> Uncover the <strong>Implication of Pain</strong>, the <strong>Economic Buyer</strong>, and the <strong>Champion</strong> (ICE). Deliver a recommendation tied to <em>what {first} actually told you</em> — then earn the scoping call. Generic pitches get "send me some materials."
        </div>

        {/* What you'll cover in Room 2 */}
        <div className="cr-journey">
          <div className="cr-journey-h">— What You'll Cover in Room 2 —</div>
          <img className="cr-journey-img" src="assets/room2-fingerprints.png" alt="Room 2 journey: Pre-Call Plan, Discovery Call, Closing, Solution Recommendation" />
        </div>

        <div className="cr-actions">
          <button className="btn btn-ghost" onClick={() => nav("scene-2")}>↩ Back</button>
          <button className="btn btn-primary" onClick={() => nav("room2-precall", { discoveryPersonaId: persona.id })}>
            Build Your Pre-Call Plan →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PRE-CALL PLAN — exact CSI case-file image with editable fields
// ─────────────────────────────────────────────────────────
const SPIN_FIELDS = [
  { key: "S", ph: "e.g. You're running two core-banking systems through the Heritage integration while the OCC starts its first Category III exam…" },
  { key: "P", ph: "e.g. Where does the current monitoring actually miss things — and how often does your team feel it?" },
  { key: "I", ph: "e.g. When a bad deploy slips through undetected, who hears about it — and what does that cost during an exam window?" },
  { key: "N", ph: "e.g. If a deploy regression surfaced before customers ever saw it, what changes for you and for the board conversation?" },
];
const SPIN_NAMES = { S: "Situation", P: "Problem", I: "Implication", N: "Need-Payoff" };

function PreCallScreen({ state, nav }) {
  const persona = resolveP2Persona(state);
  const [spin, setSpin] = useStateR2(state.precallSpin || { S: "", P: "", I: "", N: "" });
  const [eval_, setEval] = useStateR2(state.precallEval || null);
  const [busy, setBusy] = useStateR2(false);

  const setField = (k, v) => setSpin(s => ({ ...s, [k]: v }));
  const filled = SPIN_FIELDS.filter(f => (spin[f.key] || "").trim()).length;
  const allText = SPIN_FIELDS.map(f => SPIN_NAMES[f.key].toUpperCase() + ":\n" + (spin[f.key] || "").trim()).join("\n\n");

  const submit = async () => {
    if (filled < 2 || busy) return;
    setBusy(true);
    const result = await window.HEIST_API.evaluate(
      window.HEIST_DATA.JUDGE_PROMPTS.precall({ submission: allText, personaName: persona.name, personaTitle: persona.title })
    );
    setEval(result);
    setBusy(false);
  };

  const BOX_TOP = { S: "35.4%", P: "52.0%", I: "68.4%", N: "85.6%" };

  if (eval_) return (
    <AssessmentPage
      result={eval_}
      label="Plan assessment"
      phase="Discovery · Pre-Call Plan"
      onRevise={() => setEval(null)}
      continueLabel="Enter the Discovery Call →"
      onContinue={() => nav("room2-discovery", { precallSpin: spin, precallPlan: allText, precallEval: eval_, discoveryPersonaId: persona.id })}
    />
  );

  return (
    <div className="precall-exact-stage">
      <div className="pc-frame">
        <img className="exact-img" src="assets/precall-exact.png" alt="Pre-Call Discovery Plan" />

        {/* Auto-filled persona briefing line */}
        <div className="pc-intro">
          You are meeting with {persona.name}, {persona.title} at {persona.company}. Plan questions to cast the widest net and uncover measurable impacts of pain.
        </div>

        {/* Editable SPIN boxes */}
        {SPIN_FIELDS.map((f) => (
          <textarea
            key={f.key}
            className="pc-box"
            style={{ top: BOX_TOP[f.key] }}
            value={spin[f.key] || ""}
            placeholder={f.ph}
            onChange={e => setField(f.key, e.target.value)}
          ></textarea>
        ))}
      </div>

      {/* Floating action bar */}
      <div className="pc-actionbar">
        <span className="pc-ab-count">{filled}/4 drafted</span>
        <button className="btn btn-ghost" onClick={() => nav("room2-contact")}>↩ Back</button>
        {!eval_ ? (
          <button className="btn btn-primary" onClick={submit} disabled={filled < 2 || busy}>
            {busy ? "Reviewing…" : filled < 2 ? "Draft at least 2" : "Review Plan →"}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => nav("room2-discovery", { precallSpin: spin, precallPlan: allText, precallEval: eval_, discoveryPersonaId: persona.id })}>
            Enter the Discovery Call →
          </button>
        )}
      </div>
    </div>
  );
}

// Forensic eval card ──────────────────────────────────────────
function ForensicEval({ result, label }) {
  if (!result) return null;
  const tier = (result.tier || "developing").toLowerCase();
  const tierMap = { strong: "Strong", developing: "Developing", weak: "Thin" };
  return (
    <div className={"p2-eval " + tier}>
      <div className="p2-eval-head">
        <span className="p2-eval-l">{label || "Assessment"}</span>
        <span className="p2-eval-tier">{tierMap[tier] || tier}</span>
      </div>
      <div className="p2-eval-fb">{result.feedback}</div>
      {result.coach && <div className="p2-eval-coach"><span className="lbl">Coaching</span>{result.coach}</div>}
    </div>
  );
}

// Full-page assessment (replaces popups) ──────────────────────
function AssessmentPage({ result, label, phase, onRevise, onContinue, continueLabel }) {
  const tier = (result.tier || "developing").toLowerCase();
  const head = tier === "strong" ? "Strong work." : tier === "weak" ? "This needs another pass." : "Solid — with gaps.";
  return (
    <div className="p2-stage">
      <div className="p2-grain"></div>
      <div className="p2-wrap" style={{ maxWidth: 760 }}>
        <header className="p2-head">
          <div className="p2-phase">{phase || "Discovery · Assessment"}</div>
          <h1 className="p2-htitle">{head}</h1>
          <p className="p2-hsub">Here's how that read. Revise it, or carry it forward.</p>
        </header>
        <ForensicEval result={result} label={label} />
        <div className="p2-actions">
          <button className="btn btn-ghost" onClick={onRevise}>↩ Revise</button>
          <button className="btn btn-primary" onClick={onContinue}>{continueLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// THE INTERVIEW (discovery — custom chat)
// ─────────────────────────────────────────────────────────
function DiscoveryScreen({ state, nav, difficulty }) {
  const persona = resolveP2Persona(state);
  const first = persona.name.split(" ")[0];

  const [messages, setMessages] = useStateR2([]);
  const [draft, setDraft] = useStateR2("");
  const [busy, setBusy] = useStateR2(false);
  const [typing, setTyping] = useStateR2("");
  const [ice, setIce] = useStateR2({ implication: false, champion: false, economicBuyer: false });
  const [elapsed, setElapsed] = useStateR2(0);
  const [ending, setEnding] = useStateR2(false);
  const [scored, setScored] = useStateR2(null);
  const logRef = useRefR2(null);

  // elapsed timer (counts up — no auto-end)
  useEffectR2(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // persona opens
  useEffectR2(() => {
    (async () => {
      setBusy(true); setTyping("");
      const sys = window.HEIST_DATA.characterPrompt(persona, "discovery", { difficulty });
      const reply = await window.HEIST_API.chat({
        system: sys,
        messages: [{ role: "user", content: "[The scheduled meeting has just started. Greet the rep briefly, in character — cautious but not hostile.]" }],
        onChunk: (c) => setTyping(t => t + c),
      });
      setTyping(""); setMessages([{ role: "assistant", content: reply }]); setBusy(false);
    })();
  }, []);

  useEffectR2(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages, typing, scored]);

  useEffectR2(() => {
    const t = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase()).join(" ");
    setIce({
      implication: /(impact|cost of|what happens if|consequence|board|cfo|miss|downtime|recover|risk|expos|outage|fail)/i.test(t),
      champion: /(who else|stakeholder|champion|sponsor|your team|trust|recommend|internally|advocate)/i.test(t),
      economicBuyer: /(budget|spend|approve|decision|sign off|fund|priorit|invest|economic|cost)/i.test(t),
    });
  }, [messages]);

  const send = async () => {
    if (!draft.trim() || busy || ending) return;
    const next = [...messages, { role: "user", content: draft.trim() }];
    setMessages(next); setDraft(""); setBusy(true); setTyping("");
    const sys = window.HEIST_DATA.characterPrompt(persona, "discovery", { difficulty });
    const reply = await window.HEIST_API.chat({ system: sys, messages: next, onChunk: (c) => setTyping(t => t + c) });
    setTyping(""); setMessages([...next, { role: "assistant", content: reply }]); setBusy(false);
    if (/\[END_CALL\]/i.test(reply)) setTimeout(() => endInterview(), 1200);
  };

  const endInterview = async () => {
    if (ending) return;
    setEnding(true); setBusy(true);
    const score = await window.HEIST_API.scoreConversation({ transcript: messages, mode: "discovery", persona });
    setScored(score); setBusy(false);
  };

  const proceed = () => nav("room2-closing", {
    discoveryTranscript: messages,
    discoveryScore: scored || { implication: 30, champion: 30, economicBuyer: 30, quality: 30, meetingEarned: false, summary: "Interview ended early." },
  });

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const iceRows = [
    { key: "implication", label: "Implication of Pain", hint: "What does NOT solving cost?" },
    { key: "champion", label: "Champion Behavior", hint: "Who carries this internally?" },
    { key: "economicBuyer", label: "Economic Buyer", hint: "Who funds and decides?" },
  ];

  return (
    <div className="p2-stage interview">
      <div className="p2-grain"></div>
      <header className="p2-ihead">
        <div className="p2-ihead-l">
          <span className="rec"><span className="dot"></span> REC</span>
          <span className="p2-ititle">Discovery Call<span className="sub"> · on the record</span></span>
          <span className="p2-wave" aria-hidden="true">
            {[7,13,20,28,18,24,12,30,16,22,9,26,14,19,11,23,8,17].map((h, i) => <span key={i} style={{ height: h }}></span>)}
          </span>
        </div>
        <div className="p2-itimer-wrap">
          <span className="p2-itimer-l">Interview Time</span>
          <span className="p2-itimer">⏱ {mm}:{ss}</span>
        </div>
      </header>

      <div className="p2-interview">
        <SubjectDossier persona={persona} state={state}>
          <div className="p2-divider"></div>
          <div className="p2-est-l">// Live read — this interview</div>
          <div className="p2-ice">
            {iceRows.map((r) => (
              <div key={r.key} className={"p2-ice-row " + (ice[r.key] ? "lit" : "")}>
                <span className="ice-dot"></span>
                <span className="ice-meta"><span className="ice-l">{r.label}</span><span className="ice-h">{r.hint}</span></span>
              </div>
            ))}
          </div>
          <div className="p2-isub-foot">
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={endInterview} disabled={ending || messages.length === 0}>
              End Interview &amp; Score
            </button>
            <div className="p2-diff">Subject posture: {(difficulty || "hard").toUpperCase()}</div>
          </div>
        </SubjectDossier>

        <main className="p2-chat">
          <div className="p2-log thin-scroll" ref={logRef}>
            <div className="p2-sys">— Recording started. {persona.name} is in the room. —</div>
            {messages.map((m, i) => (
              <div key={i} className={"p2-turn " + (m.role === "user" ? "you" : "them")}>
                <div className="p2-who">{m.role === "user" ? "YOU" : persona.name.toUpperCase()}</div>
                <div className="p2-bubble">{m.content.replace(/\[END_CALL\]/gi, "").trim()}</div>
              </div>
            ))}
            {typing && (
              <div className="p2-turn them">
                <div className="p2-who">{persona.name.toUpperCase()}</div>
                <div className="p2-bubble">{typing}<span className="p2-caret">▍</span></div>
              </div>
            )}
            {busy && !typing && (
              <div className="p2-turn them"><div className="p2-who">{persona.name.toUpperCase()}</div><div className="p2-bubble"><div className="typing"><span></span><span></span><span></span></div></div></div>
            )}
            {scored && (
              <div className="p2-coach">
                <div className="kicker" style={{ marginBottom: 10 }}>// Interview closed — case notes</div>
                <div className="p2-coach-sum">{scored.summary}</div>
                <div className={"p2-coach-meet " + (scored.meetingEarned ? "ok" : "no")}>
                  {scored.meetingEarned ? "✓ Earned a clear next step" : "✗ No firm next step — the theory stays unproven"}
                </div>
                <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={proceed}>File Your Theory →</button>
              </div>
            )}
          </div>
          {!scored && (
            <div className="p2-input">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={busy ? (first + " is answering…") : "Ask your question…"}
                disabled={busy || ending}
              ></textarea>
              <button className="p2-send" onClick={send} disabled={busy || ending || !draft.trim()}>SEND →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CLOSING — value prop & ask
// ─────────────────────────────────────────────────────────
function ClosingScreen({ state, nav }) {
  const persona = resolveP2Persona(state);
  const first = persona.name.split(" ")[0];
  const [vp, setVp] = useStateR2(state.closingVp || "");
  const [ask, setAsk] = useStateR2(state.closingAsk || "");
  const [eval_, setEval] = useStateR2(state.closingEval || null);
  const [busy, setBusy] = useStateR2(false);

  const submit = async () => {
    if ((!vp.trim() && !ask.trim()) || busy) return;
    setBusy(true);
    const transcript = (state.discoveryTranscript || []).map(m => `${m.role === "user" ? "Rep" : persona.name}: ${m.content}`).join("\n").slice(0, 2500);
    const result = await window.HEIST_API.evaluate(
      window.HEIST_DATA.JUDGE_PROMPTS.closing({
        submission: "VALUE PROPOSITION:\n" + vp + "\n\nTHE ASK / NEXT STEP:\n" + ask,
        callTranscript: transcript || "(no transcript available)",
      })
    );
    setEval(result);
    setBusy(false);
  };

  if (eval_) return (
    <AssessmentPage
      result={eval_}
      label="Close assessment"
      phase="Discovery · Closing"
      onRevise={() => setEval(null)}
      continueLabel="Shape the Solution →"
      onContinue={() => nav("room2-solution", { closingVp: vp, closingAsk: ask, closingEval: eval_ })}
    />
  );

  return (
    <div className="p2-stage">
      <div className="p2-grain"></div>
      <div className="p2-wrap" style={{ maxWidth: 940 }}>
        <header className="p2-head">
          <div className="p2-phase">Discovery · Closing</div>
          <h1 className="p2-htitle">Deliver Your Value Prop &amp; Close</h1>
          <p className="p2-hsub">
            Based on what {first} told you — not what you assumed going in. Connect to their specific pain. Ask for the meeting.
          </p>
        </header>

        <label className="cl-field">
          <span className="cl-l">Your Value Proposition (for {persona.name})</span>
          <textarea
            className="cl-area"
            value={vp}
            onChange={e => setVp(e.target.value)}
            placeholder="Tie this to what they told you in the call. Use their language. Quantify impact where possible. No product names — outcomes only."
          ></textarea>
        </label>

        <label className="cl-field">
          <span className="cl-l">Your Ask — The Next Step</span>
          <textarea
            className="cl-area short"
            value={ask}
            onChange={e => setAsk(e.target.value)}
            placeholder="Be specific. Not 'can we get on a call?' — but WHY, WHEN, WHO needs to be in the room, and what you'd cover."
          ></textarea>
        </label>

        <div className="cl-reminder">
          <div className="cl-reminder-l">Reminder</div>
          <div className="cl-reminder-t">The persona knows what they told you. If your value prop mentions something they didn't share, it breaks credibility. Stay grounded in the conversation.</div>
        </div>

        <div className="p2-actions">
          <button className="btn btn-ghost" onClick={() => nav("room2-discovery")}>↩ Back</button>
          <button className="cl-deliver" onClick={submit} disabled={(!vp.trim() && !ask.trim()) || busy}>
            {busy ? "Evaluating…" : "Deliver & Close →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SOLUTION RECOMMENDATION — selectable capability builder
// ─────────────────────────────────────────────────────────
const SOL_CAPS = [
  { id: "infra", cat: "Infrastructure", title: "Infrastructure Observability", icon: "cloud", desc: "Full-stack visibility across hybrid and multi-cloud infrastructure. Detect issues faster and reduce MTTR." },
  { id: "app", cat: "Application", title: "Application Observability", icon: "code", desc: "Deep code-level insights and distributed tracing to optimize application performance and reliability." },
  { id: "dx", cat: "Digital Experience", title: "Digital Experience Monitoring", icon: "user", desc: "Real user and synthetic monitoring to ensure seamless digital experiences across every channel." },
  { id: "logs", cat: "Data & Analytics", title: "Log Analytics", icon: "bars", desc: "Centralized log management with powerful analytics and correlation at scale." },
  { id: "ai", cat: "AI & Automation", title: "Davis® AI", icon: "brain", desc: "AI-powered insights, anomaly detection, and root cause analysis that accelerates resolution." },
  { id: "auto", cat: "Automation", title: "Cloud Automation", icon: "cloud2", desc: "Automate operations and optimize cloud resources across dynamic environments." },
];
function SolIcon({ kind }) {
  const s = { width: 26, height: 26, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "cloud") return <svg {...s} viewBox="0 0 24 24"><path d="M6 18a4 4 0 010-8 5 5 0 019.6-1.3A3.5 3.5 0 0118 18z"/></svg>;
  if (kind === "code") return <svg {...s} viewBox="0 0 24 24"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/></svg>;
  if (kind === "user") return <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0113 0"/></svg>;
  if (kind === "bars") return <svg {...s} viewBox="0 0 24 24"><path d="M5 19V11M10 19V6M15 19v-5M20 19v-9"/></svg>;
  if (kind === "brain") return <svg {...s} viewBox="0 0 24 24"><path d="M9 4a2.5 2.5 0 00-2.5 2.5A2.5 2.5 0 005 11a2.5 2.5 0 002 4 2.5 2.5 0 005 .5V5.5A2.5 2.5 0 009 4zM15 4a2.5 2.5 0 012.5 2.5A2.5 2.5 0 0119 11a2.5 2.5 0 01-2 4 2.5 2.5 0 01-5 .5"/></svg>;
  return <svg {...s} viewBox="0 0 24 24"><path d="M6 18a4 4 0 010-8 5 5 0 019.6-1.3A3.5 3.5 0 0118 18z"/><path d="M9 14l2 2 4-4"/></svg>;
}
const SOL_DIFF_ICONS = ["shield", "brain", "globe"];
function DiffIcon({ kind }) {
  const s = { width: 17, height: 17, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "shield") return <svg {...s} viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/></svg>;
  if (kind === "brain") return <svg {...s} viewBox="0 0 24 24"><path d="M9 4a2.5 2.5 0 00-2.5 2.5A2.5 2.5 0 005 11a2.5 2.5 0 002 4 2.5 2.5 0 005 .5V5.5A2.5 2.5 0 009 4z"/></svg>;
  return <svg {...s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>;
}

function SolutionScreen({ state, nav }) {
  const persona = resolveP2Persona(state);
  const first = persona.name.split(" ")[0];
  const [selected, setSelected] = useStateR2(state.solutionCaps || []);
  const [reasons, setReasons] = useStateR2(state.solutionReasons || ["", "", ""]);
  const [diffs, setDiffs] = useStateR2(state.solutionDiffs || ["", "", ""]);
  const [eval_, setEval] = useStateR2(state.solutionEval || null);
  const [busy, setBusy] = useStateR2(false);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const setReason = (i, v) => setReasons(r => r.map((x, j) => j === i ? v : x));
  const setDiff = (i, v) => setDiffs(d => d.map((x, j) => j === i ? v : x));
  const selCaps = SOL_CAPS.filter(c => selected.includes(c.id));

  const compose = () => {
    let t = "Selected capabilities: " + (selCaps.map(c => c.title).join(", ") || "(none)") + "\n\n";
    t += "Why this solution:\n" + reasons.filter(Boolean).map(r => "- " + r).join("\n") + "\n\n";
    t += "What makes it different:\n" + diffs.filter(Boolean).map(d => "- " + d).join("\n");
    return t;
  };

  const lockIn = async () => {
    if (selected.length === 0 || busy) return;
    setBusy(true);
    const transcript = (state.discoveryTranscript || []).map(m => `${m.role === "user" ? "Rep" : persona.name}: ${m.content}`).join("\n").slice(0, 2500);
    const result = await window.HEIST_API.evaluate(
      window.HEIST_DATA.JUDGE_PROMPTS.closing({ submission: compose(), callTranscript: transcript || "(no transcript available)" })
    );
    setEval(result);
    setBusy(false);
  };

  if (eval_) return (
    <AssessmentPage
      result={eval_}
      label="Recommendation assessment"
      phase="Discovery · Solution Recommendation"
      onRevise={() => setEval(null)}
      continueLabel="Reveal Findings →"
      onContinue={() => nav("vault", { solutionCaps: selected, solutionReasons: reasons, solutionDiffs: diffs, solution: compose(), solutionEval: eval_ })}
    />
  );

  return (
    <div className="sol-stage">
      <div className="sol-topbar">● DOSSIER · M-2026 · PREPARED BY YOUR CREW</div>
      <div className="sol-sheet">
        <div className="sol-head">
          <div className="sol-brand"><span className="sol-cube"></span> dynatrace</div>
          <div className="sol-progress"><span></span></div>
          <div className="sol-roompill">Room 2: Solution Recommendation</div>
        </div>

        <div className="sol-grid">
          {/* Left rail */}
          <aside className="sol-rail">
            <div className="sol-rail-kicker">Solutions Overview Proposal</div>
            <h1 className="sol-client">Meridian Group</h1>
            <div className="sol-rule"></div>
            <p className="sol-rail-desc">A recommended data &amp; resilience foundation to modernize operations, accelerate recovery, and drive business outcomes at scale.</p>

            <div className="sol-box">
              <div className="sol-box-l">Proposed Solution Architecture</div>
              {selCaps.length === 0 ? (
                <div className="sol-arch-empty">Your stack will be built from the platform capabilities you select.</div>
              ) : (
                <div className="sol-arch-built">
                  {selCaps.map((c, i) => (
                    <div className="sol-arch-block" key={c.id}>
                      {i > 0 && <div className="sol-arch-arrow">↓</div>}
                      <div className="sol-arch-item">
                        <div className="sol-arch-cat"><span className="ic"><SolIcon kind={c.icon} /></span>{c.cat}</div>
                        <div className="sol-arch-graphic"><SolIcon kind={c.icon} /></div>
                        <div className="sol-arch-t">{c.title}</div>
                        <div className="sol-arch-d">{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sol-box outcome">
              <div className="sol-box-l">Business Outcome</div>
              <div className="sol-check">✓</div>
              <div className="sol-outcome-t">Modernize operations. Cut recovery time. Drive measurable business impact.</div>
              <div className="sol-outcome-s">A resilience foundation built for Meridian Group's next chapter.</div>
            </div>
          </aside>

          {/* Main */}
          <main className="sol-main">
            <div className="sol-step">Step 2 of 2 — Shape the Solution</div>
            <h2 className="sol-q">Based on what you learned from {first}, what would you recommend?</h2>
            <p className="sol-sub">Choose the platform capabilities that address the pains {first} surfaced. Mix and match as needed to build the right recommendation.</p>

            <div className="sol-cards">
              {SOL_CAPS.map(c => {
                const on = selected.includes(c.id);
                return (
                  <button key={c.id} className={"sol-card" + (on ? " on" : "")} onClick={() => toggle(c.id)}>
                    <span className="sol-card-ico"><SolIcon kind={c.icon} /></span>
                    <span className={"sol-check-box" + (on ? " on" : "")}>{on ? "✓" : ""}</span>
                    <span className="sol-card-cat">{c.cat}</span>
                    <span className="sol-card-t">{c.title}</span>
                    <span className="sol-card-d">{c.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="sol-lists">
              <div className="sol-list">
                <div className="sol-list-h">Why This Solution</div>
                {reasons.map((r, i) => (
                  <div key={i} className="sol-row">
                    <span className="sol-row-ico red">✓</span>
                    <input value={r} onChange={e => setReason(i, e.target.value)} placeholder={`Type your ${["first","second","third"][i]} reason here…`} />
                    <span className="sol-row-pen">✎</span>
                  </div>
                ))}
              </div>
              <div className="sol-list">
                <div className="sol-list-h">What Makes It Different</div>
                {diffs.map((d, i) => (
                  <div key={i} className="sol-row">
                    <span className="sol-row-ico red"><DiffIcon kind={SOL_DIFF_ICONS[i]} /></span>
                    <input value={d} onChange={e => setDiff(i, e.target.value)} placeholder={`Type your ${["first","second","third"][i]} differentiator here…`} />
                    <span className="sol-row-pen">✎</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sol-foot">
              <div className="sol-foot-meta"><b>Selected: {selected.length}</b> <span className="sep">|</span> Prepared for Meridian Group</div>
              <div className="sol-foot-actions">
                <button className="sol-btn ghost" onClick={() => nav("room2-discovery")}>← Back</button>
                <button className="sol-btn primary" onClick={lockIn} disabled={selected.length === 0 || busy}>
                  {busy ? "Evaluating…" : "Lock In Recommendation →"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Eval moved to its own full page (AssessmentPage) */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// FINDINGS (vault — final reveal)
// ─────────────────────────────────────────────────────────
function VaultScreen({ state, nav }) {
  const SC = window.HEIST_DATA.SCORING;
  const [revealed, setRevealed] = useStateR2(false);
  useEffectR2(() => { const t = setTimeout(() => setRevealed(true), 400); return () => clearTimeout(t); }, []);

  const breakdown = useMemoR2(() => {
    const rows = [];
    const hypoTier = state.hypothesisEval?.tier || "weak";
    rows.push({ label: "Hypothesis", val: SC.tierPoints[hypoTier] || 0, max: 100, phase: 1 });
    const targetPersona = window.HEIST_DATA.PERSONAS.find(p => p.id === (state.targetPersona || "sarah"));
    rows.push({ label: "Person of Interest", val: SC.personaPoints[targetPersona?.level || "decoy"] || 0, max: 100, phase: 1 });
    const outreachTier = state.outreachEval?.tier || "weak";
    const outcome = state.outreachEval?.outcome || "declined";
    rows.push({ label: "Outreach", val: Math.round((SC.tierPoints[outreachTier] || 0) * 0.5 + (SC.outcomePoints[outcome] || 0) * 0.5), max: 100, phase: 1 });
    const cs = state.coldCallScore || {};
    rows.push({ label: "Cold Call", val: Math.round((cs.implication || 0) * 0.25 + (cs.champion || 0) * 0.25 + (cs.quality || 0) * 0.3 + (cs.meetingEarned ? 80 : 20) * 0.2), max: 100, phase: 1 });
    const precallTier = state.precallEval?.tier || "weak";
    rows.push({ label: "Interview Plan", val: SC.tierPoints[precallTier] || 0, max: 100, phase: 2 });
    const ds = state.discoveryScore || {};
    rows.push({ label: "The Interview", val: Math.round((ds.implication || 0) * SC.iceWeight.implication / 100 + (ds.champion || 0) * SC.iceWeight.champion / 100 + (ds.economicBuyer || 0) * SC.iceWeight.economicBuyer / 100 + (ds.quality || 0) * SC.iceWeight.quality / 100), max: 150, phase: 2 });
    const solTier = state.solutionEval?.tier || "weak";
    rows.push({ label: "Theory of the Case", val: SC.tierPoints[solTier] || 0, max: 100, phase: 2 });
    const total = rows.reduce((s, r) => s + r.val, 0);
    const tier = SC.tiers.find(t => total >= t.threshold) || SC.tiers[SC.tiers.length - 1];
    return { rows, total, tier };
  }, [state]);

  // Persist the final run once (append-only; guarded against reload duplicates).
  useEffectR2(() => {
    const pid = state.playId;
    if (!window.HEIST_DB || !pid) return;
    const guard = "run-saved-" + pid;
    try { if (localStorage.getItem(guard)) return; localStorage.setItem(guard, "1"); } catch (e) {}
    const ds = state.discoveryScore || {};
    const cs = state.coldCallScore || {};
    window.HEIST_DB.saveRun({
      playId: pid,
      teamId: state.teamId,
      account: window.HEIST_DATA.SCENARIO.account,
      dealTier: breakdown.tier.name,
      arrValue: null,
      totalPoints: breakdown.total,
      ice: {
        implication: ds.implication ?? cs.implication ?? 0,
        champion: ds.champion ?? cs.champion ?? 0,
        economicBuyer: ds.economicBuyer ?? cs.economicBuyer ?? 0,
        quality: ds.quality ?? cs.quality ?? 0,
      },
      phases: {
        hypothesis: state.hypothesisEval, outreach: state.outreachEval,
        precall: state.precallEval, solution: state.solutionEval,
        coldCall: state.coldCallScore, discovery: state.discoveryScore,
        targetPersona: state.targetPersona,
      },
      summary: { dealName: breakdown.tier.name, deal: breakdown.tier.deal, desc: breakdown.tier.desc },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p2-stage findings">
      <div className="p2-grain"></div>
      <div className="vault-inner">
        <div className="pre-kicker">// Case Findings · On File</div>
        <div className={"findings-stamp " + breakdown.tier.name.toLowerCase()}>{breakdown.tier.name}</div>
        <h1 className="findings-title">{breakdown.tier.name === "Confirmed" ? "Case solved." : breakdown.tier.name === "Insufficient" ? "Case stays cold." : "Theory on file."}</h1>
        <div className="sub">Team {state.teamId} · {breakdown.total} points · diagnostic confidence</div>

        <div className={"tier-badge " + breakdown.tier.name.toLowerCase()}>
          <div>
            <div className="tier-name">{breakdown.tier.name}</div>
            <div className="tier-sub">— Diagnostic Confidence —</div>
          </div>
        </div>

        <div className="score-rows">
          {breakdown.rows.map((r, i) => (
            <div key={i} className="score-row" style={{ opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(6px)", transition: `all .4s ${0.1 + i * 0.08}s` }}>
              <span className="sr-phase">P{r.phase}</span>
              <span className="label">{r.label}</span>
              <span className="bar"><span className="fill" style={{ width: revealed ? `${Math.min(100, (r.val / r.max) * 100)}%` : "0%" }}></span></span>
              <span className="val">{r.val}<span className="max">/{r.max}</span></span>
            </div>
          ))}
          <div className="score-total">
            <span className="lbl">— Total —</span>
            <span className="v">{breakdown.total}</span>
          </div>
        </div>

        <div className="deal-card">
          <div className="lbl">// Outcome</div>
          <div className="amt">{breakdown.tier.deal}</div>
          <div className="desc">{breakdown.tier.desc}</div>
        </div>

        <div style={{ marginTop: 44, display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={() => { if (confirm("Reset the entire simulation?")) { localStorage.removeItem("case-file-state"); location.reload(); } }}>↺ Run It Again</button>
          <button className="btn btn-primary" onClick={() => alert("Leaderboard coming soon.")}>Submit to Leaderboard →</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ContactReviewScreen, PreCallScreen, DiscoveryScreen, ClosingScreen, SolutionScreen, VaultScreen });
