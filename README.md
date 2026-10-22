# Icebreaker UNO

**DECO3500 Social & Mobile Computing · Semester 2, 2026 · Team 8 (Ice Breaker)**

Icebreaker UNO is a hybrid physical–digital icebreaker for the moment a tutor says *"form your groups"*. Up to four unfamiliar students play UNO with real cards around one shared screen. Playing an action card lets you draw an optional question about study habits or teamwork; when two players' answers match, their corner colours move closer and their phones chime, giving them a natural reason to talk. After 10 minutes, the screen shows how similar each pair's answers were, so you can decide whether to keep talking or form a team without having to approach strangers cold.

![Icebreaker UNO poster](poster_related/images/Poster.png)

## Contents

- [Poster and promotional material](#poster-and-promotional-material)
- [Try the prototype](#try-the-prototype)
- [The problem and our response](#the-problem-and-our-response)
- [Repository guide](#repository-guide)
- [Prototype history](#prototype-history)
- [Team](#team)
- [External links](#external-links)

## Poster and promotional material

| Material | Link |
|---|---|
| Tradeshow poster (A2 portrait) | [Poster.png](poster_related/images/Poster.png) |
| Interaction flow diagram | [Interaction Flow.png](poster_related/images/Interaction%20Flow.png) |
| Poster text: domain, opportunity, solution, scenario, social & mobile, user evidence | [poster_related/texts/](poster_related/texts/) |

## Try the prototype

**Open the live prototype: https://icebreaker-uno-v6.zhifeng-cheng.workers.dev**

Nothing to install. Open the link in a browser on a laptop or tablet (iPad works) to use it as the shared table screen.

The final prototype is Iteration 5, in [`Prototypes/icebreaker_UNO_Version6(shared_screen_Advanced)/`](Prototypes/icebreaker_UNO_Version6%28shared_screen_Advanced%29/). Its [README](Prototypes/icebreaker_UNO_Version6%28shared_screen_Advanced%29/README.md) has the full rules, mobile setup and troubleshooting.

**There is no login.** Each player either signs in with a preferred name and any email address (not verified, not displayed, used only for the current game) or presses **Continue as Guest**.

### What you need

- A laptop or tablet as the shared table screen
- A physical UNO deck
- 2–4 players
- Optional: players' phones with Internet access

### Run it locally instead

Only needed for development, or if the live link is unavailable. Requires Node.js 22.13 or later.

```sh
git clone https://github.com/wpeng27/DECO3500_Team_8.git
cd "DECO3500_Team_8/Prototypes/icebreaker_UNO_Version6(shared_screen_Advanced)"
npm run install:ci
npm run build
npm run db:migrate:local
npm run dev
```

Then open http://localhost:5173/. When running locally, phones must be on the same Wi-Fi as the PC. On Windows, keep the project in a short path (for example `D:\projects\icebreaker-uno`); very long paths can make `npm run install:ci` fail with an `esbuild.exe ENOENT` error.

### Play

1. Read the rules screen and press **Got it, let's start**.
2. Each player takes a corner: **Sign in** or **Continue as Guest**.
3. With at least two players seated, press **Start game** in the centre circle. The 10-minute countdown starts.
4. Play UNO with the real cards. After playing an action card (Skip, Reverse, Draw Two, Wild, Wild Draw Four), press **Draw a question** in your corner, then answer or skip it.
5. Matching answers blend the two players' corner colours. Every third answer changes the extra rule (Hidden cards, Pick a player, Give a card, Swap cards or Normal UNO). Press **Pause** whenever a conversation is worth continuing.
6. The game ends at 0:00 or when someone presses **Player out of cards**. Each corner then shows how similar your answers were to every other player's.

**Optional phone screens:** on the shared screen, click **Mobile screens** and scan the QR code. Phones can take a seat, answer or skip questions, show your live colour, and chime and vibrate when your answers match someone else's (vibration is not supported on iPhone). Refreshing the shared screen starts a new game with a new QR code.

### Earlier iterations you can open online

| Iteration | Link |
|---|---|
| 4: shared screen (single device, no phones) | https://icebreaker-uno-v55-shared-screen-helen.summer-lake-0dc2.workers.dev/ |
| 3: host, shared screen and player views | https://icebreaker-uno-v5.summer-lake-0dc2.workers.dev/ |
| 1: alliance version | No longer online (the old link now opens the final version). Run it locally from [`Prototypes/Icebreaker_UNO_Version1`](Prototypes/Icebreaker_UNO_Version1/README.md#local-development). |

## The problem and our response

**Domain.** Social connection and group formation in university classrooms: the first tutorials of a course, when students who do not know each other must form semester-long project teams.

**What we found.** In eight interviews, students described watching the room, not knowing who still needed a group, and fearing a visible refusal. They relied on proximity and surface cues ("they seem normal, they turn up to class") because what they actually wanted to know (communication habits, deadline habits, preferred roles) was invisible until the project had started. International students added that language confidence changed who felt approachable. An online looking-for-group thread existed, but "barely anyone used it". See [Project Update](Icebreaker_UNO_Project_Update.md) and [Interview Analysis](Interviews/Interview_Analysis.md).

**Design opportunity.** Not to automatically find the "best" teammates, but to give unfamiliar classmates a shared, low-pressure reason to interact before deciding whether to form a team ([opportunity](poster_related/texts/opportunity.md)).

**Our response.**

- **A shared activity first.** Physical UNO gives the table something to do together, so silences feel less awkward than in a questions-only round.
- **Questions tied to game events.** Questions appear only after action cards, not on every turn, after early testing showed that per-turn questions stalled the game.
- **Optional disclosure.** Every question can be skipped, and Guest mode needs no details.
- **Common ground made visible.** Colour blending, phone match alerts and an end-of-game similarity summary show who answered alike. The preferred-role question counts *different* answers as a match, because a team needs complementary roles.
- **Room for conversation.** Anyone can pause the game and timer when a conversation takes off.
- **Nothing kept.** Names and emails last only for the current game, and phone connections expire.

The [social & mobile framing](poster_related/texts/social&mobile.md) maps these choices to collaborative and contextual computing concepts, and the [Design Rationale](Icebreaker_UNO_Design_Rationale.md) explains how Olsson et al. (2020) changed the role of the shared screen.

## Repository guide

| Folder / file | What it contains |
|---|---|
| [`Proposal/`](Proposal/) | Assessment 2 proposal: drafts of the domain, opportunity and plan of work, plus the final slides and script |
| [`Interviews/`](Interviews/) | Interview questions, eight transcripts and the thematic [analysis](Interviews/Interview_Analysis.md) |
| [`References/`](References/) | Annotated literature on [icebreaker games](References/Icebreaker_Games_References.md) and [music and stress](References/Icebreaker_Music_References.md) |
| [`Icebreaker_UNO_Project_Update.md`](Icebreaker_UNO_Project_Update.md) | Week 9 stand-up summary: research findings, experience requirements (ER1–ER7), early prototype and first evaluation |
| [`Icebreaker_UNO_Design_Rationale.md`](Icebreaker_UNO_Design_Rationale.md) | How Olsson et al. (2020) shaped the redesign |
| [`Design/`](Design/) | Concepts, core and detailed rules, [flowcharts](Design/IceBreaker_UNO_Flowchart_Version5.md) and the [question bank](Design/Icebreaker_UNO_Question_Bank.md) |
| [`Prototypes/`](Prototypes/) | Every prototype iteration (see [Prototype history](#prototype-history)) |
| [`Feedbacks(Testing)/`](Feedbacks%28Testing%29/) | User evaluations: [design review](Feedbacks%28Testing%29/Icebreaker_UNO_Design_Review_Notes.md), [comparative test](Feedbacks%28Testing%29/Icebreaker_UNO_Comparative_Testing_Feedback.md), [feature test](Feedbacks%28Testing%29/Icebreaker_UNO_Feature_Test_Feedback.md), [interaction test](Feedbacks%28Testing%29/Icebreaker_UNO_Interaction_Test_Feedback.md) and [final prototype test](Feedbacks%28Testing%29/Icebreaker%20UNO%20Final%20Prototype%20Feedback.md) |
| [`poster_related/`](poster_related/) | Poster, diagrams, decoration images and poster text |
| [`Team_Charter/`](Team_Charter/) | Team charter: roles, communication and conflict-resolution plan |

## Prototype history

Folder names keep the team's working version numbers, shown in brackets.

| Iteration | What changed | Why |
|---|---|---|
| [1 (V1)](Prototypes/Icebreaker_UNO_Version1/) | Five players on phones, a facilitator view and a public board. Red and blue alliances, secret team switching, a random rule every three rounds | Make the key multi-user interactions testable before committing to rules |
| [2 (V2)](Prototypes/Icebreaker_UNO_Version2%28card_swaping%29/) | Card-swapping experiments with background sound | Explore cooperative mechanics and atmosphere |
| [3 (V5)](Prototypes/Icebreaker_UNO_Version5/) | Alliances removed; action cards trigger optional questions; interest tags and Guest mode; two tables | The design review found that a question on every turn broke the game's rhythm |
| [4 (V5.5)](Prototypes/Icebreaker_UNO_Version5.5%28shared_screen%29/) | One shared screen with four corner seats; no host role | Testing showed attention split between phones, the board and people |
| [5, final (V6)](Prototypes/icebreaker_UNO_Version6%28shared_screen_Advanced%29/) | Ten teamwork questions, progressive colour blending, pairwise similarity results, pause, rule change after every third answer, optional phone screens with match alerts | Make matches meaningful for team formation, and give conversations room to continue |

## Team

| Member | GitHub |
|---|---|
| Zhifeng Cheng | [zhifengStephen](https://github.com/zhifengStephen) |
| Weijie Peng | [wpeng27](https://github.com/wpeng27) |
| Xueming Wang | [Xueming02](https://github.com/Xueming02) |
| Zhaoyi Gao | [Zhaoyi1Gao](https://github.com/Zhaoyi1Gao) |
| Lei Guo | [Guolei-ia](https://github.com/Guolei-ia) |

### Task management

For most of the semester, we divided and followed up tasks in our team WeChat group. In the final weeks, we moved the remaining tasks to [GitHub issues](https://github.com/wpeng27/DECO3500_Team_8/issues). The [WIKI](https://github.com/wpeng27/DECO3500_Team_8/wiki) records our stand-ups, design process and ethical considerations.

## External links

- [Questionnaire results](https://forms.cloud.microsoft/Pages/AnalysisPage.aspx?AnalyzerToken=vxlCoOK0NGyzn68z98bYejLc9kOrQrC9&id=z3fjtrOdy0aRovrZYFuxXC2dnxS6knNLhKpiupF-qDdUOFgwRUs3VlpUT0Q5NUdTVVBQSEFSTlJCOC4u)
- [Team Miro board](https://miro.com/welcomeonboard/cFB3UzNDUjlKaERDT2s1WTdSL0ErV3pmVEE1YWFNRnQ1MzNLbGxNaG83RlJwV01PdnpFMGN5ZFRjVGVpRmsyVmxsT2FVNFFWZlgxWXBHNC9nVXlScURMRDRqcndzMXJGU2VwMmVtQzBsVVpGRkR6SktBNW5Vem0xd29GckNXQWhBS2NFMDFkcUNFSnM0d3FEN050ekl3PT0hdjE=?share_link_id=277573078957)
- [Proposal presentation slides](https://uq-my.sharepoint.com/:p:/r/personal/s4626160_uq_edu_au/Documents/Documents/Copilot/Created/UQ_PPT_Template.pptx?d=wb6662e53ab004210ae77b9bc67fd1e48&csf=1&web=1&e=0r9rWI)
- [Proposal presentation script](https://uq-my.sharepoint.com/:w:/g/personal/s4883545_uq_edu_au/IQAgdS1jdzbQQau5xIccqJp7Ad9eGv5ls0Nv-x1U6daZzeg)
- [Presentation upload board (Miro)](https://miro.com/app/board/uXjVHwIA9A8=/?share_link_id=347826465381)
