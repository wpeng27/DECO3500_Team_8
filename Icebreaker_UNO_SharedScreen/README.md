# Icebreaker UNO

A shared-screen icebreaker for up to four players. Everyone sits around one screen and plays UNO with real cards. The screen shows each player's seat, an optional question for each player, and the current rule.

## How it works

1. **Rules screen.** Opening the app shows a short explanation of how the game works. Choose **Got it, let's start** to continue.
2. **The table.** The screen is split into four corners, one seat per player, with a circle in the middle for the whole table.
   - The two top seats are rotated 180° so that players sitting on the far side of the screen can read them.
3. **Take a seat.** Each empty corner has two choices:
   - **Sign in**: enter an email and a preferred name.
   - **Continue as Guest**: sit down without sharing anything.

   The email is not shown on screen. A seated player can leave with the button next to their name.
4. **Draw a question.** Each seated player has a **Draw a question** button. It shows a random question from the question bank in that player's corner. **Draw another** shows a different question. Answering is optional.
5. **Same choice flash.** Players answer by choosing an option. If a player's answer is in the same interest category as another seated player's latest answer, those players' panels flash together for about 3.6 seconds, with a "Same choice" banner.
   - Each option belongs to one category: games, sport, music/art or food. Players can match even when they drew different questions.
6. **The centre circle** shows whether the game is playing or paused, and the current rule.
   - **Pause / Resume** pauses the game for a chat.
   - **Random rule** switches to a different rule (Hidden cards, Optional questions, Give a card, Swap cards, or Normal UNO).
7. The **Rules** button in the top right returns to the rules screen. Seats are kept.

## Run locally

Use Node.js 22.13 or later and npm. In the project folder, run:

```sh
npm run install:ci
npm run build
npm run dev
```

Then open http://localhost:5173/. If port 5173 is already in use, run `npm run dev -- --port 5174` and open that port instead.

**Windows:** keep the project in a short path, such as `D:\projects\icebreaker-uno-source`. If the path is very long, `npm run install:ci` can fail with an `esbuild.exe ENOENT` error.

**Small screens:** if the bottom seats do not fit, zoom the browser out (`Ctrl` + `-`) or use full screen (`F11`).

## Prototype limits

- All seats, sign-ins and answers live only in the open browser page. Refreshing the page clears them. Nothing is sent to a server.
- The sign-in form does not verify the email or create an account.
- The question bank has three questions (`QUESTIONS` in `lib/game.ts`).
- The server API and database from the earlier version (`app/api/game/route.ts`, `db/`, `drizzle/`) are still in the project, but the current page does not use them.

## Key files

| File | What it contains |
|---|---|
| `app/page.tsx` | The whole app: rules screen, four seats, centre circle, questions and the same-choice flash |
| `app/globals.css` | Styles. The newer styles are at the end of the file |
| `lib/game.ts` | The question bank (`QUESTIONS`) and rule names (`RULES`) |
| `backup/` | The earlier version's page (Host, Shared screen and Player views), kept for reference |
