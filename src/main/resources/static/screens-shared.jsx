// screens-shared.jsx — shared UI primitives used across screens.
// Exposed via window for Babel cross-script scope.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────────── TopBar ───────────────
function TopBar({ state, screen }) {
  const { SCREEN_LABELS } = window.HEIST_DATA;
  const meta = SCREEN_LABELS[screen] || { kicker: "—", label: screen };
  const phase = meta.kicker;

  return (
    <div className="topbar">
      <div className="brand">
        <span className="dot"></span>
        <span>SignalPursuits · Case File</span>
      </div>
      <div className="crumbs">
        <span className={screen === "briefing" ? "active" : ""}>Case File</span>
        <span>·</span>
        <span className={screen.startsWith("room1") || screen === "scene-1" ? "active" : ""}>Phase 01</span>
        <span>·</span>
        <span className={screen.startsWith("room2") || screen === "scene-2" ? "active" : ""}>Discovery</span>
        <span>·</span>
        <span className={screen === "vault" ? "active" : ""}>Findings</span>
      </div>
      <div className="meta">
        <span>{phase}</span>
        {state.teamId ? <span className="team-id">[TEAM · {state.teamId}]</span> : null}
      </div>
    </div>
  );
}

// ─────────────── Case clock (elapsed, no limit) ───────────────
function RoomClock({ seconds, label = "Case open" }) {
  if (seconds == null) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <div className="room-clock">
      <span className="label">{label}</span>
      <span className="time">⏱ {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")} elapsed</span>
    </div>
  );
}

// ─────────────── Modal ───────────────
function Modal({ children, onClose, maxWidth }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="modal-veil" onClick={(e) => {
      if (e.target.classList.contains("modal-veil")) onClose && onClose();
    }}>
      <div className="modal" style={maxWidth ? { maxWidth } : null}>
        {onClose ? <button className="modal-x" onClick={onClose}>×</button> : null}
        {children}
      </div>
    </div>
  );
}

// ─────────────── Step countdown timer ───────────────
function useStepTimer(seconds, onExpire) {
  const [t, setT] = useState(seconds);
  const cbRef = useRef(onExpire);
  useEffect(() => { cbRef.current = onExpire; }, [onExpire]);
  useEffect(() => {
    if (seconds == null) return;
    setT(seconds);
    const id = setInterval(() => {
      setT(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (cbRef.current) cbRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return t;
}

// ─────────────── Loading / spinner ───────────────
function Spinner({ label }) {
  return (
    <div className="row" style={{ gap: 10, color: "var(--text-dim)" }}>
      <span className="spinner"></span>
      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        {label || "Evaluating…"}
      </span>
    </div>
  );
}

// ─────────────── Eval result card ───────────────
function EvalCard({ result }) {
  if (!result) return null;
  const tier = (result.tier || "developing").toLowerCase();
  return (
    <div className={`eval-card ${tier}`}>
      <div className="tier">Assessment · {tier}</div>
      <div className="feedback">{result.feedback}</div>
      {result.coach ? <div className="coach">Coach: {result.coach}</div> : null}
    </div>
  );
}

// ─────────────── ChatScreen (cold call / discovery) ───────────────
// Used by both Room 1 (cold call, 5min) and Room 2 (discovery, 15min).
function ChatScreen({ state, nav, persona, mode, durationSeconds, onComplete, difficulty, headline, sub }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState("");
  const [ice, setIce] = useState({ implication: false, champion: false, economicBuyer: false });
  const [elapsed, setElapsed] = useState(0);
  const [ending, setEnding] = useState(false);
  const [scored, setScored] = useState(null);
  const logRef = useRef(null);

  // Tick — counts elapsed time up; no limit, no auto-end
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Initial system greeting from persona — they get the first word.
  useEffect(() => {
    (async () => {
      setBusy(true);
      setTyping("");
      const sys = window.HEIST_DATA.characterPrompt(persona, mode, { difficulty });
      const seed = mode === "cold"
        ? "[The call has just been picked up. Open in character, briefly.]"
        : "[The video meeting has just started. Greet the rep briefly, in character.]";
      const reply = await window.HEIST_API.chat({
        system: sys,
        messages: [{ role: "user", content: seed }],
        onChunk: (c) => setTyping(t => t + c),
      });
      setTyping("");
      setMessages([{ role: "assistant", content: reply }]);
      setBusy(false);
    })();
    // eslint-disable-next-line
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing]);

  // ICE detection — naive regex on rep utterances
  useEffect(() => {
    const repText = messages.filter(m => m.role === "user").map(m => m.content.toLowerCase()).join(" ");
    setIce({
      implication: /(impact|cost of|what happens if|consequence|board|cfo|miss|forecast|risk|expos)/i.test(repText),
      champion:    /(who else|stakeholder|champion|sponsor|team|trust|recommend)/i.test(repText),
      economicBuyer:/(budget|spend|approve|decision|sign|priorit|invest|economic)/i.test(repText),
    });
  }, [messages]);

  const send = async () => {
    if (!draft.trim() || busy || ending) return;
    const userMsg = { role: "user", content: draft.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setTyping("");
    const sys = window.HEIST_DATA.characterPrompt(persona, mode, { difficulty });
    const reply = await window.HEIST_API.chat({
      system: sys,
      messages: next,
      onChunk: (c) => setTyping(t => t + c),
    });
    setTyping("");
    setMessages([...next, { role: "assistant", content: reply }]);
    setBusy(false);
    if (/\[END_CALL\]/i.test(reply)) {
      setTimeout(() => endCall("hostility"), 1200);
    }
  };

  const endCall = async (reason) => {
    if (ending) return;
    setEnding(true);
    setBusy(true);
    const score = await window.HEIST_API.scoreConversation({
      transcript: messages,
      mode,
      persona,
    });
    setScored(score);
    setBusy(false);
  };

  const proceed = () => {
    const finalScore = scored || { implication: 30, champion: 30, economicBuyer: 30, quality: 30, meetingEarned: false, summary: "Incomplete." };
    // Append-only capture of the full transcript + score (no-ops if Supabase unconfigured).
    if (window.HEIST_DB) {
      window.HEIST_DB.saveCall({
        playId: state && state.playId,
        teamId: state && state.teamId,
        mode,
        personaId: persona.id,
        personaName: persona.name,
        personaTitle: persona.title,
        transcript: messages,
        score: finalScore,
      });
    }
    onComplete({ transcript: messages, score: finalScore });
  };

  const m = Math.floor(elapsed / 60), s = elapsed % 60;

  return (
    <div className="chat-stage">
      <div className="chat-sidebar thin-scroll">
        <div className="avatar">{persona.photoInitials}</div>
        <div>
          <div className="nm">{persona.name}</div>
          <div className="ti">{persona.title}</div>
          <div className="co">{persona.company}</div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--accent)", marginBottom: 8 }}>
            // CALL TYPE
          </div>
          <div style={{ fontSize: 13, color: "var(--text-2)" }}>
            {mode === "cold" ? "Cold outbound · no time limit" : "Discovery interview · no time limit"}
          </div>
        </div>

        <div className="ice-tracker">
          <h4>// ICE Tracker</h4>
          <div className={`ice-row ${ice.implication ? "lit" : ""}`}>
            <span className="ice-dot"></span> <span>Implication of Pain</span>
          </div>
          <div className={`ice-row ${ice.champion ? "lit" : ""}`}>
            <span className="ice-dot"></span> <span>Champion Behavior</span>
          </div>
          <div className={`ice-row ${ice.economicBuyer ? "lit" : ""}`}>
            <span className="ice-dot"></span> <span>Economic Buyer Visibility</span>
          </div>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => endCall("manual")} disabled={ending}>
            End Call
          </button>
          <div className="dim" style={{ fontSize: 10, marginTop: 8, fontFamily: "var(--mono)", letterSpacing: "0.1em", textAlign: "center" }}>
            Difficulty: {difficulty?.toUpperCase() || "HARD"}
          </div>
        </div>
      </div>

      <div className="chat-pane">
        <div className="chat-head">
          <div className="status"><span className="dot"></span> {headline || (mode === "cold" ? "Cold Call · Live" : "Discovery Call · Live")}</div>
          <div className="timer">
            ⏱ {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </div>
        </div>

        <div className="chat-log thin-scroll" ref={logRef}>
          <div className="msg system">— Connection established. {persona.name} is on the line. —</div>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "user" : "bot"}`}>
              {m.content.replace(/\[END_CALL\]/gi, "").trim()}
            </div>
          ))}
          {typing && (
            <div className="msg bot">{typing}<span className="dim" style={{ opacity: 0.5 }}>▍</span></div>
          )}
          {busy && !typing && (
            <div className="typing"><span></span><span></span><span></span></div>
          )}

          {scored && (
            <div className="msg system" style={{ maxWidth: "94%", padding: 16, textAlign: "left", border: "1px solid var(--accent-dim)", color: "var(--text)" }}>
              <div className="kicker mb-24" style={{ marginBottom: 12 }}>// CALL ENDED — Coach Summary</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 16, marginBottom: 16, color: "var(--text)" }}>
                {scored.summary}
              </div>
              {mode === "cold" && (
                <div style={{ fontSize: 13, color: scored.meetingEarned ? "var(--green)" : "var(--red)", marginBottom: 12 }}>
                  {scored.meetingEarned ? "✓ Meeting earned." : "✗ Meeting not earned — but you'll get a follow-up window."}
                </div>
              )}
              <button className="btn btn-primary" onClick={proceed}>Continue →</button>
            </div>
          )}
        </div>

        {!scored && (
          <div className="chat-input">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); send();
                }
              }}
              placeholder={busy ? `${persona.name.split(" ")[0]} is responding...` : `${persona.name.split(" ")[0]} is listening. Make it count.`}
              disabled={busy || ending}
            />
            <button className="btn btn-primary" onClick={send} disabled={busy || ending || !draft.trim()}>Send →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// expose
Object.assign(window, { TopBar, RoomClock, Modal, useStepTimer, Spinner, EvalCard, ChatScreen });
