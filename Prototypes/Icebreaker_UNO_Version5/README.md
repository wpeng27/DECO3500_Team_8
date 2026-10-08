# Icebreaker UNO · Version 5

**Open the live prototype:** https://icebreaker-uno-v5.summer-lake-0dc2.workers.dev/

Icebreaker UNO is a companion to a physical UNO game, not an online card-game simulator. The host records card actions while the app helps a group meet, answer optional questions, and view shared-interest bands.

## Get started

To explore on your own, open the prototype and choose **Try a demo with 4 players**, then select **Start this table** in the Host view.

To play with a group:

1. The host chooses **Create an activity** and shares the activity code or player link. Keep the host device and its access key private.
2. Players join from their own devices with a nickname. They can choose interest tags and consent to their use, or join in Guest mode.
3. Choose Table A or Table B. Each table has six seats. Open the Shared screen view on a display for each table.
4. Play with physical UNO cards. The host records each player's action; tables progress independently.
5. A Skip, Draw 2, or Draw 4 can offer the affected player one optional question per round. They may answer, change or pass the question, answer later, or invite another player. Play continues either way.
6. At a round break, the host can update the bands, start another round, change the optional rule, or take a tea break. The host can end and delete the activity when finished.

The host records Play, Draw 1, Draw 2, Draw 4, Skip, Reverse, and Pass. The app tracks turns and card counts; the host can correct counts after a Give a card or Swap cards rule.

## Data and prototype limits

- Wristbands are visual indicators in the app; no physical wristband hardware is connected.
- Shared-interest scores compare opted-in players' interest tags at the same table. The score is based on average Jaccard similarity; band colour comes from a player's first tag. It represents shared interests, not friendship, popularity, belonging, or willingness to talk. Scores are not shown when there is nobody else to compare with.
- Players choose whether to share an answer with the table. Shared answer text is not shown with a player's name. A Guest's selected answer is not sent or saved; a Guest can share it aloud.
- Activity data is stored in the server database. The host can delete it. Activities expire after six hours; expired records are removed on a later activity request, not necessarily at the exact expiry time.
- Questions and interest tags are prototype content, not a validated research scale. Use nicknames and avoid entering sensitive personal information.

## Run locally

Use Node.js 22.13 or later and npm. From this directory, run:

```sh
npm run install:ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_legal_thunderbolt.sql
npm run dev
```

Run the database migration only once for a new local database. The development server normally uses http://127.0.0.1:5173/. If that port is occupied, Vite may select the next available port.

## Deploy or update

Deployment requires access to the configured Cloudflare account. Sign in with Wrangler:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js login
```

For the first deployment only, build the app and create the production database schema:

```sh
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --remote --config dist/server/wrangler.json --file drizzle/0000_legal_thunderbolt.sql
```

Then deploy, or run this again to publish later code changes:

```sh
npm run deploy
```

Wrangler prints the public `workers.dev` URL after deployment. Do not reapply the initial database migration to an existing production database.
