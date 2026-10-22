# Icebreaker UNO

A five-player, multi-device companion for a physical UNO icebreaker. It supports a public table dashboard, a private player view, and a facilitator control view.

## Live prototype and usage

**Open the prototype:** this version is no longer online, because the original link (https://uno-alliance.xuemingw520.chatgpt.site/) now opens the final version. Run it locally using [Local development](#local-development).

This is a companion for a physical card game, not an online UNO card simulator.

### What you need

- One computer for the facilitator and public dashboard
- Five player phones, with Internet access on all devices
- A physical UNO deck

### How to play

1. The facilitator opens the website, chooses **Random assignment** or **Player-selected teams**, selects a duration, and creates a session.
2. Players open the same website on their phones and enter the displayed game code. Each registers a name and email, with optional consent for follow-up contact.
3. When all five players have joined, the facilitator starts the game. Players keep their individual alliance screens private. The facilitator can open the public dashboard for the table.
4. Play with the physical cards. The facilitator manually records completed rounds, updates both leaders' remaining card counts, and changes turn direction when needed.
5. Every three completed rounds, the rule-change button becomes available. Activating it selects a temporary rule and privately changes one non-leader's alliance.
6. A leader reaching zero cards wins immediately. At timeout, a difference of **0-2 cards** produces a shared victory; a difference of **3 or more** means the leader with fewer cards wins.
7. Results appear on the facilitator, public, and player views. Players can stay or leave, post game notes, and use the available replay and private-message options.

**Do not share the private facilitator URL containing `?key=...`, or a player's URL containing their token. Share only the main website URL and game code.**

## Core flow

1. The facilitator creates a session and displays its six-character game code.
2. Five players open the same website on their phones, enter the game code, register a display name and email, then receive a private red or blue alliance.
3. The system locks one public leader per alliance when play starts.
4. The facilitator records rounds, leader card counts, turn direction, and rule changes.
5. Every three rounds, a random dynamic rule is activated and one non-leader privately changes alliance.
6. A leader reaching zero cards wins immediately. At timeout, a card-count difference below three produces a shared victory.

## Privacy model

- Leader names, colours, and card counts appear on the public board.
- Non-leader alliance assignments appear only on each player's private tokenised page.
- Email addresses never appear on the public board. Consented emails become visible only to the host after the game.
- The current implementation is a research proof of concept, not a production identity or matchmaking service.

## Views

- `/` — create a session or join with a code
- `/host/[session]` — facilitator controls and the shared game code
- `/board/[session]` — public shared display
- `/join/[session]` — private player registration
- `/player/[session]` — private alliance and change notifications

## Data

Cloudflare D1 stores sessions, players, private tokens, consent, rules, and event state. The UI polls the session endpoint so multiple phones and the shared dashboard remain synchronised.

## Source structure

- `app/` - pages and session API routes
- `components/` - shared game interface and UI components
- `hooks/` - client-side session polling
- `lib/` - game rules, types, and session logic
- `db/` and `drizzle/` - database definitions and SQL migrations
- `public/` - static assets
- `build/`, `scripts/`, and configuration files - build/runtime tooling

## Local development

Use Node.js **22.13.0 or newer** and a Cloudflare Workers-compatible operating system. Older macOS versions may not support the bundled local Workers runtime; use the hosted prototype if local startup fails.

```bash
npm ci
npm run build
```

The database tables must be initialised before creating local game sessions. After a build, apply both migrations to the local database:

```bash
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_mature_hellion.sql
npx wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_eager_jetstream.sql
npm start
```

Open the local URL printed by the server. For multi-phone testing, all devices must reach the same server; a phone's `localhost` is not the facilitator's computer. The hosted prototype is the simplest multi-device demo.

## GitHub source snapshot

This folder contains the source snapshot prepared on **17 September 2026**, including the updated team-assignment labels. Dependencies, generated builds, local databases, user records, private host/player links, Git history, and checkout-local tool state are excluded. The hosting manifest retains only logical bindings, not the original site's project identifier.

Uploading this source to GitHub does **not** redeploy the existing website or copy its live game data. GitHub Pages alone cannot run this server-backed application; a separate deployment requires a Workers-compatible server and a D1 database with the included migrations.
