// screens-room2.jsx — Pre-call plan, Discovery, Solution, Vault.

const { useState: useStateR2, useEffect: useEffectR2, useRef: useRefR2, useMemo: useMemoR2 } = React;
const ModalR2 = window.Modal;
const SpinnerR2 = window.Spinner;
const EvalCardR2 = window.EvalCard;
const ChatScreenR2 = window.ChatScreen;

// ─────────────────────────────────────────────────────────
// PRE-CALL PLAN
// ─────────────────────────────────────────────────────────
function PreCallScreen({ state, nav, setStepTimerSeconds }) {
  // Whoever they ended up talking to in room 1 is who they'll discovery-call.
  const persona = window.HEIST_DATA.PERSONAS.find(p => p.id === (state.coldCallPersonaId || state.targetPersona || "priya"));
  const [text, setText] = useStateR2(state.precallPlan || "");
  const [eval_, setEval] = useStateR2(state.precallEval || null);
  const [busy, setBusy] = useStateR2(false);

  useEffectR2(() => { setStepTimerSeconds && setStepTimerSeconds(7 * 60); }, []);

  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    const result = await window.HEIST_API.evaluate(
      window.HEIST_DATA.JUDGE_PROMPTS.precall({
        submission: text,
        personaName: persona.name,
        personaTitle: persona.title,
      })
    );
    setEval(result);
    setBusy(false);
  };

  return (
    <div className="centered-pane">
      <div className="pre-kicker">// Phase 02 / Step 01</div>
      <h2>Pre-examination plan.</h2>
      <div className="lead">
        You have a meeting with <strong className="accent-text">{persona.name}</strong> ({persona.title}).
        What's your working hypothesis to test? What does strong discovery look like here? SPIN framework helps.
      </div>

      <div style={{ background: "var(--bg-1)", border: "1px solid var(--border)", padding: 16, borderRadius: 2, marginBottom: 24, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
        <div className="mono accent-text" style={{ fontSize: 10, letterSpacing: "0.2em", marginBottom: 10 }}>// SPIN STRUCTURE</div>
        <div><strong>Situation</strong> — specific to {persona.company}, not generic.</div>
        <div><strong>Problem</strong> — probe the known symptoms, not generic pain.</div>
        <div><strong>Implication</strong> — what's the cost of not solving?</div>
        <div><strong>Need-payoff</strong> — what does success look like in 90 days?</div>
      </div>

      <textarea
        className="big-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={`My hypothesis going into the call with ${persona.name.split(" ")[0]} is...\n\nQuestions to test:\n1. \n2. \n3. `}
      />

      <div className="step-foot">
        <span><span className="count">{text.length}</span> chars</span>
        <span>{busy ? <SpinnerR2 label="reviewing" /> : null}</span>
      </div>

      {eval_ && <EvalCardR2 result={eval_} />}

      <div className="row-end mt-32">
        <button className="btn btn-ghost" onClick={() => nav("scene-2")}>↩ Back</button>
        {!eval_ ? (
          <button className="btn btn-primary" onClick={submit} disabled={!text.trim() || busy}>
            Submit Plan →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => nav("room2-discovery", { precallPlan: text, precallEval: eval_, discoveryPersonaId: persona.id })}>
            Enter the Meeting →
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DISCOVERY CALL — live chat (15 min)
// ─────────────────────────────────────────────────────────
function DiscoveryScreen({ state, nav, difficulty }) {
  const personaId = state.discoveryPersonaId || state.coldCallPersonaId || state.targetPersona || "priya";
  const persona = window.HEIST_DATA.PERSONAS.find(p => p.id === personaId);
  return (
    <ChatScreenR2
      state={state}
      nav={nav}
      persona={persona}
      mode="discovery"
      durationSeconds={15 * 60}
      difficulty={difficulty}
      headline={`Discovery · ${persona.name}`}
      sub={persona.title}
      onComplete={(outcome) => nav("room2-solution", {
        discoveryTranscript: outcome.transcript,
        discoveryScore: outcome.score,
      })}
    />
  );
}

// ─────────────────────────────────────────────────────────
// SOLUTION RECOMMENDATION (unscored reflection in spec, but we evaluate for points)
// ─────────────────────────────────────────────────────────
function SolutionScreen({ state, nav }) {
  const persona = window.HEIST_DATA.PERSONAS.find(p => p.id === (state.discoveryPersonaId || state.coldCallPersonaId || state.targetPersona || "priya"));
  const [text, setText] = useStateR2(state.solution || "");
  const [eval_, setEval] = useStateR2(state.solutionEval || null);
  const [busy, setBusy] = useStateR2(false);

  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    const transcript = (state.discoveryTranscript || []).map(m => `${m.role === "user" ? "Rep" : persona.name}: ${m.content}`).join("\n").slice(0, 2500);
    const result = await window.HEIST_API.evaluate(
      window.HEIST_DATA.JUDGE_PROMPTS.closing({
        submission: text,
        callTranscript: transcript || "(no transcript available)",
      })
    );
    setEval(result);
    setBusy(false);
  };

  return (
    <div className="centered-pane">
      <div className="pre-kicker">// Phase 02 / Step 03</div>
      <h2>Your recommendation.</h2>
      <div className="lead">
        Based on what {persona.name.split(" ")[0]} told you, what would you recommend?
        Tie it back to what they actually said. Propose a concrete next step.
      </div>

      <textarea
        className="big-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={`Based on what ${persona.name.split(" ")[0]} shared about...\n\nI'd recommend...\n\nNext step: `}
      />

      <div className="step-foot">
        <span><span className="count">{text.length}</span> chars</span>
        <span>{busy ? <SpinnerR2 label="evaluating" /> : null}</span>
      </div>

      {eval_ && <EvalCardR2 result={eval_} />}

      <div className="row-end mt-32">
        {!eval_ ? (
          <button className="btn btn-primary" onClick={submit} disabled={!text.trim() || busy}>
            Submit Recommendation →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => nav("vault", { solution: text, solutionEval: eval_ })}>
            File the Report →
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// VAULT — final score reveal
// ─────────────────────────────────────────────────────────
function VaultScreen({ state, nav }) {
  const SC = window.HEIST_DATA.SCORING;

  // Compute score breakdown
  const breakdown = useMemoR2(() => {
    const rows = [];

    // Room 1
    const hypoTier = state.hypothesisEval?.tier || "weak";
    rows.push({ label: "Hypothesis", val: SC.tierPoints[hypoTier] || 0, max: 100 });

    const targetPersona = window.HEIST_DATA.PERSONAS.find(p => p.id === (state.targetPersona || "priya"));
    const personaPts = SC.personaPoints[targetPersona?.level || "decoy"] || 0;
    rows.push({ label: "Persona Selection", val: personaPts, max: 100 });

    const outreachTier = state.outreachEval?.tier || "weak";
    const outcome = state.outreachEval?.outcome || "declined";
    const outreachPts = (SC.tierPoints[outreachTier] || 0) * 0.5 + (SC.outcomePoints[outcome] || 0) * 0.5;
    rows.push({ label: "Outreach Message", val: Math.round(outreachPts), max: 100 });

    const cs = state.coldCallScore || {};
    const coldPts = Math.round(
      (cs.implication || 0) * 0.25 +
      (cs.champion || 0) * 0.25 +
      (cs.quality || 0) * 0.3 +
      (cs.meetingEarned ? 80 : 20) * 0.2
    );
    rows.push({ label: "Cold Call", val: coldPts, max: 100 });

    // Room 2
    const precallTier = state.precallEval?.tier || "weak";
    rows.push({ label: "Pre-Call Plan", val: SC.tierPoints[precallTier] || 0, max: 100 });

    const ds = state.discoveryScore || {};
    const discPts = Math.round(
      (ds.implication || 0) * SC.iceWeight.implication / 100 +
      (ds.champion || 0) * SC.iceWeight.champion / 100 +
      (ds.economicBuyer || 0) * SC.iceWeight.economicBuyer / 100 +
      (ds.quality || 0) * SC.iceWeight.quality / 100
    );
    rows.push({ label: "Discovery Call", val: discPts, max: 150 });

    const solTier = state.solutionEval?.tier || "weak";
    rows.push({ label: "Solution Recommendation", val: SC.tierPoints[solTier] || 0, max: 100 });

    const total = rows.reduce((s, r) => s + r.val, 0);
    const tier = SC.tiers.find(t => total >= t.threshold) || SC.tiers[SC.tiers.length - 1];
    return { rows, total, tier };
  }, [state]);

  return (
    <div className="vault">
      {/* glints */}
      {[...Array(12)].map((_, i) => (
        <span key={i} className="glint" style={{
          left: `${10 + (i * 7) % 80}%`,
          top: `${15 + (i * 13) % 70}%`,
          animationDelay: `${i * 0.3}s`,
        }}></span>
      ))}

      <div className="vault-inner">
        <div className="pre-kicker">// FINDINGS · ON FILE</div>
        <h1>{breakdown.tier.name}</h1>
        <div className="sub">Team {state.teamId} · {breakdown.total} points · diagnostic confidence</div>

        <div className={`tier-badge ${breakdown.tier.name.toLowerCase()}`}>
          <div>
            <div className="tier-name">{breakdown.tier.name}</div>
            <div className="tier-sub">— Diagnostic Confidence —</div>
          </div>
        </div>

        <div className="score-rows">
          {breakdown.rows.map((r, i) => (
            <div key={i} className="score-row">
              <span className="label">{r.label}</span>
              <span className="max">/ {r.max}</span>
              <span className="val">{r.val}</span>
            </div>
          ))}
          <div className="score-total">
            <span className="lbl">— TOTAL —</span>
            <span className="v">{breakdown.total}</span>
          </div>
        </div>

        <div className="deal-card">
          <div className="lbl">// Deal Outcome</div>
          <div className="amt">{breakdown.tier.deal}</div>
          <div className="desc">{breakdown.tier.desc}</div>
        </div>

        <div style={{ marginTop: 48, display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={() => {
            if (confirm("Reset the entire simulation?")) {
              localStorage.removeItem("case-file-state");
              location.reload();
            }
          }}>↺ Run It Again</button>
          <button className="btn btn-primary" onClick={() => alert("Leaderboard coming soon.")}>Submit to Leaderboard →</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PreCallScreen, DiscoveryScreen, SolutionScreen, VaultScreen,
});
