# Icebreaker UNO · Version 5

This prototype follows IceBreaker_Flowchart_Version5.pdf. Use it with real UNO cards. The host records what happens in the card game.

## Try the demo

1. Open the app and choose **Try a demo with 4 players**.
2. In the Host view, choose **Start this table**.
3. Record a Draw 2 or Skip card. The affected player gets an optional question. The game moves to the next player right away.
4. Choose an answer and confirm it. You can also change the question, skip it, answer later, or invite another player.
5. Record the other players' turns. At the end of the round, you can update the wristbands, start a new round, add a rule, or take a tea break.
6. If players are already talking, turn on the conversation setting. The visible wristband feedback waits until a suitable pause.
7. At the end of the activity, the host can delete the activity data.

## Use it with a group

The host creates an activity and copies the player link. Players enter a nickname. They can choose interest tags and agree to use them, or join as a Guest. Each player chooses Table A or Table B. Each table has six seats. New players who arrive during a game wait until the end of the round.

Open the Shared screen view on a screen at each table. Players can use their own phones to answer questions. Each table moves at its own pace.

A round ends when each active player has taken a turn, been skipped, passed, or left. Players do not need to use all their cards to finish a round. The host records card actions and can correct hand sizes. After a Give a card or Swap cards rule, check the hand sizes.

Host and player access keys stay on their own devices. The player link does not include the host key. Names on the shared screen help show whose turn it is. Shared answers do not show a name. Players choose whether to share each answer. A Guest's answer choice is not sent or saved; a Guest can share it aloud.

## What you can do

- Switch between Host, Shared screen, and Player views.
- Join with an activity code and see updates across devices.
- Choose a seat, wait for a free seat, change tables, or leave.
- Record Play, Draw 1, Draw 2, Draw 4, Skip, Reverse, and Pass actions.
- Offer no more than one optional question per round.
- Answer, change, skip, wait, or invite another willing player.
- Keep a question open until the affected player's next turn, even across rounds. The game does not wait for an answer.
- Update visible wristband feedback at the end of a round or during a tea break. Delay it while people are talking.
- Add optional rules gradually, take a tea break, and end the activity.
- Delete activity data when the activity is over.

## Prototype limits

Wristbands are shown on screen. Real wristband hardware is not connected. LinkedIn sign-in is not connected. Use manual interest tags.

The shared-interest score compares a player's tags with other non-Guest players at the same table. It uses the average proportion of matching tags (Jaccard similarity). Colour comes from the first interest tag. Shade shows the last publicly updated score. The score shows shared interests; it does not measure friendship, belonging, popularity, or willingness to talk. No score is shown when there is no other profile to compare. Skipping or not answering does not lower the score. Some answers can add an interest tag. These questions are for a demo and have not been validated as a research scale.

Activity data is stored in the server database. The host can delete it. Activities stop working after six hours. Expired data is removed when a later activity request runs, so deletion is not guaranteed at an exact time.

This handoff is a local prototype. If it is published later, check the site's sharing settings before inviting students.

## Run locally

Use Node.js 22.13 or later and npm. For a fresh setup:

```sh
npm run install:ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_legal_thunderbolt.sql
npm run dev
```

Apply the database migration only once to a new local database. The preview address is shown when the app starts. It is usually http://127.0.0.1:5173/.
