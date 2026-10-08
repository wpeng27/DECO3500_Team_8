# Icebreaker UNO — shared-screen prototype

A conversation companion for a physical UNO game. Up to four players gather around one screen; each person chooses a corner, draws optional icebreaker questions, and plays with real UNO cards. This is not an online UNO simulator.

## Live prototype

**[Open Icebreaker UNO V5.5](https://icebreaker-uno-v55-shared-screen-helen.summer-lake-0dc2.workers.dev/)**

The prototype is hosted on Cloudflare Workers. Share this link to let someone open the app, or open it on the shared table screen. Each browser runs its own game state: opening the link on another device does not join or sync with the first screen.

## Play

1. Open the prototype and select **Got it, let's start**.
2. Choose any of the four corner seats. Enter an email and preferred name, or continue as a Guest. The email is not displayed.
3. Select **Draw a question** in your seat. Choose an answer if you want to; answering is optional. **Draw another** replaces the question.
4. When two seated players' latest answers are in the same category (games, sport, music and art, or food), their seats briefly flash with a **Same choice** banner.
5. Use the centre circle to pause or resume the real-card game, or switch to a random rule: **Normal UNO**, **Hidden cards**, **Optional questions**, **Give a card**, or **Swap cards**.
6. Select **Rules** at the top right to return to the introduction. Seats remain while you stay in the page.

### Optional quiet detector

Select the microphone button in the centre circle and allow microphone access. The detector measures loudness in the browser; it does not record, save, or send audio. It calibrates background noise for about five seconds, then suggests drawing a question after roughly 25 seconds of quiet (12 seconds while paused). Drawing a question or selecting **Not now** dismisses the prompt. The detector requires HTTPS or `localhost`.

## Run locally

Requirements: Node.js 22.13 or later and npm. In Windows PowerShell, from this project folder, run:

```powershell
npm.cmd run install:ci
npm.cmd run dev
```

Open the **Local** URL printed by the dev server (normally `http://localhost:5173/`). Keep the server running while using it. `localhost` is only reachable from the computer running the server; other devices on the same network can use the printed **Network** URL. Network access may require allowing Node.js through the firewall. The microphone feature requires HTTPS or `localhost`, so it may not work at a plain HTTP network URL.

Other useful commands:

```powershell
npm.cmd run build
npm.cmd run lint
```

The build creates the production output; it does not start a server. For local Cloudflare Worker preview, build first, then run `npm.cmd run start`.

Keep the project in a short folder path on Windows. Very long paths can cause dependency installation errors such as `esbuild.exe ENOENT`. If the seats do not fit on a smaller display, zoom out with `Ctrl` + `-` or use full screen with `F11`.

## Prototype scope and data

- Seats, names, email addresses, questions, answers, and game controls are held in the current browser page's memory. Refreshing or opening the link in another browser starts a separate game.
- The sign-in form is only a local seat label; it does not verify an email or create an account.
- The question bank contains three questions, defined in `lib/game.ts`.
- The repository includes an earlier game API and D1 database schema, but this shared-screen page does not use them to synchronize players or save its state.
- The quiet detector processes microphone loudness locally in the browser. No audio is recorded or transmitted.

## Project files

| File | Purpose |
|---|---|
| `app/page.tsx` | Shared-screen interface, seats, questions, rules, and answer-match effects |
| `app/globals.css` | Application styles and responsive layout |
| `hooks/use-ambient-silence.ts` | Browser-only quiet detector |
| `lib/game.ts` | Question bank, interest categories, rules, and legacy game logic |
| `app/api/game/route.ts` | Earlier session API; not used by the current shared-screen page |
| `vite.config.ts` | Vite, Vinext, and Cloudflare Workers configuration |
| `package.json` | Dependencies and project commands |
