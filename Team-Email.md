**Subject: Cold Case is live — try the sales-training game (5 min)**

Hi team,

I built a browser-based sales-training simulation called **Cold Case**. You play a Dynatrace rep working a cold opportunity into Meridian Capital Group — research the account, pick the right persona, write outreach, and run a timed cold call. An AI scores your work at each step and gives you Socratic feedback (it gets sassy if you phone it in).

**Just want to play? Open the link — that's it:**
👉 **https://cold-case-production.up.railway.app**

No install, no login, no API key. It's live 24/7. Best on desktop with sound on (there are short video transitions).

**How it plays:** sign in → account briefing → investigate (LinkedIn, SFDC record, earnings, news) → form a pain hypothesis → write outreach to a persona → run the 8-minute cold call → get your Findings (Bronze/Silver/Gold/Platinum based on who you reached, what you uncovered, and how you solutioned).

---

**If you want the files** (to run it yourself or re-skin it for another account), here's what's attached:

- **Cold-Case-Game.zip** — the full project source. Run it locally with one command if you have Java + Maven and your own Anthropic API key. *Note: my API key is NOT in the zip — you create your own (instructions inside).*
- **SETUP.md** *(inside the zip)* — step-by-step run instructions and deploy notes.
- **Re-templating-Cold-Case.pptx** — how to swap the game to a different company/account. Short version: it's an engine + a scenario pack; you re-skin one data file plus a few assets and leave the machinery alone.
- **How-Cold-Case-Works.pptx** — the architecture overview (how Claude, GitHub, Supabase, Railway, and the backend fit together).

**One thing to know:** every play of the live game spends a little of my Anthropic API credit, since it routes through my key on the server. Go ahead and use it — just flagging so nobody's surprised if I ask people to pace heavy testing.

Try it and send me your score + any feedback. Curious where people land on the first run.

Thanks,
Pat
