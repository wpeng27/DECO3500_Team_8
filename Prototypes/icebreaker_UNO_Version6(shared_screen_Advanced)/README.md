# Icebreaker UNO

A shared-screen icebreaker for up to four players, with optional mobile player screens on the same network. Everyone plays UNO with real cards. The PC shows the table, countdown and extra rule; phones can switch between seated players, show their live colours, and draw, answer or skip questions.

## How it works

1. **Rules screen.** Opening the app shows all eight rules in a compact four-column overview on desktop, with the email notice and **Got it, let's start** button below. Narrow screens use fewer columns to keep the text readable. Choose **Got it, let's start** to open the table. This does not start the countdown. During the game, the **Rules** button in the top right opens the same rules over the table (see step 9).
2. **The table.** The screen is split into four corners, one seat per player, with a circle in the middle for the whole table.
   - The two top seats are rotated 180° so that players sitting on the far side of the screen can read them.
3. **Take a seat.** Each empty corner has two choices:
   - **Sign in**: enter an email and a preferred name.
   - **Continue as Guest**: sit down without sharing anything.

   The email is not shown on screen and is used only for the current game session. The rules screen and the sign-in form both say so. A seated player can leave with the button next to their name. Leaving clears that player's answers, so the button needs a second press: the first press turns it red and shows "Press the red button again to leave. Your answers will be cleared." under the player's name, and clicking anywhere else cancels.

   Each seat has a thick border in its own colour. The border never changes, so seats stay easy to tell apart even after the inside colours blend (see step 5).
4. **Start the game.** Once at least two players are seated, press **Start game** in the centre circle. This starts the 10-minute countdown. Until then the circle shows **Ready** and 10:00, and the corners show "Questions start when the game starts" instead of the draw button.
5. **Draw a question after each action card.** Every card except a number card is an action card: Skip, Reverse, Draw Two, Wild and Wild Draw Four. Whoever played it presses **Played an action card? Draw a question** in their own corner, which shows a question from the question bank. The question is chosen so that pairs of players end up with answers to compare: it is one this player has not answered yet, preferring the questions the most other seated players have already answered (ties are broken at random). Answered questions are never drawn again, so an answer cannot be changed later. Once a player has answered every question, their corner says "You have answered every question" instead of showing the draw button. Draw only after playing an action card (or when picked under the Pick a player rule); the screen cannot see the cards, so the players keep each other honest. While the game is paused the draw button is hidden, but a question that is already open can still be answered or skipped. The same player then either:
   - choose an option and press **Submit answer** (the selection can be changed before submitting), or
   - press **Skip question** (or the × button) to close it without answering. A skipped question does not affect colours or scores.

   A drawn question cannot be swapped for another one.
6. **Progressive colour matching.** Each seat starts with a different colour. When two players' answers to the same question match, their panels flash and the inside colours of both corners move toward one another; the borders keep each seat's original colour. Repeated matches bring the colours closer; non-matching answers keep them more distinct.
   - Answers match when they are the same, except on the **Preferred role** question ("which task would you happily pick up first?"). That question is marked `complementary` in `lib/game.ts`: there, **different** answers match, because a team needs people who take on different tasks. The flash then reads "Complementary roles".
   - Colour is recalculated from the accumulated answer history, not only the latest answer.
   - A match is compared only when both players have answered the same question.
7. **End of the game.** The game ends when the countdown reaches 0:00, or when a player has played all their cards and someone presses **Player out of cards**, whichever happens first. **Player out of cards** works at any time during the game, even if only one player is still seated. The question controls in every occupied corner are then replaced by a result panel comparing the player with every other seated player. What each row shows depends on how many questions the two people both answered:
   - **0 shared questions:** a dash and "No shared question yet".
   - **1 shared question:** no percentage. The row shows the question's topic and both answers ("You both chose …" or "You chose …; Alex chose …") with a **Same** or **Different** label (on the Preferred role question: **Complementary** when the answers differ, **Same role** when they are the same). One question only gives 0% or 100%, and with four options two people match 25% of the time by chance, so a percentage would mislead.
   - **2 or more shared questions:** a percentage and "Based on N shared questions". The percentage is `(matching answers + 1) / (shared questions + 2)`, so every pair starts at 50% and moves towards the real share of matches as more questions are shared: 2 of 2 the same is 75%, 0 of 2 is 25%, 10 of 10 is 92%.
   - **Overall match** pools the player's shared questions with everyone and uses the same rule: a percentage once there are 2 or more in total, otherwise a dash.
   - **Play again** clears answers, colours and the question count, resets the rule to Normal UNO and resets the countdown to 10:00, but keeps the occupied seats. Press **Start game** again to begin the next round.
8. **The centre circle** shows whether the game is ready, playing or paused, the time left, the current extra rule, and how many questions the table has answered and skipped.
   - **Pause / Resume** pauses the game and the countdown for a chat. While paused, the circle turns amber with a pulsing ring.
   - **Countdown:** counts down to a fixed end time rather than ticking once a second, so it stays correct even if the browser slows the page down in the background. During play the app asks the browser to keep the screen awake (Screen Wake Lock, supported in Chrome and Edge), so the laptop does not dim or sleep while nobody is touching it.
   - **Leaving the page:** while a game is running, refreshing or closing the page asks for confirmation first, because the game would be lost.
   - **Automatic rule change:** the circle counts answered and skipped questions, but only answers move the rule on. After every third answer, the extra rule switches to a different random one. Skips do not count, so nobody can draw and skip three times to get rid of a rule they dislike. For 4 seconds the screen shows the change clearly: a brief flash over the whole table, a **Rule changed: …** banner above the circle (rotated for the far side of the table) and below it, and a glowing circle with a **Rule changed** label.
   - The extra rules are:
     - **Normal UNO:** standard UNO rules.
     - **Hidden cards:** hold your cards facing out so you cannot see them; the other players help you choose what to play.
     - **Pick a player:** on your turn, pick another player to draw a question in their corner and answer it. Nobody has to make up a question.
     - **Give a card:** on your turn, you may give one of your cards to another player, then draw one card from the deck. Drawing a card keeps your hand size the same, so giving cards away is not a shortcut to winning.
     - **Swap cards:** on your turn, you may swap one card with another player if that player agrees.
9. The **Rules** button in the top right opens the rules over the table. Close it with **Back to the game**, the Escape key or a click outside. Everything underneath stays as it was, including open questions and half-filled sign-in forms, and the countdown keeps running.

## Run locally

Use Node.js 22.13 or later and npm. In the project folder, run:

```sh
npm run install:ci
npm run build
npm run db:migrate:local
npm run dev
```

Then open http://localhost:5173/. If port 5173 is already in use, run `npm run dev -- --port 5174` and open that port instead.

`db:migrate:local` creates the mobile connection table in the local D1 database. It is safe to run again and does not change the older game table. Run it after the first build, before using mobile screens. For a built local server, use `npm start -- --port 5173` after building and migrating; both server modes listen on the local network.

## Connect mobile screens

1. Connect the PC and phones to the same Wi-Fi/LAN. Open the game on the PC and continue past the rules screen. Players can take their seats from their own phones.
2. On the PC, click **Mobile screens** in the header. This creates a separate connection for this table; another PC browser tab gets its own link.
3. Replace `localhost` in **PC network address** with the PC's LAN IPv4 address (for example `192.168.1.25`). Find it with `ipconfig` in PowerShell under the active Wi-Fi/Ethernet adapter, or in the dev server's printed **Network** URL.
4. Copy the generated link and open it in the phone's browser. It looks like `http://192.168.1.25:5173/mobile?room=...`. The room part is required. No installation is needed.
5. Choose a free coloured seat on the phone. Enter a preferred name and email and press **Sign in**, or press **Continue as Guest** without entering details. The player appears on the PC automatically and the phone selects the joined seat. **Join this table** reopens the form when more seats are free. Simultaneous claims cannot overwrite an occupied seat; choose another free seat if someone gets there first.
6. Each occupied seat appears as a player button. Switch between them to show that player's current colour and question controls. The shared table supports four seats; two seated players produce two player buttons and four produce four. Free seats are listed separately in the sign-in form.
7. Start the game on the PC once at least two players are seated. Draw, answer or skip on either screen. An open question is shared between devices; repeated submissions are handled once. Colour changes, pause/resume, players leaving, game end and new rounds update automatically (normally within about 1–2 seconds).

The mobile panel uses the same colour blend as the PC corner, with the original seat colour around its border. Phones can control any player through the tabs. Sign-in and guest seating work on either device, including during play or a pause. Game start/pause/end, leaving seats and results remain on the PC. New players wait until the next round if the game has finished.

**Match alerts:** tap **Enable sound & vibration** on each phone once. It plays a short test chime and vibrates where supported. When the selected player is involved in a new answer match (including complementary roles), the phone plays the chime, gives two short vibrations and shows a match message with a gentle border pulse. Both matching players' phones can receive the alert, even when the answer was submitted on the PC. **Mute alerts** turns off sound and vibration; the visual message remains. **Test alerts** lets you check the volume or resume sound after the browser suspends it.

Keep the mobile page visible for alerts. Old matches do not replay on refresh, reconnection or switching player buttons. Vibration depends on the browser/device (supported by Chrome on Android, not Safari on iPhone); sound also depends on the phone's volume, silent settings and browser audio restrictions. The visual message works without sound or vibration, and the pulse respects reduced-motion preferences.

Keep the PC game tab and server open and the PC awake. A phone refresh reconnects to the same link; refreshing the PC resets the game, so create a new mobile link afterwards. A disconnected phone keeps the last colour visible, shows a connection message and disables question controls until reconnected. Delivery retries use the same request ID to avoid duplicate answers.

If the phone cannot connect, use the PC address rather than `localhost`, allow Node.js through Windows Firewall on your **private** network, and check that guest Wi-Fi/client isolation is not blocking devices from reaching each other. You do not need router port forwarding. Anyone with the mobile link can view and control its players; use it with your game group.

Mobile connection data expires after 12 hours without a PC update and is cleaned up when a new connection is created. It is not a saved game: the PC browser remains responsible for the current game state.

For development checks, run `npm run test:mobile` for question-action rules. With the local server running, `node scripts/check-mobile.mjs http://localhost:5173` tests isolated synthetic rooms, simultaneous submissions, retries, validation and disconnect recovery.

**Windows:** keep the project in a short path, such as `D:\projects\icebreaker-uno-source`. If the path is very long, `npm run install:ci` can fail with an `esbuild.exe ENOENT` error.

**Shared-screen layout:** above 600px wide, the table fits the browser window and keeps the four corners the same size when questions open. Question cards use the space below the player details, with text and spacing adapting to the corner height. If a question still needs more room, scroll inside its question-and-answer area; Submit and Skip stay visible. Narrow screens keep the stacked seat layout.

## Prototype limits

- Seats, answer histories and the current game live in the PC browser page. Refreshing it clears them (the browser asks first while a game is running). Optional mobile sharing relays a public snapshot and question actions through the PC server; it does not restore a closed game.
- The sign-in form does not verify the email or create an account.
- The question bank has ten questions about study habits and teamwork (`QUESTIONS` in `lib/game.ts`, also listed in `Design/Icebreaker_UNO_Question_Bank.md`).
- The screen cannot see the physical cards. Players press the buttons themselves after an action card and when someone runs out of cards.
- Percentages represent answer similarity within this short activity. They are not a personality test or proof of long-term group compatibility.
- The older `app/api/game/route.ts` API and `ice_sessions` database table remain unused. Mobile sharing uses `app/api/mobile/route.ts` and the separate `mobile_rooms` table.

## Key files

| File | What it contains |
|---|---|
| `app/page.tsx` | The whole app: four seats, answer histories, colour convergence, pairwise percentages and the result state |
| `app/globals.css` | Styles. The newer styles are at the end of the file |
| `lib/game.ts` | The question bank (`QUESTIONS`) and rule names (`RULES`) |
| `app/mobile/page.tsx` | Mobile player tabs, live colours and question controls |
| `app/api/mobile/route.ts` | Local shared snapshots, authenticated PC updates and deduplicated phone commands |
| `hooks/use-mobile-host.ts` | Publishes the PC state and applies queued phone actions |
| `hooks/use-match-alerts.ts` | Mobile match notifications, sound opt-in and vibration |
| `lib/mobile-alerts.ts` | Match deduplication and the locally generated bell sound |
| `components/mobile-invite.tsx` | LAN address and table-specific mobile link |
| `components/mobile-join.tsx` | Free-seat selection, mobile sign-in and guest seating |
| `lib/mobile.ts` | Shared mobile types, input validation and request helpers |
| `backup/` | The earlier version's page (Host, Shared screen and Player views), kept for reference |
