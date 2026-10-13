# Icebreaker UNO

A shared-screen icebreaker for up to four players. Everyone sits around one screen and plays UNO with real cards. The screen shows each player's seat, the questions players draw after action cards, a 10-minute countdown and the current extra rule.

## How it works

1. **Rules screen.** Opening the app shows a short explanation of how the game works. Choose **Got it, let's start** to continue. This also starts the 10-minute countdown. If players reopen the rules mid-game, the button reads **Back to the game** and the countdown keeps running.
2. **The table.** The screen is split into four corners, one seat per player, with a circle in the middle for the whole table.
   - The two top seats are rotated 180° so that players sitting on the far side of the screen can read them.
3. **Take a seat.** Each empty corner has two choices:
   - **Sign in**: enter an email and a preferred name.
   - **Continue as Guest**: sit down without sharing anything.

   The email is not shown on screen. A seated player can leave with the button next to their name.
4. **Draw a question after each action card.** Every card except a number card is an action card: Skip, Reverse, Draw Two, Wild and Wild Draw Four. Whoever played it presses **Played an action card? Draw a question** in their own corner, which shows a question from the question bank. The question is chosen so that pairs of players end up with answers to compare: it is one this player has not answered yet, preferring the questions the most other seated players have already answered (ties are broken at random). Once a player has answered every question, any question can come up again. The same player then either:
   - choose an option and press **Submit answer** (the selection can be changed before submitting), or
   - press **Skip question** (or the × button) to close it without answering. A skipped question does not affect colours or scores.

   A drawn question cannot be swapped for another one.
5. **Progressive colour matching.** Each seat starts with a different colour. When two players submit the same answer to the same question, their panels flash and both colours move toward one another. Repeated matching evidence brings the colours closer; different answers keep them more distinct.
   - Colour is recalculated from the accumulated answer history, not only the latest answer.
   - A match is compared only when both players have answered the same question.
6. **End of the game.** The game ends when the countdown reaches 0:00, or when a player has played all their cards and someone presses **Player out of cards**, whichever happens first. The question controls in every occupied corner are then replaced by a result panel comparing the player with every other seated player. What each row shows depends on how many questions the two people both answered:
   - **0 shared questions:** a dash and "No shared question yet".
   - **1 shared question:** no percentage. The row shows the question's topic and both answers ("You both chose …" or "You chose …; Alex chose …") with a **Same** or **Different** label. One question only gives 0% or 100%, and with four options two people match 25% of the time by chance, so a percentage would mislead.
   - **2 or more shared questions:** a percentage and "Based on N shared questions". The percentage is `(same answers + 1) / (shared questions + 2)`, so every pair starts at 50% and moves towards the real share of matches as more questions are shared: 2 of 2 the same is 75%, 0 of 2 is 25%, 10 of 10 is 92%.
   - **Overall match** pools the player's shared questions with everyone and uses the same rule: a percentage once there are 2 or more in total, otherwise a dash.
   - **Play again** clears answers, colours and the question count, resets the rule to Normal UNO and restarts the countdown, but keeps the occupied seats.
7. **The centre circle** shows whether the game is playing or paused, the time left, the current extra rule, and how many questions the table has answered and skipped.
   - **Pause / Resume** pauses the game and the countdown for a chat.
   - **Automatic rule change:** the table shares one count of drawn questions, answered or skipped. After every third, the extra rule switches to a different random one (Hidden cards, Optional questions, Give a card, Swap cards, or Normal UNO).
8. The **Rules** button in the top right returns to the rules screen. Seats, answers and the countdown are kept.

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
- The question bank has ten questions about study habits and teamwork (`QUESTIONS` in `lib/game.ts`, also listed in `Design/Icebreaker_UNO_Question_Bank.md`).
- The screen cannot see the physical cards. Players press the buttons themselves after an action card and when someone runs out of cards.
- Percentages represent answer similarity within this short activity. They are not a personality test or proof of long-term group compatibility.
- The server API and database from the earlier version (`app/api/game/route.ts`, `db/`, `drizzle/`) are still in the project, but the current page does not use them.

## Key files

| File | What it contains |
|---|---|
| `app/page.tsx` | The whole app: four seats, answer histories, colour convergence, pairwise percentages and the result state |
| `app/globals.css` | Styles. The newer styles are at the end of the file |
| `lib/game.ts` | The question bank (`QUESTIONS`) and rule names (`RULES`) |
| `backup/` | The earlier version's page (Host, Shared screen and Player views), kept for reference |
