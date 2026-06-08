// screens-room1.jsx — Landing through Room 1 Complete.

const { useState: useStateR1, useEffect: useEffectR1, useRef: useRefR1, useMemo: useMemoR1 } = React;
// Pull shared components into local scope (loaded in screens-shared.jsx)
const Modal = window.Modal;
const Spinner = window.Spinner;
const EvalCard = window.EvalCard;
const ChatScreen = window.ChatScreen;

// ─────────────────────────────────────────────────────────
// LANDING — exact uploaded image with functional overlays
// ─────────────────────────────────────────────────────────
function LandingScreen({ state, nav }) {
  const [teamId, setTeamId] = useStateR1(state.teamId || "");
  const [accessCode, setAccessCode] = useStateR1("");

  const newPlayId = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (String(Date.now()) + "-" + Math.random().toString(36).slice(2));
  const start = () => {
    if (!teamId.trim()) return;
    nav("intro", { teamId: teamId.trim().toUpperCase(), startedAt: Date.now(), playId: newPlayId() });
  };
  const resume = () => {
    if (!accessCode.trim() || !teamId.trim()) return;
    nav("scene-2", {
      teamId: teamId.trim().toUpperCase(),
      accessCode: accessCode.trim().toUpperCase(),
      room1Score: 240,
      resumed: true,
      playId: state.playId || newPlayId()
    });
  };

  return (
    <div className="exact-landing">
      <div className="exact-frame">
        <img className="exact-img" src="assets/landing-exact.png" alt="Cold Case — Case File" />

        {/* SignalPursuits logo — covers the baked wordmark on the black top strip */}
        <div className="lp-logo">
          <span className="lp-badge">S</span>
          <span className="lp-name">SignalPursuits</span>
          <span className="lp-div">|</span>
          <span className="lp-cf">CASE FILE</span>
        </div>
        {/* Subtitle cover */}
        <div className="lp-sub">SignalPursuits · Sales Training Simulation</div>

        {/* Team identifier input (over the image's box) */}
        <input
          className="exact-input exact-team"
          placeholder="JJ"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()} />
        

        {/* Open Case — transparent hotspot over the baked teal button */}
        <button className="exact-hotspot exact-open" onClick={start} disabled={!teamId.trim()} aria-label="Open Case"></button>

        {/* Case access code input (Enter to resume) */}
        <input
          className="exact-input exact-code"
          placeholder="6-character access code"
          value={accessCode}
          maxLength={6}
          onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && resume()} />
        
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// INTRO VIDEO (skippable)
// ─────────────────────────────────────────────────────────
function IntroScreen({ state, nav }) {
  useEffectR1(() => {
    const t = setTimeout(() => nav("transition"), 6000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="intro-stage" onClick={() => nav("transition")}>
      <div className="intro-vignette"></div>
      <div className="intro-card">
        <div className="meta">— CASE FILE OPENED —</div>
        <h1>Case <em style={{ fontStyle: "italic", color: "var(--accent)" }}>A-247</em></h1>
        <div className="tag-line">One account. Old leads. A fresh set of eyes.</div>
        <div className="skip">tap anywhere to skip</div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// TRANSITION VIDEO (opening → case file)
// ─────────────────────────────────────────────────────────
function TransitionScreen({ state, nav }) {
  const vidRef = useRefR1(null);
  const go = () => nav("briefing");
  useEffectR1(() => {
    const v = vidRef.current;
    if (!v) return;
    let done = false;
    const onEnd = () => { if (!done) { done = true; go(); } };
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", onEnd);
    const fallback = setTimeout(onEnd, 60000);
    v.muted = false;
    v.volume = 1;
    const p = v.play && v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
    return () => { v.removeEventListener("ended", onEnd); v.removeEventListener("error", onEnd); clearTimeout(fallback); };
  }, []);
  return (
    <div className="transition-stage" onClick={go}>
      <video ref={vidRef} className="transition-video" src="assets/prospecting-transition.mp4" autoPlay playsInline></video>
      <div className="transition-skip">tap anywhere to skip →</div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// DISCOVERY-ROOM TRANSITION (Phase 1 filed → Discovery)
// ─────────────────────────────────────────────────────────
function Room2TransitionScreen({ state, nav }) {
  const vidRef = useRefR1(null);
  const go = () => nav("scene-2");
  useEffectR1(() => {
    const v = vidRef.current;
    if (!v) return;
    let done = false;
    const onEnd = () => { if (!done) { done = true; go(); } };
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", onEnd);
    const fallback = setTimeout(onEnd, 60000);
    v.muted = false;
    v.volume = 1;
    const p = v.play && v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
    return () => { v.removeEventListener("ended", onEnd); v.removeEventListener("error", onEnd); clearTimeout(fallback); };
  }, []);
  return (
    <div className="transition-stage" onClick={go}>
      <video ref={vidRef} className="transition-video" src="assets/discovery-room-transition.mp4" autoPlay playsInline></video>
      <div className="transition-skip">tap anywhere to skip →</div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// BRIEFING (exact dossier image with functional overlays)
// ─────────────────────────────────────────────────────────
function BriefingScreen({ state, nav }) {
  const proceed = () => nav("scene-1");
  return (
    <div className="brf">
      <div className="brf-grain"></div>
      <button className="brf-restart" onClick={() => nav("landing")} aria-label="Restart">↺ Restart</button>
      <div className="brf-inner">
        <header className="brf-head">
          <div className="brf-status">● Case Reopened · Active</div>
          <h1 className="brf-title">Case File</h1>
          <div className="brf-subject2">Meridian Capital Group</div>
        </header>

        <div className="brf-cols">
          <div className="brf-left">
            <div className="brf-block">
              <div className="brf-kicker">// Your Assignment</div>
              <p>You've been assigned to revive a cold account. A small Dynatrace pilot here went quiet thirteen months ago. Rebuild the case, find the opening, and revive the opportunity — or uncover a bigger one. Follow the protocol. Uncover the truth.</p>
            </div>
            <div className="brf-block">
              <div className="brf-kicker">// Phase 01 Objective</div>
              <p>Uncover the signal. Build the case. Create the opening.</p>
            </div>
            <button className="brf-begin2" onClick={proceed}>Begin Investigation →</button>
          </div>

          <div className="brf-right">
            <div className="dossier">
              <div className="dos-head">
                <div>
                  <div className="dos-l">Dossier</div>
                  <div className="dos-subject">Subject: <span>Meridian Capital Group</span></div>
                </div>
                <img className="dos-logo" src="assets/meridian-logo.svg" alt="Meridian Capital Group" />
              </div>

              <div className="dos-grid">
                <div className="dos-overview">
                  <div className="dos-h">Company Overview</div>
                  <p>Meridian Capital Group (NYSE: MCG) is a mid-tier regional bank in commercial lending, wealth management, and capital markets across the US Southeast &amp; Mid-Atlantic. Mid-integration after the 2023 Heritage Southern acquisition, and newly under enhanced regulatory examination.</p>
                  <div className="dos-h">Tech Estate</div>
                  <div className="dos-chips">
                    <span>Core: FIS + Fiserv (dual)</span><span>Cloud: AWS · Kubernetes</span><span>Monitoring: Splunk + Instana</span><span>Data: Snowflake</span>
                  </div>
                </div>
                <div className="dos-glance">
                  <div className="dos-h">At a Glance</div>
                  <table><tbody>
                    <tr><td>Founded</td><td>1987</td></tr>
                    <tr><td>HQ</td><td>Charlotte, NC</td></tr>
                    <tr><td>Revenue (FY25)</td><td>~$4.8B</td></tr>
                    <tr><td>Total Assets</td><td>$310B</td></tr>
                    <tr><td>Employees</td><td>~14,200</td></tr>
                    <tr><td>Branches</td><td>420+</td></tr>
                  </tbody></table>
                </div>
              </div>

              <div className="dos-grid2">
                <div>
                  <div className="dos-h">Revenue Mix (FY2025)</div>
                  <div className="dos-donut-row">
                    <div className="dos-donut"></div>
                    <ul className="dos-legend">
                      <li><i style={{ background: "#1f8a87" }}></i>65% Net Interest Income</li>
                      <li><i style={{ background: "#6fb78a" }}></i>22% Wealth Management</li>
                      <li><i style={{ background: "#7b5ea7" }}></i>8% Treasury Services</li>
                      <li><i style={{ background: "#8a93a0" }}></i>5% Other</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="dos-h">Pressure Points</div>
                  <ul className="dos-checks">
                    <li>March 2026 mobile outage — undetected bad deploy</li>
                    <li>Category III OCC exam now underway</li>
                    <li>Dual core-banking integration (FIS + Fiserv)</li>
                    <li>Meridian Forward cloud / Kubernetes buildout</li>
                  </ul>
                </div>
              </div>

              <div className="dos-why">
                <div className="dos-h">Why It Matters</div>
                <p>A favored Dynatrace pilot froze on budget — not a loss. The freeze has lifted, a new observability-first CTO is in, and a public outage gives a fresh, dated reason to re-open. Revive the deal, and grow it into the cloud buildout.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="brf-protocol">
          <div className="brf-kicker">// Phase 01 Protocol</div>
          <div className="brf-steps">
            <div className="brf-step"><span className="n">01</span><b>Investigate the Account.</b></div>
            <div className="brf-step"><span className="n">02</span><b>Build a Pain Hypothesis.</b></div>
            <div className="brf-step"><span className="n">03</span><b>Choose a Persona.</b></div>
            <div className="brf-step"><span className="n">04</span><b>Craft Your Outreach.</b></div>
          </div>
        </div>
      </div>
    </div>);

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
      setRemaining((r) => {
        if (r <= 1) {clearInterval(id);nav(next);return 0;}
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
          strokeDashoffset={offset}>
          </circle>
        </svg>
        <div className="tap-hint">tap to skip</div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// ROOM 1 — RESEARCH WORKSPACE
// ─────────────────────────────────────────────────────────
const INVESTIGATION = [
{ id: "past-opps", cat: "PRIOR DEALS", title: "Past closed opportunities", q: "What did they buy before?", findings: [
  { src: "CRM · closed-lost", text: "FY2025 — a small observability pilot, ~$48K. Shortlisted with Datadog and favored, then lost to 'no decision' when a 90-day IT spend freeze hit after a Q1 earnings miss." },
  { src: "CRM · history", text: "First engaged Nov 2024 after a branch-cutover incident the incumbent monitoring missed. A bottom-up technical pilot — never reached budget authority. No closed-won." },
  { src: "Signal", text: "No active opportunity in ~13 months. This is a cold account — the relationship went quiet, not hostile." }]
},
{ id: "leadership", cat: "PEOPLE", title: "Leadership changes", q: "Who's new or moved on?", findings: [
  { src: "LinkedIn", text: "First-ever CTO, Brian Sorrell, joined ~1 month ago from Capital One — known to have used Dynatrace there." },
  { src: "Press", text: "Your prior pilot champion, Greg Halloran (a Lead SRE), was laid off last year — a bottom-up contact, never a budget owner." },
  { src: "Org", text: "CIO Robert Callahan — the original economic buyer — is still in seat; a new CISO, Kevin Landers, came in mid-2025." }]
},
{ id: "earnings", cat: "FINANCIALS", title: "Earnings & financial performance", q: "How are they performing?", findings: [
  { src: "Q1 2026 call", text: "~$4.8B net revenue; technology & ops spend up ~$40M YoY, driven by the complexity of running two core-banking systems through the Heritage integration." },
  { src: "CFO commentary", text: "Compliance infrastructure named a top capital-allocation priority for the next 18 months; tool consolidation flagged as a way to offset spend." },
  { src: "Signal", text: "Budget exists for resilience and consolidation that lowers risk and cost — not open-ended net-new spend." }]
},
{ id: "strategic", cat: "STRATEGY", title: "Strategic initiatives", q: "What are they focused on?", findings: [
  { src: "Investor day", text: "'Meridian Forward' — a $600M, AWS-first program: a real-time payments hub, a 'Merit' AI assistant, and zero-trust." },
  { src: "Commitment", text: "$80M in AI-driven efficiency gains targeted by 2027; wealth & fee income growth to 40% of revenue." },
  { src: "Signal", text: "Every initiative now rides on digital reliability. Tie your story to keeping Meridian Forward up — not features." }]
},
{ id: "tech", cat: "TECH", title: "Technology investments", q: "Where are they betting?", findings: [
  { src: "Job posts", text: "Kubernetes, Terraform, and ArgoCD across a new cloud-native buildout — workloads with no mature monitoring yet." },
  { src: "Architecture", text: "A dual core-banking estate — FIS Modern Banking + legacy Fiserv Premier — mid-migration, with inconsistent logging between them." },
  { src: "Signal", text: "They live in day-2 operational reality. Generic 'AI-powered' claims get shut down — bring specifics." }]
},
{ id: "mna", cat: "M&A", title: "M&A activity", q: "Are they buying or being acquired?", findings: [
  { src: "Press", text: "Acquired Heritage Southern (2023, ~doubled the branch count) and a wealth RIA, Covington (2025)." },
  { src: "Analyst", text: "An acquirer, not a target — but carrying real integration debt across merged application stacks." },
  { src: "Signal", text: "Integration debt = fragmented pipelines and monitoring blind spots. That's the wedge." }]
},
{ id: "news", cat: "PRESS", title: "News & press coverage", q: "What's in the headlines?", findings: [
  { src: "Charlotte Business Journal", text: "A 6-hour mobile-banking outage on March 14, 2026 — a failed payments-middleware deploy, undetected until customers felt it." },
  { src: "American Banker", text: "Named its first-ever CTO and is moving into its first Category III OCC examination cycle." },
  { src: "Signal", text: "The outage is a fresh, dated incident — a concrete reason to re-open without referencing the dead deal." }]
},
{ id: "hiring", cat: "HIRING", title: "Hiring trends", q: "What roles are they adding?", findings: [
  { src: "Careers page", text: "An 'Observability Engineer' req referencing 'next-generation observability platforms' and OpenTelemetry." },
  { src: "Job posts", text: "SRE and a 'Manager, Monitoring & Incident Response' backfill — detection and response is understaffed." },
  { src: "Signal", text: "Hiring for observability + incident response means an active evaluation is already underway. That's your wedge." }]
},
{ id: "industry", cat: "MARKET", title: "Industry & market shifts", q: "What external forces matter?", findings: [
  { src: "Regulation", text: "Crossing $100B in assets triggered Category III status — enhanced OCC scrutiny of tech controls and operational resilience." },
  { src: "Market", text: "Observability and security are converging; banks are collapsing 5-7 monitoring tools into 1-2 platforms." },
  { src: "Signal", text: "The external pressure (resilience, regulation, consolidation) is exactly their internal pressure. Align to it." }]
}];

const INVEST_POS = [21.5, 29, 36.2, 43.7, 50.8, 57.7, 64.4, 71.1, 77.8];

const RIGHT_TOOLS = [
{ id: "sfdc", cat: "CRM RECORD", title: "SFDC Record", q: "Account details, ownership, pipeline history, and prior engagements.", html: "assets/sfdc-record.html", pos: { left: "70.4%", top: "18.4%", width: "20.2%", height: "14.2%" }, findings: [
  { src: "Account", text: "Owner: unassigned — the last AE (Paul Nettles) rolled off. Tier: Enterprise. Segment: Banking & Financial Services." },
  { src: "Pipeline history", text: "One small closed-lost pilot ($48K, 'no decision / budget freeze'). Two open plays: revive bigger, or net-new whitespace." },
  { src: "Engagement", text: "Last logged activity ~13 months ago. The account is dormant — this is a re-entry." }]
},
{ id: "ir", cat: "INVESTOR RELATIONS", title: "Investor Relations", q: "Financials, investor presentations, earnings calls, and shareholder comms.", href: "https://www.google.com/search?q=Meridian+Capital+Group+investor+relations", pos: { left: "70.4%", top: "34.4%", width: "20.2%", height: "18.2%" }, findings: [
  { src: "10-K", text: "Now a Category III institution after crossing $100B in assets — subject to enhanced OCC examination for the first time." },
  { src: "Earnings call", text: "Q1 2026 — tech & ops spend up ~$40M YoY on dual-core complexity; compliance infrastructure a top capital priority." },
  { src: "Investor deck", text: "'Meridian Forward' centers on cloud modernization, a real-time payments hub, and ~$80M in AI efficiency by 2027." }]
},
{ id: "news2", cat: "PRESS", title: "In the News", q: "The latest news, press releases, and market coverage.", href: "https://www.google.com/search?q=%22Meridian+Capital+Group%22&tbm=nws", pos: { left: "70.4%", top: "53.6%", width: "20.2%", height: "15.6%" }, findings: [
  { src: "Press", text: "The March 2026 mobile-banking outage tied to a failed middleware deploy — board-level attention to resilience." },
  { src: "Coverage", text: "First-ever CTO appointed; the bank is entering its first Category III exam cycle." },
  { src: "Signal", text: "Lead with the outage and the exam — fresh, dated, and squarely about detection." }]
},
{ id: "li", cat: "LINKEDIN", title: "LinkedIn Intelligence", q: "Leadership profiles, recent posts, org changes, and company activity.", html: "assets/linkedin-intel.html", pos: { left: "70.4%", top: "70.6%", width: "20.2%", height: "15.0%" }, findings: [
  { src: "Profiles", text: "New CTO Brian Sorrell (ex-Capital One, an observability-first leader) and CIO Robert Callahan, the original economic buyer." },
  { src: "Recent posts", text: "Rachel Morgan (VP, Infra & Platform Eng) posting that 'detection is a design choice, not a postmortem.'" },
  { src: "Org changes", text: "Your prior champion, Greg Halloran (Lead SRE), was laid off — no warm thread left. Rachel Morgan owns the platform org today." }]
}];


function ResearchScreen({ state, nav }) {
  const [open, setOpen] = useStateR1(null);
  const [notes, setNotes] = useStateR1(state.researchNotes || "");
  const [logged, setLogged] = useStateR1(state.investLogged || []);
  const topic = INVESTIGATION.concat(RIGHT_TOOLS).find((t) => t.id === open);

  const logToNotes = (t) => {
    setNotes((n) => (n ? n + "\n" : "") + "• " + t.title + " — " + t.findings.map((f) => f.text).join(" "));
    setLogged((l) => l.includes(t.id) ? l : [...l, t.id]);
  };

  return (
    <div className="exact-landing">
      <div className="exact-frame exact-frame-investigation">
        <img className="exact-img" src="assets/investigation-exact.png" alt="Investigation — Phase 01" />

        {/* Left "what you're looking for" list is static (not clickable) */}

        {RIGHT_TOOLS.map((t) =>
        <button
          key={t.id}
          className={"exact-hotspot invest-hotspot" + (logged.includes(t.id) ? " logged" : "")}
          style={t.pos}
          onClick={() => { if (t.href) { window.open(t.href, "_blank", "noopener"); logToNotes(t); } else { setOpen(t.id); } }}
          aria-label={t.title}>
        </button>
        )}

        <button className="brief-begin invest-proceed" onClick={() => nav("room1-hypothesis", { researchNotes: notes, investLogged: logged })}>
          Build Hypothesis →
        </button>

        {topic &&
        <div className="invest-veil" onClick={(e) => {if (e.target.classList.contains("invest-veil")) setOpen(null);}}>
            <div className={"invest-modal thin-scroll" + (topic.html ? " embed" : "")}>
              <button className="modal-x" onClick={() => setOpen(null)}>×</button>
              {topic.html ?
            <>
                  <iframe className="invest-embed" src={topic.html} title={topic.title}></iframe>
                  <div className="invest-modal-foot embed-foot">
                    <button className="btn btn-ghost" onClick={() => {logToNotes(topic);setOpen(null);}} disabled={logged.includes(topic.id)}>
                      {logged.includes(topic.id) ? "✓ Logged" : "+ Log to case notes"}
                    </button>
                    <button className="btn btn-primary" onClick={() => setOpen(null)}>Close</button>
                  </div>
                </> :

            <>
                  <div className="kicker">// {topic.cat}</div>
                  <h3>{topic.title}</h3>
                  <div className="q">{topic.q}</div>
                  <div className="invest-findings">
                    {topic.findings.map((f, i) =>
                <div key={i} className="invest-finding">
                        <div className="src">{f.src}</div>
                        <div className="txt">{f.text}</div>
                      </div>
                )}
                  </div>
                  <div className="invest-modal-foot">
                    <button className="btn btn-ghost" onClick={() => {logToNotes(topic);setOpen(null);}} disabled={logged.includes(topic.id)}>
                      {logged.includes(topic.id) ? "✓ Logged" : "+ Log to case notes"}
                    </button>
                    <button className="btn btn-primary" onClick={() => setOpen(null)}>Close</button>
                  </div>
                </>
            }
            </div>
          </div>
        }
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// HYPOTHESIS
// ─────────────────────────────────────────────────────────
function HypothesisScreen({ state, nav, setStepTimerSeconds }) {
  const [text, setText] = useStateR1(state.hypothesis || "");
  const [eval_, setEval] = useStateR1(state.hypothesisEval || null);
  const [busy, setBusy] = useStateR1(false);

  useEffectR1(() => {setStepTimerSeconds && setStepTimerSeconds(7 * 60);}, []);

  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    const prompt = window.HEIST_DATA.JUDGE_PROMPTS.hypothesis({ submission: text });
    const result = await window.HEIST_API.evaluate(prompt);
    setEval(result);
    setBusy(false);
  };

  // Immediate feedback on its own screen (same as the pre-call assessment).
  const AP = window.AssessmentPage;
  if (eval_ && AP) return (
    <AP
      result={eval_}
      label="Hypothesis"
      phase="Phase 01 · Hypothesis Assessment"
      onRevise={() => setEval(null)}
      continueLabel="Select Target →"
      onContinue={() => nav("room1-persona", { hypothesis: text, hypothesisEval: eval_ })} />
  );

  return (
    <div className="centered-pane">
      <div className="pre-kicker">// Phase 01 / Step 02</div>
      <h2>Working hypothesis.</h2>
      <div className="lead">
        Based on the evidence, what initiative is {window.HEIST_DATA.SCENARIO.account} prioritizing — and what would you predict is broken?
        Be specific. Cite what you found.
      </div>

      {state.researchNotes ?
      <details style={{ marginBottom: 24, padding: 12, border: "1px dashed var(--border)", borderRadius: 2 }}>
          <summary className="mono dim" style={{ cursor: "pointer", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            ⏵ Your case notes ({state.researchNotes.length} chars)
          </summary>
          <div className="mono" style={{ whiteSpace: "pre-wrap", fontSize: 12, marginTop: 12, color: "var(--text-2)", lineHeight: 1.6 }}>
            {state.researchNotes}
          </div>
        </details> :
      null}

      <textarea
        className="big-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`The pattern emerging at ${window.HEIST_DATA.SCENARIO.account} appears to be...`} />


      <div className="step-foot">
        <span><span className="count">{text.length}</span> chars · aim for 200-500</span>
        <span>{busy ? <Spinner label="judging" /> : null}</span>
      </div>

      <div className="row-end mt-32">
        <button className="btn btn-ghost" onClick={() => nav("room1-research")}>↩ Back to Research</button>
        <button className="btn btn-primary" onClick={submit} disabled={!text.trim() || busy}>
          {busy ? "Analyzing…" : "Submit Hypothesis →"}
        </button>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// PERSONA SELECTION (corkboard)
// ─────────────────────────────────────────────────────────
function PersonaSelectScreen({ state, nav }) {
  const pick = (id) => nav("room1-outreach", { targetPersona: id });
  return (
    <div className="exact-landing">
      <div className="exact-frame exact-frame-persona">
        <img className="exact-img" src="assets/persona-exact.png" alt="Persons of Interest" />
        {/* Three SELECT buttons → choose persona and proceed to outreach */}
        <button className="exact-hotspot persona-select" style={{ left: "27.4%", top: "62.4%", width: "11.2%", height: "5.2%" }} onClick={() => pick("sarah")} aria-label="Select Rachel Morgan"></button>
        <button className="exact-hotspot persona-select" style={{ left: "43.1%", top: "62.6%", width: "11.2%", height: "5.2%" }} onClick={() => pick("michael")} aria-label="Select Daniel Hughes"></button>
        <button className="exact-hotspot persona-select" style={{ left: "57.9%", top: "61.8%", width: "11.2%", height: "5.2%" }} onClick={() => pick("marcus")} aria-label="Select Priya Natarajan"></button>
      </div>
    </div>);

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
        {persona.tag &&
        <div className="mono" style={{ display: "inline-block", marginTop: 8, padding: "4px 10px", border: "1px solid var(--accent-dim)", color: "var(--accent)", fontSize: 10, letterSpacing: "0.2em" }}>
            {persona.tag}
          </div>
        }
        {persona.decoyReason &&
        <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--red-dim)", color: "var(--red)", borderRadius: 2, fontSize: 13, fontFamily: "var(--mono)", letterSpacing: "0.05em" }}>
            ⚠ RULED OUT · {persona.decoyReason}
          </div>
        }
        {!persona.decoyReason &&
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
        }
      </div>
    </Modal>);

}

// ─────────────────────────────────────────────────────────
// OUTREACH
// ─────────────────────────────────────────────────────────
function OutreachScreen({ state, nav }) {
  const PKEY = { sarah: "rachel", michael: "daniel", marcus: "priya" };
  const persona = window.HEIST_DATA.PERSONAS.find((p) => p.id === state.targetPersona) || window.HEIST_DATA.PERSONAS[0];
  const pkey = PKEY[persona.id] || "rachel";
  const [channel, setChannel] = useStateR1(state.outreachChannel || "email");
  const [subject, setSubject] = useStateR1(state.outreachSubject || "");
  const [body, setBody] = useStateR1(state.outreachBody || "");
  const [eval_, setEval] = useStateR1(state.outreachEval || null);
  const [busy, setBusy] = useStateR1(false);
  const [showLI, setShowLI] = useStateR1(false);

  const MAX = channel === "email" ? 2000 : 1900; // LinkedIn InMail ~1900 char cap
  const words = body.split(/\s+/).filter(Boolean).length;

  const send = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    const submission = channel === "email" ? "Subject: " + subject + "\n\n" + body : body;
    const prompt = window.HEIST_DATA.JUDGE_PROMPTS.outreach({
      submission, channel, personaName: persona.name, personaTitle: persona.title
    });
    const result = await window.HEIST_API.evaluate(prompt);
    setEval(result);
    setBusy(false);
  };

  // Delegation cascade (ids: sarah=exec, michael=director, marcus=manager)
  let coldCallPersonaId = persona.id;
  if (eval_ && eval_.outcome === "delegated") {
    if (eval_.delegateTo === "manager") coldCallPersonaId = "marcus";else
    if (eval_.delegateTo === "director") coldCallPersonaId = "michael";else
    if (persona.level === "executive") coldCallPersonaId = "michael";else
    if (persona.level === "director") coldCallPersonaId = "marcus";
  }
  if (eval_ && eval_.outcome === "declined") {
    coldCallPersonaId = persona.level === "executive" ? "michael" : "marcus";
  }

  return (
    <div className="exact-landing">
      <div className="exact-frame exact-frame-outreach">
        <img className="exact-img" src="assets/outreach-exact.png" alt="Outreach — Phase 01" />

        {/* Dynamic polaroid: face + caption over the baked card */}
        <div className="ot-photo"><img src={"assets/face-" + pkey + ".png"} alt={persona.name} /></div>
        <div className="ot-caption">
          <div className="ot-nm">{persona.name}</div>
          <div className="ot-ti">{persona.title}</div>
          <div className="ot-co">{persona.company}</div>
          <div className="ot-tag">{persona.tag}</div>
        </div>

        {/* View LinkedIn profile hotspot */}
        <button className="exact-hotspot ot-li" onClick={() => setShowLI(true)} aria-label="View LinkedIn profile"></button>

        {/* Compose UI inside the laptop screen */}
        <div className="ot-screen">
          <div className="ot-tabs">
            <button className={channel === "email" ? "active" : ""} onClick={() => setChannel("email")}>Email</button>
            <button className={channel === "linkedin" ? "active" : ""} onClick={() => setChannel("linkedin")}>LinkedIn InMail</button>
          </div>
          <div className={"ot-compose " + channel}>
            <div className="ot-chead">{channel === "email" ? "Compose · New Message" : "LinkedIn · InMail"}</div>
            {channel === "email" ?
            <div className="ot-row">
                <span className="ot-rl">To</span>
                <span className="ot-pill"><span className="av">{persona.photoInitials}</span>{persona.name} <span className="dim">· {persona.title}</span></span>
              </div> :

            <div className="ot-row li-recipient">
                <span className="li-av">{persona.photoInitials}</span>
                <span className="li-meta">
                  <span className="li-nm">{persona.name} <span className="li-deg">· 2nd</span></span>
                  <span className="li-hl">{persona.title} at {persona.company}</span>
                </span>
                <span className="li-inmail">✦ InMail</span>
              </div>
            }
            <div className="ot-row">
              <span className="ot-rl">Subject</span>
              <input className="ot-subj" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="—" maxLength={120} />
            </div>
            <textarea
              className="ot-body"
              value={body}
              maxLength={MAX}
              onChange={(e) => setBody(e.target.value)}
              placeholder={persona.name.split(" ")[0] + ", "}>
            </textarea>
            <div className="ot-foot">
              <span className="ot-count">
                {channel === "email" ?
                words + " words · aim for under 100" :
                body.length + " / " + MAX + " characters"}
              </span>
              <button className="ot-send" onClick={send} disabled={!body.trim() || busy}>
                {busy ? "Sending…" : "Send →"}
              </button>
            </div>
          </div>
        </div>

        {/* LinkedIn profile modal */}
        {showLI &&
        <div className="invest-veil" onClick={(e) => {if (e.target.classList.contains("invest-veil")) setShowLI(false);}}>
            <div className="invest-modal embed">
              <button className="modal-x" onClick={() => setShowLI(false)}>×</button>
              <iframe className="invest-embed" src={"assets/" + pkey + "-linkedin.html"} title="LinkedIn profile"></iframe>
            </div>
          </div>
        }

        {/* Reply / evaluation modal after send */}
        {eval_ &&
        <div className="invest-veil">
            <div className="invest-modal thin-scroll">
              <button className="modal-x" onClick={() => setEval(null)}>×</button>
              <div className="kicker">// Response received</div>
              <div className={"ot-reply-from " + eval_.outcome}>
                <span className="av">{persona.photoInitials}</span>
                <span className="who"><b>{persona.name}</b><span className="dim"> · {persona.title}</span></span>
                <span className={"ot-outcome " + eval_.outcome}>{eval_.outcome}</span>
              </div>
              {eval_.replyText && <div className="ot-reply-body">{eval_.replyText}</div>}
              <div className={"eval-card " + (eval_.tier || "developing")} style={{ marginTop: 16 }}>
                <div className="tier">Assessment · {eval_.tier}</div>
                <div className="feedback">{eval_.feedback}</div>
                {eval_.coach && <div className="coach">Coach: {eval_.coach}</div>}
              </div>
              <div className="invest-modal-foot">
                <button className="btn btn-ghost" onClick={() => setEval(null)}>Revise</button>
                <button className="btn btn-primary" onClick={() => nav("room1-coldcall", {
                outreachChannel: channel, outreachSubject: subject, outreachBody: body,
                outreachEval: eval_, coldCallPersonaId
              })}>
                  {coldCallPersonaId !== persona.id ? "Proceed (Delegated) →" : "Place Cold Call →"}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// COLD CALL — live chat
// ─────────────────────────────────────────────────────────
function ColdCallScreen({ state, nav, difficulty }) {
  const PKEY = { sarah: "rachel", michael: "daniel", marcus: "priya" };
  const personaId = state.coldCallPersonaId || state.targetPersona || "sarah";
  const persona = window.HEIST_DATA.PERSONAS.find((p) => p.id === personaId) || window.HEIST_DATA.PERSONAS[0];
  const pkey = PKEY[persona.id] || "rachel";
  const first = persona.name.split(" ")[0];

  const [messages, setMessages] = useStateR1([]);
  const [draft, setDraft] = useStateR1("");
  const [busy, setBusy] = useStateR1(false);
  const [typing, setTyping] = useStateR1("");
  const [ending, setEnding] = useStateR1(false);
  const [scored, setScored] = useStateR1(null);
  const [timeLeft, setTimeLeft] = useStateR1(448); // 07:28
  const logRef = useRefR1(null);
  const tickRef = useRefR1({});

  const stamp = (i) => {
    const base = 9 * 60 + 1; // 09:01
    const t = base + Math.floor(i / 2);
    return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
  };

  // Persona opens the call
  useEffectR1(() => {
    (async () => {
      setBusy(true);setTyping("");
      const sys = window.HEIST_DATA.characterPrompt(persona, "cold", { difficulty });
      const reply = await window.HEIST_API.chat({
        system: sys,
        messages: [{ role: "user", content: "[The call has just been picked up. Open in character, briefly.]" }],
        onChunk: (c) => setTyping((t) => t + c)
      });
      setTyping("");
      setMessages([{ role: "assistant", content: reply }]);
      setBusy(false);
    })();
  }, []);

  useEffectR1(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, typing, scored]);

  // Live countdown — auto-ends the call at 00:00
  useEffectR1(() => {
    const id = setInterval(() => {
      if (tickRef.current.ending || tickRef.current.scored) return;
      setTimeLeft((t) => {
        if (t <= 1) { if (tickRef.current.endCall) tickRef.current.endCall(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const send = async () => {
    if (!draft.trim() || busy || ending) return;
    const next = [...messages, { role: "user", content: draft.trim() }];
    setMessages(next);setDraft("");setBusy(true);setTyping("");
    const sys = window.HEIST_DATA.characterPrompt(persona, "cold", { difficulty });
    const reply = await window.HEIST_API.chat({ system: sys, messages: next, onChunk: (c) => setTyping((t) => t + c) });
    setTyping("");
    setMessages([...next, { role: "assistant", content: reply }]);
    setBusy(false);
    if (/\[END_CALL\]/i.test(reply)) setTimeout(() => endCall(), 1200);
  };

  const endCall = async () => {
    if (ending) return;
    setEnding(true);setBusy(true);
    const score = await window.HEIST_API.scoreConversation({ transcript: messages, mode: "cold", persona });
    setScored(score);setBusy(false);
  };

  const proceed = () => nav("room1-complete", {
    coldCallTranscript: messages,
    coldCallScore: scored || { implication: 30, champion: 30, economicBuyer: 30, quality: 30, meetingEarned: false, summary: "Call ended early." }
  });

  tickRef.current = { ending, scored, endCall };
  const tmm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const tss = String(timeLeft % 60).padStart(2, "0");
  const tcls = timeLeft <= 30 ? " crit" : timeLeft <= 90 ? " warn" : "";

  return (
    <div className="exact-landing">
      <div className="exact-frame exact-frame-coldcall">
        <img className="exact-img" src="assets/coldcall-exact.png" alt="Cold call — surveillance room" />
        <div className="cc-title"><b>COLD CALL</b> <span>/ SURVEILLANCE ROOM</span></div>
        <div className={"cc-timer" + tcls}>{tmm}:{tss}</div>

        {/* Dynamic persona card — opaque, fully covers the baked left card */}
        <div className="cc-left-card">
          <div className="cc-photo"><img src={"assets/face-" + pkey + ".png"} alt={persona.name} /></div>
          <div className="cc-nm">{persona.name}</div>
          <div className="cc-ti">{persona.title}</div>
          <div className="cc-co">{persona.company}</div>
          <button className="cc-end" onClick={endCall} disabled={ending || messages.length === 0}>End Call &amp; Score →</button>
        </div>

        {/* Chat panel (covers baked chat) */}
        <div className="cc-panel">
          <div className="cc-log thin-scroll" ref={logRef} style={{ height: "530px" }}>
            <div className="cc-sys">— Connection established. {persona.name} is on the line. —</div>
            {messages.map((m, i) =>
            <div key={i} className="cc-turn">
                <div className="cc-bubble">
                  <div className={"cc-who " + (m.role === "user" ? "you" : "them")}>{m.role === "user" ? "YOU" : persona.name.toUpperCase()}</div>
                  <div className="cc-text">{m.content.replace(/\[END_CALL\]/gi, "").trim()}</div>
                </div>
              </div>
            )}
            {typing &&
            <div className="cc-turn">
                <div className="cc-bubble">
                  <div className="cc-who them">{persona.name.toUpperCase()}</div>
                  <div className="cc-text">{typing}<span className="cc-caret">▍</span></div>
                </div>
              </div>
            }
            {busy && !typing &&
            <div className="cc-turn"><div className="cc-bubble"><div className="typing"><span></span><span></span><span></span></div></div></div>
            }
            {scored &&
            <div className="cc-coach">
                <div className="kicker" style={{ marginBottom: 8 }}>// Call ended — coach summary</div>
                <div className="cc-coach-sum">{scored.summary}</div>
                <div className={"cc-coach-meet " + (scored.meetingEarned ? "ok" : "no")}>
                  {scored.meetingEarned ? "✓ Meeting earned" : "✗ Meeting not earned — short follow-up only"}
                </div>
                <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={proceed}>Continue →</button>
              </div>
            }
          </div>
          {!scored &&
          <div className="cc-input" style={{ alignItems: "stretch", justifyContent: "flex-start", padding: "13px 15px" }}>
              <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {if (e.key === "Enter" && !e.shiftKey) {e.preventDefault();send();}}}
              placeholder={busy ? first + " is responding…" : "Type your response…"}
              disabled={busy || ending}>
            </textarea>
              <button className="cc-send" onClick={send} disabled={busy || ending || !draft.trim()}>SEND →</button>
            </div>
          }
        </div>
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────
// ROOM 1 COMPLETE
// ─────────────────────────────────────────────────────────
function Room1CompleteScreen({ state, nav }) {
  // Generate a deterministic access code from team id + scores
  const code = useMemoR1(() => {
    const seed = (state.teamId || "TEAM") + ":" + (state.coldCallScore?.quality || 50);
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i) | 0;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ234679";
    let out = "";
    let n = Math.abs(h);
    for (let i = 0; i < 6; i++) {out += chars[n % chars.length];n = Math.floor(n / chars.length) + 17 * (i + 1);}
    return out;
  }, [state.teamId, state.coldCallScore]);

  const earned = state.coldCallScore?.meetingEarned;
  const cs = state.coldCallScore || {};
  const who = window.HEIST_DATA.PERSONAS.find((p) => p.id === (state.coldCallPersonaId || state.targetPersona)) || null;
  const target = window.HEIST_DATA.PERSONAS.find((p) => p.id === state.targetPersona) || null;
  const delegated = who && target && who.id !== target.id;
  const rank = { executive: 3, director: 2, manager: 1 };
  let delegLine = null;
  if (delegated) {
    const down = (rank[who.level] || 2) < (rank[target.level] || 2);
    delegLine = down ?
      `${target.name} routed you down to ${who.name} — the right altitude for this ask.` :
      `${target.name} sent you up to ${who.name} to get this decided.`;
  }
  const evidence = [
    { k: "Implication of Pain", v: cs.implication },
    { k: "Champion Behavior", v: cs.champion },
    { k: "Economic Buyer", v: cs.economicBuyer }];

  return (
    <div className="me-stage">
      <div className="me-inner">
        <div className="me-check">
          <span className="me-tick tl"></span><span className="me-tick tr"></span>
          <span className="me-tick bl"></span><span className="me-tick br"></span>
          <span className="me-check-mark">{earned ? "✓" : "·"}</span>
        </div>
        <div className="me-kicker">// Phase 01 · Cleared</div>
        <h2 className="me-title">{earned ? "Meeting earned." : "Door barely held."}</h2>
        <div className="me-sub">
          {earned ?
          "You earned a longer conversation. The follow-up is on the calendar." :
          "Not a full win — but you got a short follow-up. Make it count."}
        </div>

        {who &&
        <div className="me-next">
            Your discovery interview is with <strong>{who.name}</strong> — {who.title}, {who.company}.
            {delegLine && <div className="me-deleg">{delegLine}</div>}
          </div>
        }

        <div className="me-evidence">
          <div className="me-evidence-l">Evidence Collected</div>
          {evidence.map((e, i) =>
          <div key={i} className={"me-ev-row" + ((e.v || 0) >= 45 ? " on" : "")}>
              <span className="me-ev-box">{(e.v || 0) >= 45 ? "✓" : ""}</span>
              <span className="me-ev-k">{e.k}</span>
            </div>
          )}
        </div>

        <div className="me-code">
          <div className="me-code-l">Case Access Code · Team {state.teamId}</div>
          <div className="me-code-v">{code.split("").join(" ")}</div>
          <div className="me-code-d">Take a break. Use this to resume.</div>
        </div>

        <button className="me-proceed" onClick={() => nav("room2-transition", { room1AccessCode: code, discoveryPersonaId: who ? who.id : undefined })}>
          Proceed to Phase 02 →
        </button>
      </div>
    </div>);

}

Object.assign(window, {
  LandingScreen, IntroScreen, TransitionScreen, Room2TransitionScreen, BriefingScreen, SceneCardScreen,
  ResearchScreen, HypothesisScreen, PersonaSelectScreen, LinkedInModal,
  OutreachScreen, ColdCallScreen, Room1CompleteScreen
});