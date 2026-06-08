// app.jsx — state machine, routing, tweaks, persistence.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "difficulty": "hard"
}/*EDITMODE-END*/;

// Pull screens into local scope (each Babel script has its own scope).
const _TopBar           = window.TopBar;
const _RoomClock        = window.RoomClock;
const _LandingScreen    = window.LandingScreen;
const _IntroScreen      = window.IntroScreen;
const _TransitionScreen = window.TransitionScreen;
const _Room2TransitionScreen = window.Room2TransitionScreen;
const _BriefingScreen   = window.BriefingScreen;
const _SceneCardScreen  = window.SceneCardScreen;
const _ResearchScreen   = window.ResearchScreen;
const _HypothesisScreen = window.HypothesisScreen;
const _PersonaSelectScreen = window.PersonaSelectScreen;
const _OutreachScreen   = window.OutreachScreen;
const _ColdCallScreen   = window.ColdCallScreen;
const _Room1CompleteScreen = window.Room1CompleteScreen;
const _PreCallScreen    = window.PreCallScreen;
const _ContactReviewScreen = window.ContactReviewScreen;
const _DiscoveryScreen  = window.DiscoveryScreen;
const _ClosingScreen    = window.ClosingScreen;
const _SolutionScreen   = window.SolutionScreen;
const _VaultScreen      = window.VaultScreen;

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp, useCallback: useCallbackApp, useRef: useRefApp } = React;

const STORAGE_KEY = "case-file-state";

const INITIAL = {
  screen: "landing",
  teamId: "",
  playId: "",
  // research
  researchNotes: "",
  agentLog: [],
  // hypothesis
  hypothesis: "",
  hypothesisEval: null,
  // persona
  targetPersona: null,
  // outreach
  outreachChannel: "email",
  outreachSubject: "",
  outreachBody: "",
  outreachEval: null,
  coldCallPersonaId: null,
  // cold call
  coldCallTranscript: [],
  coldCallScore: null,
  // room 2
  precallPlan: "",
  precallEval: null,
  discoveryPersonaId: null,
  discoveryTranscript: [],
  discoveryScore: null,
  solution: "",
  solutionEval: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    return { ...INITIAL, ...JSON.parse(raw) };
  } catch (e) {
    return INITIAL;
  }
}

function App() {
  const [state, setState] = useStateApp(loadState);
  const [stepSeconds, setStepSeconds] = useStateApp(null);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // URL admin flag
  const isAdmin = useMemoApp(() => new URLSearchParams(location.search).get("admin") === "true", []);
  // Also enable via tweaks
  const showSkip = isAdmin;

  // Persist
  useEffectApp(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
    // Emit telemetry for the admin dashboard (localStorage feed + BroadcastChannel).
    // This is the single swap-point for a real backend later.
    try {
      if (state.teamId && window.HEIST_DATA.summarizeTeam) {
        const rec = window.HEIST_DATA.summarizeTeam(state);
        if (rec) {
          rec.startedAt = state.startedAt || rec.updated;
          const FEED = "cf-teams";
          let feed = {};
          try { feed = JSON.parse(localStorage.getItem(FEED) || "{}"); } catch (e) {}
          feed[rec.teamId] = rec;
          localStorage.setItem(FEED, JSON.stringify(feed));
          try { new BroadcastChannel("cf-admin").postMessage({ type: "team", rec }); } catch (e) {}
        }
      }
    } catch (e) {}
  }, [state]);

  // Navigate
  const nav = useCallbackApp((screen, updates = {}) => {
    setState(s => ({ ...s, ...updates, screen }));
    setStepSeconds(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Room clock — accumulates time spent in active rooms
  const inRoom1 = state.screen.startsWith("room1");
  const inRoom2 = state.screen.startsWith("room2");
  const showRoomClock = inRoom1 || inRoom2;
  const roomKey = inRoom1 ? "room1ClockStart" : inRoom2 ? "room2ClockStart" : null;

  useEffectApp(() => {
    if (roomKey && !state[roomKey]) {
      setState(s => ({ ...s, [roomKey]: Date.now() }));
    }
  }, [roomKey]);

  const [now, setNow] = useStateApp(Date.now());
  useEffectApp(() => {
    if (!showRoomClock) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [showRoomClock]);

  // Elapsed case time (counts up — no limit)
  const roomElapsed = useMemoApp(() => {
    if (!showRoomClock || !roomKey || !state[roomKey]) return null;
    return Math.max(0, Math.floor((now - state[roomKey]) / 1000));
  }, [showRoomClock, roomKey, state, now]);

  // Admin skip — advance to next state with sensible defaults
  const adminSkip = () => {
    const SC = window.HEIST_DATA.SCREENS;
    const idx = SC.indexOf(state.screen);
    const nextScreen = SC[Math.min(idx + 1, SC.length - 1)];
    // sensible default state to make next screen renderable
    const defaults = {
      teamId: state.teamId || "ADMIN",
      researchNotes: state.researchNotes || "earnings call mentioned data fabric; 3 CRMs being consolidated; new RevOps Director role posted; CFO worried about forecast accuracy.",
      hypothesis: state.hypothesis || "Acme is consolidating their GTM data stack after the recent reorg under the new CRO. The CFO's earnings call comments on the data fabric and decelerating CAC suggest forecast accuracy is the board-level pressure. They'll need to unify three CRM systems and they're hiring for the work — Director of Revenue Analytics req is open. The pain that pays is forecast credibility, not tool consolidation.",
      hypothesisEval: state.hypothesisEval || { tier: "strong", feedback: "Strong hypothesis — cites specific evidence and ties to a board-level KPI.", coach: "Push on what 'forecast credibility' means in dollars next." },
      targetPersona: state.targetPersona || "morgan",
      outreachChannel: state.outreachChannel || "email",
      outreachSubject: state.outreachSubject || "your data fabric comment",
      outreachBody: state.outreachBody || "Morgan — your CFO's earnings comment about 'unifying the go-to-market data fabric' caught my eye. We've helped two mid-market SaaS CROs in your spot pull forecast accuracy from the 60s into the 80s in two quarters — without consolidating CRMs first. Worth 15 min next week to compare notes? — Alex",
      outreachEval: state.outreachEval || { tier: "strong", outcome: "accepted", feedback: "Specific, brief, no clichés.", coach: "Nice opening hook.", replyText: "Tuesday 3pm works. Send the invite. — Morgan", delegateTo: null },
      coldCallPersonaId: state.coldCallPersonaId || state.targetPersona || "morgan",
      coldCallScore: state.coldCallScore || { implication: 70, champion: 60, economicBuyer: 50, quality: 70, meetingEarned: true, summary: "Strong cold call — earned the meeting." },
      precallPlan: state.precallPlan || "Test the hypothesis that forecast credibility is the real board pressure. Open with implication questions on the cost of forecast misses. Then probe what they've already tried internally.",
      precallEval: state.precallEval || { tier: "strong", feedback: "Tight plan with clear implication focus.", coach: "Have a fallback if Morgan delegates to Priya." },
      discoveryPersonaId: state.discoveryPersonaId || state.coldCallPersonaId || "morgan",
      discoveryScore: state.discoveryScore || { implication: 80, champion: 70, economicBuyer: 60, quality: 75, meetingEarned: true, summary: "Earned trust to L2, briefly L3." },
      solution: state.solution || "Recommend a 6-week paid pilot focused on the forecast accuracy KPI before touching the CRM consolidation. Specific scope: integrate with your existing pipeline data and validate forecast lift. Next step: 30-min working session with Priya to scope.",
      solutionEval: state.solutionEval || { tier: "strong", feedback: "Pilot-shaped, scoped to the board pressure, not the tooling.", coach: "Consider committing a number for forecast lift improvement." },
    };
    setState(s => ({ ...s, ...defaults, screen: nextScreen }));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Render the active screen
  let screenEl = null;
  switch (state.screen) {
    case "landing":          screenEl = <_LandingScreen state={state} nav={nav} />; break;
    case "intro":            screenEl = <_IntroScreen state={state} nav={nav} />; break;
    case "transition":       screenEl = <_TransitionScreen state={state} nav={nav} />; break;
    case "briefing":         screenEl = <_BriefingScreen state={state} nav={nav} />; break;
    case "scene-1":          screenEl = <_SceneCardScreen state={state} nav={nav} sceneKey="scene-1" next="room1-research" />; break;
    case "room1-research":   screenEl = <_ResearchScreen state={state} nav={nav} setStepTimerSeconds={setStepSeconds} />; break;
    case "room1-hypothesis": screenEl = <_HypothesisScreen state={state} nav={nav} setStepTimerSeconds={setStepSeconds} />; break;
    case "room1-persona":    screenEl = <_PersonaSelectScreen state={state} nav={nav} />; break;
    case "room1-outreach":   screenEl = <_OutreachScreen state={state} nav={nav} />; break;
    case "room1-coldcall":   screenEl = <_ColdCallScreen state={state} nav={nav} difficulty={tweaks.difficulty} />; break;
    case "room1-complete":   screenEl = <_Room1CompleteScreen state={state} nav={nav} />; break;
    case "room2-transition": screenEl = <_Room2TransitionScreen state={state} nav={nav} />; break;
    case "scene-2":          screenEl = <_SceneCardScreen state={state} nav={nav} sceneKey="scene-2" next="room2-contact" />; break;
    case "room2-contact":    screenEl = <_ContactReviewScreen state={state} nav={nav} />; break;
    case "room2-precall":    screenEl = <_PreCallScreen state={state} nav={nav} setStepTimerSeconds={setStepSeconds} />; break;
    case "room2-discovery":  screenEl = <_DiscoveryScreen state={state} nav={nav} difficulty={tweaks.difficulty} />; break;
    case "room2-closing":    screenEl = <_ClosingScreen state={state} nav={nav} />; break;
    case "room2-solution":   screenEl = <_SolutionScreen state={state} nav={nav} />; break;
    case "vault":            screenEl = <_VaultScreen state={state} nav={nav} />; break;
    default:                 screenEl = <_LandingScreen state={state} nav={nav} />;
  }

  // Hide topbar/clock for full-bleed cinematic screens
  const fullBleed = ["landing", "briefing", "room1-research", "room1-persona", "room1-outreach", "room1-coldcall", "room2-precall", "room2-solution", "intro", "transition", "room2-transition", "scene-1", "scene-2"].includes(state.screen);

  return (
    <>
      {!fullBleed && <_TopBar state={state} screen={state.screen} />}
      {showRoomClock && !fullBleed && (
        <_RoomClock seconds={roomElapsed} label={inRoom1 ? "// Phase 01 · case open" : "// Discovery · case open"} />
      )}
      <main className="main">
        {screenEl}
      </main>

      <TweaksPanel>
        <TweakSection label="Simulation" />
        <TweakRadio
          label="Persona difficulty"
          value={tweaks.difficulty}
          options={["easy", "hard"]}
          onChange={(v) => setTweak("difficulty", v)}
        />
        <div className="twk-row" style={{ fontSize: 11, color: "rgba(41,38,27,.5)", lineHeight: 1.4, marginTop: 4 }}>
          Easy: personas advance trust faster, share more readily.<br/>
          Hard: short, guarded answers; clichés punished.
        </div>

        <TweakSection label="Navigation" />
        <TweakSelect
          label="Jump to screen"
          value={state.screen}
          options={window.HEIST_DATA.SCREENS.map(s => ({
            value: s,
            label: (window.HEIST_DATA.SCREEN_LABELS[s] || {}).label || s,
          }))}
          onChange={(v) => {
            // Make sure required state exists for the target screen
            const stub = {
              teamId: state.teamId || "TWEAK",
              targetPersona: state.targetPersona || "morgan",
              coldCallPersonaId: state.coldCallPersonaId || state.targetPersona || "morgan",
              discoveryPersonaId: state.discoveryPersonaId || state.coldCallPersonaId || "morgan",
              hypothesisEval: state.hypothesisEval || { tier: "developing", feedback: "(jumped)", coach: "" },
              outreachEval: state.outreachEval || { tier: "developing", outcome: "delegated", feedback: "(jumped)", coach: "", replyText: "I'm not the right person for this — looping in Priya. — Morgan", delegateTo: "director" },
              coldCallScore: state.coldCallScore || { implication: 50, champion: 50, economicBuyer: 50, quality: 50, meetingEarned: true, summary: "(jumped via tweak)" },
              precallEval: state.precallEval || { tier: "developing", feedback: "(jumped)", coach: "" },
              discoveryScore: state.discoveryScore || { implication: 60, champion: 60, economicBuyer: 50, quality: 60, meetingEarned: true, summary: "(jumped)" },
              solutionEval: state.solutionEval || { tier: "developing", feedback: "(jumped)", coach: "" },
            };
            setState(s => ({ ...s, ...stub, screen: v }));
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />

        <TweakButton
          label="Reset session"
          onClick={() => {
            if (confirm("Wipe everything and restart?")) {
              localStorage.removeItem(STORAGE_KEY);
              location.reload();
            }
          }}
        >
          Reset session
        </TweakButton>
      </TweaksPanel>

      {showSkip && (
        <div className="admin-skip">
          <button className="btn" onClick={adminSkip}>SKIP →</button>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
