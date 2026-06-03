// screens-room1.jsx — Landing through Room 1 Complete.

const { useState: useStateR1, useEffect: useEffectR1, useRef: useRefR1, useMemo: useMemoR1 } = React;
// Pull shared components into local scope (loaded in screens-shared.jsx)
const Modal = window.Modal;
const Spinner = window.Spinner;
const EvalCard = window.EvalCard;
const ChatScreen = window.ChatScreen;

// ─────────────────────────────────────────────────────────
// LANDING — Cold Case
// ─────────────────────────────────────────────────────────
function LandingScreen({ state, nav }) {
  const [teamId, setTeamId] = useStateR1(state.teamId || "");
  const [accessCode, setAccessCode] = useStateR1("");

  const start = () => {
    if (!teamId.trim()) return;
    nav("intro", { teamId: teamId.trim().toUpperCase(), startedAt: Date.now() });
  };
  const resume = () => {
    if (!accessCode.trim() || !teamId.trim()) return;
    nav("scene-2", {
      teamId: teamId.trim().toUpperCase(),
      accessCode: accessCode.trim().toUpperCase(),
      room1Score: 240,
      resumed: true,
    });
  };

  const displayTeam = teamId.trim().toUpperCase() || "—";

  return (
    <div className="landing">
      {/* Left: case-board wall */}
      <div className="case-board">
        <div className="lamp"></div>

        {/* Sticky notes */}
        <div className="note" style={{ top: 80, left: 16, transform: "rotate(-4deg)" }}>
          Why<br/>now?
        </div>
        <div className="note cream" style={{ top: 290, right: 16, transform: "rotate(3deg)", fontSize: 16 }}>
          What's<br/>the impact?
        </div>

        {/* Polaroids */}
        <div className="polaroid" style={{ top: 80, right: 24, transform: "rotate(7deg)" }}>
          <div className="img"></div>
          <div className="cap">Subject A</div>
        </div>
        <div className="polaroid" style={{ top: 250, left: 36, transform: "rotate(-8deg)" }}>
          <div className="img"></div>
          <div className="cap">Witness</div>
        </div>

        {/* Red string */}
        <div className="string" style={{ top: 180, left: 100, width: 90, transform: "rotate(22deg)" }}></div>
        <div className="string" style={{ top: 280, left: 130, width: 110, transform: "rotate(-30deg)" }}></div>

        {/* Pins */}
        <div className="pin-dot" style={{ top: 175, left: 90 }}></div>
        <div className="pin-dot" style={{ top: 285, left: 130 }}></div>

        {/* Folder with stamp */}
        <div className="folder" style={{ bottom: 40, left: 20, transform: "rotate(-3deg)" }}>
          <div className="stamp">CASE REOPENED</div>
        </div>
      </div>

      {/* Center: hero + form */}
      <div className="landing-center">
        <div className="pre">⏵ Cold Case</div>
        <h1>CASE FILE</h1>
        <div className="subtitle">B-Visible · Sales Training Simulation</div>
        <div className="tagline">
          Old information.<br/>
          Fresh eyes.<br/>
          New outcome.
        </div>

        <div className="landing-form">
          <label className="field">
            <span className="lbl">Team Identifier</span>
            <input
              className="input"
              placeholder="e.g. JJ"
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && start()}
            />
          </label>
          <button className="btn btn-primary" onClick={start} disabled={!teamId.trim()}>
            Open Case →
          </button>

          <div className="or">— or resume case —</div>

          <label className="field">
            <span className="lbl">Case Access Code</span>
            <input
              className="input mono"
              placeholder="6-character access code"
              value={accessCode}
              maxLength={6}
              onChange={e => setAccessCode(e.target.value.toUpperCase())}
            />
          </label>
          <button className="btn btn-ghost" onClick={resume} disabled={!accessCode.trim() || !teamId.trim()}>
            Resume at Phase 02
          </button>
        </div>
      </div>

      {/* Right: ID badge */}
      <div className="id-column">
        <div className="lanyard"></div>
        <div className="badge">
          <div className="photo"><span className="glyph">B</span></div>
          <div className="team">Team {displayTeam}</div>
          <div className="level">Clearance Level<br/>Authorized</div>
          <div className="barcode"></div>
          <div className="barcode-num">{`B-${(Math.abs(teamId.length * 11 + 4729) % 999999).toString().padStart(6, "0")}`}</div>
        </div>
        <div className="case-reopened">Case<br/>Reopened</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// INTRO VIDEO (skippable)
// ─────────────────────────────────────────────────────────
function IntroScreen({ state, nav }) {
  useEffectR1(() => {
    const t = setTimeout(() => nav("briefing"), 6000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="intro-stage" onClick={() => nav("briefing")}>
      <div className="intro-vignette"></div>
      <div className="intro-card">
        <div className="meta">— CASE FILE OPENED —</div>
        <h1>Case <em style={{ fontStyle: "italic", color: "var(--accent)" }}>A-247</em></h1>
        <div className="tag-line">Forty-five minutes. One account. Establish the pattern.</div>
        <div className="skip">tap anywhere to skip</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BRIEFING (dossier)
// ─────────────────────────────────────────────────────────
function BriefingScreen({ state, nav }) {
  const D = window.HEIST_DATA.SCENARIO;
  return (
    <div className="briefing">
      <div className="stamp"><span className="blink"></span> CASE REOPENED · ACTIVE</div>
      <h1>Case File <span style={{ color: "var(--accent)" }}>A-247</span></h1>
      <div className="subtitle">Intake summary · Team {state.teamId}</div>

      <div className="dossier-grid">
        <div className="dossier-block">
          <div className="lbl">Subject Account</div>
          <div className="val">{D.account}</div>
        </div>
        <div className="dossier-block">
          <div className="lbl">Industry</div>
          <div className="val">{D.industry}</div>
        </div>
        <div className="dossier-block">
          <div className="lbl">Profile</div>
          <div className="val">{D.revenue}</div>
        </div>
        <div className="dossier-block">
          <div className="lbl">Your Position</div>
          <div className="val">{D.yourTitle}, {D.yourCompany}</div>
        </div>
      </div>

      <div className="objectives">
        <h3>// Case Protocol</h3>
        <div className="objective">
          <span className="num">01</span>
          <span className="desc">Investigate the account. Identify the presenting symptoms. Form a working hypothesis.</span>
          <span className="time">10:00</span>
        </div>
        <div className="objective">
          <span className="num">02</span>
          <span className="desc">Identify persons of interest. Find who's closest to the pattern. Earn the right to a conversation.</span>
          <span className="time">07:00</span>
        </div>
        <div className="objective">
          <span className="num">03</span>
          <span className="desc">Cold call. Five minutes. Earn the meeting.</span>
          <span className="time">05:00</span>
        </div>
        <div className="objective">
          <span className="num">04</span>
          <span className="desc">Discovery interview. Test the theory. Find the pain that pays.</span>
          <span className="time">15:00</span>
        </div>
        <div className="objective">
          <span className="num">05</span>
          <span className="desc">Recommend. File the report. Close the case.</span>
          <span className="time">05:00</span>
        </div>
      </div>

      <div className="row-end">
        <button className="btn btn-ghost" onClick={() => nav("landing")}>↩ Restart</button>
        <button className="btn btn-primary" onClick={() => nav("scene-1")}>Begin Investigation →</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SCENE CARD (cinematic interstitial)
// ─────────────────────────────────────────────────────────
function SceneCardScreen({ state, nav, sceneKey, next }) {
  const SC = window.HEIST_DATA.SCENE_CARDS[sceneKey];
  const TOTAL = 6;
  const [remaining, setRemaining] = useStateR1(TOTAL);
  useEffectR1(() => {
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); nav(next); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const C = 2 * Math.PI * 22;
  const offset = C * (1 - remaining / TOTAL);
  return (
    <div className="scene" onClick={() => nav(next)}>
      <div className="scene-inner">
        <div className="num">— {SC.num} —</div>
        <h1>{SC.title}</h1>
        <div className="desc">{SC.desc}</div>
      </div>
      <div className="ring">
        <svg width="48" height="48">
          <circle className="bg" cx="24" cy="24" r="22"></circle>
          <circle className="fg" cx="24" cy="24" r="22"
            strokeDasharray={C}
            strokeDashoffset={offset}
          ></circle>
        </svg>
        <div className="tap-hint">tap to skip</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ROOM 1 — RESEARCH WORKSPACE
// ─────────────────────────────────────────────────────────
function ResearchScreen({ state, nav, setStepTimerSeconds }) {
  const RT = window.HEIST_DATA.RESEARCH_TOOLS;
  const RC = window.HEIST_DATA.RESEARCH_CONTENT;
  const [openTool, setOpenTool] = useStateR1(null);
  const [notes, setNotes] = useStateR1(state.researchNotes || "");
  const [agentQ, setAgentQ] = useStateR1("");
  const [agentLog, setAgentLog] = useStateR1(state.agentLog || []);
  const [agentLoading, setAgentLoading] = useStateR1(false);

  useEffectR1(() => { setStepTimerSeconds && setStepTimerSeconds(10 * 60); }, []);

  const saveNotes = (v) => { setNotes(v); };

  const askAgent = async () => {
    if (!agentQ.trim()) return;
    const q = agentQ.trim();
    setAgentLog(log => [...log, { role: "user", text: q }]);
    setAgentQ("");
    setAgentLoading(true);
    const reply = await window.HEIST_API.researchAgent(q);
    setAgentLog(log => [...log, { role: "agent", text: reply }]);
    setAgentLoading(false);
  };

  return (
    <>
      <div className="workspace">
        {/* Left column — tools */}
        <div className="col">
          <div className="col-head">⏵ Investigation Tools</div>
          <div className="col-body thin-scroll">
            {RT.map(t => (
              <div key={t.id} className="tool-card" onClick={() => setOpenTool(t.id)}>
                <div className="name">[{t.id.toUpperCase()}] {t.name}</div>
                <div className="desc">{t.desc}</div>
              </div>
            ))}
            <div style={{ marginTop: 16, fontSize: 11, color: "var(--text-faint)", fontFamily: "var(--mono)", lineHeight: 1.6 }}>
              // open each source to gather evidence.<br/>
              // log observations in the case notes.
            </div>
          </div>
        </div>

        {/* Center — focal area (open tool) */}
        <div className="col">
          <div className="col-head">⏵ Active Source <span className="dim" style={{ marginLeft: 8 }}>{openTool ? "/ " + openTool : "/ none"}</span></div>
          <div className="col-body thin-scroll">
            {!openTool && (
              <div style={{ color: "var(--text-faint)", padding: "60px 20px", textAlign: "center", fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic" }}>
                Select a source on the left.
                <div style={{ marginTop: 12, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.15em" }}>
                  EVIDENCE IS WHAT YOU MAKE OF IT.
                </div>
              </div>
            )}
            {openTool === "earnings" && (
              <div>
                <div className="kicker mb-24">⏵ AUDIO TRANSCRIPT — {RC.earnings.title}</div>
                <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 2, padding: 16, marginBottom: 16 }}>
                  <div className="row" style={{ gap: 12 }}>
                    <button className="btn" style={{ padding: "6px 10px" }} onClick={(e) => e.currentTarget.textContent = e.currentTarget.textContent === "▶ PLAY" ? "❚❚ PAUSE" : "▶ PLAY"}>▶ PLAY</button>
                    <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 2, position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "32%", background: "var(--accent)", borderRadius: 2 }}></div>
                    </div>
                    <span className="mono dim" style={{ fontSize: 11 }}>2:14 / 6:48</span>
                  </div>
                </div>
                {RC.earnings.transcript.map((line, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px dashed var(--border)" }}>
                    <span className="mono accent-text" style={{ fontSize: 11, letterSpacing: "0.15em" }}>{line.speaker.toUpperCase()}</span>
                    <div style={{ marginTop: 4, color: "var(--text)", fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.5 }}>"{line.text}"</div>
                  </div>
                ))}
              </div>
            )}
            {openTool === "web" && (
              <div className="search-results">
                <div className="search-bar">
                  <input className="input mono" defaultValue="acme corp revenue operations" />
                  <button className="btn">⌕</button>
                </div>
                {RC.web.map((r, i) => (
                  <div key={i} className="result">
                    <div className="url">{r.url}</div>
                    <div className="ttl">{r.title}</div>
                    <div className="snip">{r.snip}</div>
                  </div>
                ))}
              </div>
            )}
            {openTool === "jobs" && (
              <div>
                <div className="kicker mb-24">⏵ ACTIVE JOB POSTINGS</div>
                {RC.jobs.map((j, i) => (
                  <div key={i} style={{ padding: 16, border: "1px solid var(--border)", marginBottom: 12, borderRadius: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 19 }}>{j.title}</div>
                        <div className="mono dim" style={{ fontSize: 11, marginTop: 2 }}>{j.team} · posted {j.postedDays}d ago</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, color: "var(--text-2)", fontSize: 13, lineHeight: 1.5 }}>
                      <span className="accent-text mono" style={{ fontSize: 10, letterSpacing: "0.2em" }}>SIGNAL → </span>
                      {j.signal}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {openTool === "linkedin" && (
              <div>
                <div className="kicker mb-24">⏵ LINKEDIN — Acme Corp / RevOps</div>
                {window.HEIST_DATA.PERSONAS.filter(p => p.level !== "decoy").map(p => (
                  <div key={p.id} style={{ padding: 14, border: "1px solid var(--border)", marginBottom: 12, borderRadius: 2 }}>
                    <div className="row">
                      <div style={{ width: 44, height: 44, background: "var(--accent-dim)", borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--bg)", fontFamily: "var(--serif)", fontSize: 18 }}>{p.photoInitials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div className="dim" style={{ fontSize: 12 }}>{p.title} · {p.company}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, color: "var(--text-2)", fontSize: 13, lineHeight: 1.5, fontStyle: "italic" }}>
                      "{p.pains[0]}"
                    </div>
                    <div className="mono dim" style={{ fontSize: 10, letterSpacing: "0.15em", marginTop: 8 }}>RECENT ACTIVITY · POST · 3d ago</div>
                  </div>
                ))}
              </div>
            )}
            {openTool === "agent" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 400 }}>
                <div className="kicker mb-24">⏵ RESEARCH AGENT — ASK ANYTHING ABOUT ACME</div>
                <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }} className="thin-scroll">
                  {agentLog.length === 0 && (
                    <div style={{ color: "var(--text-faint)", fontSize: 12, fontFamily: "var(--mono)" }}>
                      Suggested questions:
                      <ul style={{ paddingLeft: 16, marginTop: 8 }}>
                        {window.HEIST_DATA.RESEARCH_CONTENT.agent.seedQs.map((q, i) => (
                          <li key={i} style={{ cursor: "pointer", padding: "4px 0", color: "var(--accent-dim)" }} onClick={() => setAgentQ(q)}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {agentLog.map((m, i) => (
                    <div key={i} style={{ marginBottom: 12, padding: 10, background: m.role === "user" ? "var(--bg-2)" : "transparent", borderLeft: m.role === "agent" ? "2px solid var(--accent)" : "0", paddingLeft: m.role === "agent" ? 14 : 10 }}>
                      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: m.role === "user" ? "var(--text-dim)" : "var(--accent)", marginBottom: 4 }}>{m.role === "user" ? "YOU" : "AGENT"}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.text}</div>
                    </div>
                  ))}
                  {agentLoading && <div style={{ padding: 10 }}><Spinner label="thinking" /></div>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="input"
                    value={agentQ}
                    onChange={e => setAgentQ(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && askAgent()}
                    placeholder="Ask the research agent..."
                  />
                  <button className="btn btn-primary" onClick={askAgent} disabled={agentLoading || !agentQ.trim()}>Ask</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — case notes */}
        <div className="col">
          <div className="col-head">⏵ Case Notes</div>
          <div className="col-body" style={{ padding: 0 }}>
            <textarea
              className="notepad"
              value={notes}
              placeholder={"// log what matters.\n// signals, names, what they're hiring for, what's broken.\n// you'll need this in ten minutes."}
              onChange={e => saveNotes(e.target.value)}
              style={{ padding: 16, minHeight: 400 }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 24px 32px", gap: 12 }}>
        <span className="dim mono" style={{ alignSelf: "center", fontSize: 11, letterSpacing: "0.1em" }}>
          {notes.length} chars captured
        </span>
        <button className="btn btn-primary" onClick={() => nav("room1-hypothesis", { researchNotes: notes, agentLog })}>
          File Hypothesis →
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// HYPOTHESIS
// ─────────────────────────────────────────────────────────
function HypothesisScreen({ state, nav, setStepTimerSeconds }) {
  const [text, setText] = useStateR1(state.hypothesis || "");
  const [eval_, setEval] = useStateR1(state.hypothesisEval || null);
  const [busy, setBusy] = useStateR1(false);

  useEffectR1(() => { setStepTimerSeconds && setStepTimerSeconds(7 * 60); }, []);

  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    const prompt = window.HEIST_DATA.JUDGE_PROMPTS.hypothesis({ submission: text });
    const result = await window.HEIST_API.evaluate(prompt);
    setEval(result);
    setBusy(false);
  };

  return (
    <div className="centered-pane">
      <div className="pre-kicker">// Phase 01 / Step 02</div>
      <h2>Working hypothesis.</h2>
      <div className="lead">
        Based on the evidence, what initiative is Acme prioritizing — and what data challenges would you predict?
        Be specific. Cite what you found.
      </div>

      {state.researchNotes ? (
        <details style={{ marginBottom: 24, padding: 12, border: "1px dashed var(--border)", borderRadius: 2 }}>
          <summary className="mono dim" style={{ cursor: "pointer", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            ⏵ Your case notes ({state.researchNotes.length} chars)
          </summary>
          <div className="mono" style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
            {state.researchNotes}
          </div>
        </details>
      ) : null}

      <textarea
        className="big-textarea"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="The pattern emerging at Acme appears to be..."
      />

      <div className="step-foot">
        <span><span className="count">{text.length}</span> chars · aim for 200-500</span>
        <span>{busy ? <Spinner label="judging" /> : null}</span>
      </div>

      {eval_ && <EvalCard result={eval_} />}

      <div className="row-end mt-32">
        <button className="btn btn-ghost" onClick={() => nav("room1-research")}>↩ Back to Research</button>
        {!eval_ ? (
          <button className="btn btn-primary" onClick={submit} disabled={!text.trim() || busy}>
            Submit Hypothesis →
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => nav("room1-persona", { hypothesis: text, hypothesisEval: eval_ })}>
            Select Target →
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PERSONA SELECTION (corkboard)
// ─────────────────────────────────────────────────────────
function PersonaSelectScreen({ state, nav }) {
  const P = window.HEIST_DATA.PERSONAS;
  const [openPersona, setOpenPersona] = useStateR1(null);
  const [selected, setSelected] = useStateR1(state.targetPersona || null);

  return (
    <div className="corkboard">
      <div className="pre-kicker">// Phase 01 / Step 03</div>
      <h2>Persons of Interest</h2>
      <div className="lead">
        Six names on the org chart. Three are real subjects. Three should be ruled out. Pick the contact closest to the pattern you've identified.
      </div>

      <div className="sticky" style={{ top: 200, right: "8%", transform: "rotate(4deg)" }}>
        Ruled-out subjects are marked. Cold-contacting one wastes the opening.
      </div>

      <div className="contacts">
        {P.map(p => (
          <div
            key={p.id}
            className={`contact ${p.level === "decoy" ? "decoy" : ""} ${selected === p.id ? "selected" : ""}`}
            onClick={() => p.level !== "decoy" ? setSelected(p.id) : null}
          >
            <span className={`pin ${selected === p.id ? "active" : ""}`}></span>
            {p.level === "decoy" && <div className="ruled-out-stamp">RULED OUT</div>}
            <div className="contact-card">
              <div className="photo">
                <span className="ph-initials">{p.photoInitials}</span>
              </div>
              <div className="name">{p.name}</div>
              <div className="title">{p.title}</div>
              <div className="org">{p.company}</div>
              {p.tag && p.level !== "decoy" && (
                <div className="mono" style={{ marginTop: 8, fontSize: 9, letterSpacing: "0.2em", color: "var(--accent-dim)" }}>
                  {p.tag}
                </div>
              )}
              <button
                className="btn btn-ghost"
                style={{ marginTop: 12, width: "100%", padding: "8px 12px", fontSize: 10 }}
                onClick={(e) => { e.stopPropagation(); setOpenPersona(p); }}
              >
                ⏵ Open File
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="row-end mt-32" style={{ maxWidth: 1200, margin: "32px auto 0" }}>
        <button className="btn btn-ghost" onClick={() => nav("room1-hypothesis")}>↩ Back</button>
        <button className="btn btn-primary" onClick={() => selected && nav("room1-outreach", { targetPersona: selected })} disabled={!selected}>
          Compose Outreach →
        </button>
      </div>

      {openPersona && <LinkedInModal persona={openPersona} onClose={() => setOpenPersona(null)} />}
    </div>
  );
}

function LinkedInModal({ persona, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="li-banner"></div>
      <div className="li-body">
        <div className="li-avatar"><span className="init">{persona.photoInitials}</span></div>
        <div className="li-name">{persona.name}</div>
        <div className="li-title">{persona.title} at {persona.company}</div>
        <div className="li-loc">{persona.location || "—"}</div>
        {persona.tag && (
          <div className="mono" style={{ display: "inline-block", marginTop: 8, padding: "4px 10px", border: "1px solid var(--accent-dim)", color: "var(--accent)", fontSize: 10, letterSpacing: "0.2em" }}>
            {persona.tag}
          </div>
        )}
        {persona.decoyReason && (
          <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--red-dim)", color: "var(--red)", borderRadius: 2, fontSize: 13, fontFamily: "var(--mono)", letterSpacing: "0.05em" }}>
            ⚠ RULED OUT · {persona.decoyReason}
          </div>
        )}
        {!persona.decoyReason && (
          <>
            <div className="li-section">
              <h4>// Reports To</h4>
              <div style={{ fontSize: 14 }}>{persona.reportsTo}</div>
              <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>{persona.tenure}</div>
            </div>
            <div className="li-section">
              <h4>// Tracked KPIs</h4>
              <ul style={{ paddingLeft: 18, color: "var(--text-2)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                {persona.kpis.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </div>
            <div className="li-section">
              <h4>// Last Observed Signal</h4>
              <div className="li-experience">
                <div className="ico">⏵</div>
                <div>
                  <div className="role" style={{ fontStyle: "italic" }}>"{persona.pains[0]}"</div>
                  <div className="co">Inferred from public commentary · 3 days ago</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────
// OUTREACH
// ─────────────────────────────────────────────────────────
function OutreachScreen({ state, nav }) {
  const persona = window.HEIST_DATA.PERSONAS.find(p => p.id === state.targetPersona);
  const [channel, setChannel] = useStateR1(state.outreachChannel || "email");
  const [subject, setSubject] = useStateR1(state.outreachSubject || "");
  const [body, setBody] = useStateR1(state.outreachBody || "");
  const [eval_, setEval] = useStateR1(state.outreachEval || null);
  const [busy, setBusy] = useStateR1(false);

  const send = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    const submission = channel === "email" ? `Subject: ${subject}\n\n${body}` : body;
    const prompt = window.HEIST_DATA.JUDGE_PROMPTS.outreach({
      submission, channel, personaName: persona.name, personaTitle: persona.title
    });
    const result = await window.HEIST_API.evaluate(prompt);
    setEval(result);
    setBusy(false);
  };

  // What persona to take to the cold call (delegation logic)
  let coldCallPersonaId = state.targetPersona;
  if (eval_ && eval_.outcome === "delegated") {
    if (eval_.delegateTo === "manager") coldCallPersonaId = "daniel";
    else if (eval_.delegateTo === "director") coldCallPersonaId = "priya";
    else if (persona.level === "executive") coldCallPersonaId = "priya";
    else if (persona.level === "director") coldCallPersonaId = "daniel";
  }
  if (eval_ && eval_.outcome === "declined") {
    coldCallPersonaId = persona.level === "executive" ? "priya" : (persona.level === "director" ? "daniel" : "daniel");
  }

  return (
    <div className="centered-pane" style={{ maxWidth: 880 }}>
      <div className="pre-kicker">// Phase 01 / Step 04</div>
      <h2>One message.</h2>
      <div className="lead">Earn the conversation. Brevity, specificity, no clichés.</div>

      <div className="channel-tabs">
        <button className={channel === "email" ? "active" : ""} onClick={() => setChannel("email")}>Email</button>
        <button className={channel === "linkedin" ? "active" : ""} onClick={() => setChannel("linkedin")}>LinkedIn InMail</button>
      </div>

      <div className={`composer ${channel === "linkedin" ? "inmail" : ""}`}>
        <div className="composer-head">
          <div className="dots"><span></span><span></span><span></span></div>
          <div className="label">{channel === "email" ? "compose · new message" : "linkedin · inmail"}</div>
          <div></div>
        </div>
        <div className="composer-body">
          <div className="composer-row">
            <span className="row-lbl">{channel === "email" ? "To" : "Recipient"}</span>
            <span className="row-val">
              <span className="composer-pill">
                <span className="avatar">{persona.photoInitials}</span>
                <span style={{ fontSize: 13 }}>{persona.name} <span className="dim">· {persona.title}</span></span>
              </span>
            </span>
          </div>
          {channel === "email" && (
            <div className="composer-row">
              <span className="row-lbl">Subject</span>
              <span className="row-val">
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="—" />
              </span>
            </div>
          )}
          <div className="composer-body-text">
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={`${persona.name.split(" ")[0]},\n\n`}
            />
          </div>
        </div>
        <div className="composer-foot">
          <div className="composer-tools">
            <button className="tool-ico" title="Attach">📎</button>
            <button className="tool-ico" title="Link">🔗</button>
            <button className="tool-ico" title="Format">A</button>
          </div>
          <button className="btn btn-primary" onClick={send} disabled={!body.trim() || busy}>
            {busy ? <Spinner label="sending" /> : "Send →"}
          </button>
        </div>
      </div>

      <div className="step-foot">
        <span><span className="count">{body.split(/\s+/).filter(Boolean).length}</span> words · aim for under 100</span>
      </div>

      {eval_ && (
        <>
          <EvalCard result={eval_} />
          {eval_.replyText && (
            <div className="reply-card">
              <div className="from">
                <div className="avatar">{persona.photoInitials}</div>
                <div className="meta">
                  <div className="nm">{persona.name}</div>
                  <div className="ti">Re: {subject || "(your message)"}</div>
                </div>
                <div className={`outcome ${eval_.outcome}`}>{eval_.outcome}</div>
              </div>
              <div className="body">{eval_.replyText}</div>
            </div>
          )}
        </>
      )}

      <div className="row-end mt-32">
        <button className="btn btn-ghost" onClick={() => nav("room1-persona")}>↩ Back</button>
        {!eval_ ? null : (
          <button className="btn btn-primary" onClick={() => nav("room1-coldcall", {
            outreachChannel: channel,
            outreachSubject: subject,
            outreachBody: body,
            outreachEval: eval_,
            coldCallPersonaId,
          })}>
            {coldCallPersonaId !== state.targetPersona ? "Proceed (Delegated) →" : "Place Cold Call →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// COLD CALL — live chat
// ─────────────────────────────────────────────────────────
function ColdCallScreen({ state, nav, difficulty }) {
  const personaId = state.coldCallPersonaId || state.targetPersona;
  const persona = window.HEIST_DATA.PERSONAS.find(p => p.id === personaId);
  const SECS = 5 * 60;
  return (
    <ChatScreen
      key="cold"
      state={state}
      nav={nav}
      persona={persona}
      mode="cold"
      durationSeconds={SECS}
      onComplete={(outcome) => nav("room1-complete", {
        coldCallTranscript: outcome.transcript,
        coldCallScore: outcome.score,
      })}
      difficulty={difficulty}
      headline={`Cold call · ${persona.name}`}
      sub={persona.title}
    />
  );
}

// ─────────────────────────────────────────────────────────
// ROOM 1 COMPLETE
// ─────────────────────────────────────────────────────────
function Room1CompleteScreen({ state, nav }) {
  // Generate a deterministic access code from team id + scores
  const code = useMemoR1(() => {
    const seed = (state.teamId || "TEAM") + ":" + (state.coldCallScore?.quality || 50);
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ234679";
    let out = "";
    let n = Math.abs(h);
    for (let i = 0; i < 6; i++) { out += chars[n % chars.length]; n = Math.floor(n / chars.length) + 17 * (i + 1); }
    return out;
  }, [state.teamId, state.coldCallScore]);

  const earned = state.coldCallScore?.meetingEarned;

  return (
    <div className="complete">
      <div className="complete-inner">
        <div className="checkmark">{earned ? "✓" : "·"}</div>
        <div className="pre-kicker" style={{ fontFamily: "var(--mono)", color: "var(--accent)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12 }}>
          // PHASE 01 · CLEARED
        </div>
        <h2>{earned ? "Meeting earned." : "Conversation held — barely."}</h2>
        <div style={{ color: "var(--text-2)", fontSize: 16, lineHeight: 1.6, marginBottom: 16, maxWidth: 440, margin: "0 auto" }}>
          {earned
            ? "You earned a longer conversation. The follow-up is on the calendar."
            : "Not a full win — you didn't fully earn the meeting, but you got a short follow-up. Make it count."}
        </div>

        <div className="access-code">
          <div className="lbl">Case Access Code · Team {state.teamId}</div>
          <div className="code">{code}</div>
          <div className="dim" style={{ fontSize: 11, marginTop: 12, fontFamily: "var(--mono)", letterSpacing: "0.1em" }}>
            Take a break. Use this to resume.
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => nav("scene-2", { room1AccessCode: code })}>
          Proceed to Phase 02 →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  LandingScreen, IntroScreen, BriefingScreen, SceneCardScreen,
  ResearchScreen, HypothesisScreen, PersonaSelectScreen, LinkedInModal,
  OutreachScreen, ColdCallScreen, Room1CompleteScreen,
});
