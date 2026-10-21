# Design Process Overview

> **Draft for the team to review.** Text marked **[TEAM: …]** needs a team member to fill in or confirm. Images use absolute GitHub links so they also display on the WIKI.

## Links

- **Poster:** [Poster.png](https://github.com/wpeng27/DECO3500_Team_8/blob/main/poster_related/images/Poster.png) · [Interaction flow](https://github.com/wpeng27/DECO3500_Team_8/blob/main/poster_related/images/Interaction%20Flow.png)
- **Live prototype:** https://icebreaker-uno-v6.zhifeng-cheng.workers.dev. Nothing to install and no login: each player signs in with a preferred name and any email address, or chooses **Continue as Guest**. You also need a physical UNO deck. Phones can join by scanning the QR code under **Mobile screens**.
- **Repository and usage instructions:** [README](https://github.com/wpeng27/DECO3500_Team_8#readme)
- **Ethical considerations:** [Ethical Considerations](Ethical-Considerations) **[TEAM: check the WIKI page name]**

## Summary

When a tutor says "form your groups", students who do not know anyone face a small but stressful social problem. They cannot tell who still needs a group, approaching a table risks a visible refusal, and the things they care about (how someone communicates, whether they meet deadlines, what role they take) stay invisible until the project has started.

Icebreaker UNO gives that moment a shared, low-pressure activity. Up to four students play UNO with real cards around one shared screen. Playing an action card lets the player draw an optional question about study habits or teamwork. When two players' answers match, their corner colours move closer and their phones chime. After 10 minutes, the screen shows how similar each pair's answers were, as a starting point for conversation rather than a recommendation. Students then decide for themselves whether to keep talking or form a team.

We did not set out to find students the "best" teammates automatically. The aim was to make the first interaction easier, let people learn about each other gradually, and leave every decision with them.

## Process

### 1. Research: the problem is the first approach, not finding people

Our proposal began as an online, course-specific matching forum. Eight semi-structured interviews in two rounds ([analysis](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Interviews/Interview_Analysis.md)) and a questionnaire changed that direction. Students relied on proximity and surface cues ("I've seen this person before, they seem normal, they turn up to class. That was basically the bar"), an online looking-for-group thread had existed but "barely anyone used it", and international students avoided classmates who seemed highly fluent. Another channel was not what was missing. What students lacked was a legitimate reason to talk, at the right time and place.

We turned this into seven experience requirements ([Project Update](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Icebreaker_UNO_Project_Update.md)), including **ER1** (a legitimate reason to interact), **ER2** (keep the game's rhythm), **ER4** (players can pass without penalty) and **ER7** (continued contact is never automatic). We also chose what *not* to build: no rankings, GPA or public ratings, because interviewees suggested that performance signals would widen the gaps they already felt.

### 2. Iteration 1: alliances and a facilitator

The first prototype (V1) was a five-player companion app with a facilitator view, a public board and a private phone view per player. Players were secretly split into red and blue alliances, and a random rule appeared every three rounds. A formative playtest and design review ([notes](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Design_Review_Notes.md)) found that a question on every turn stalled the game ("eventually it felt easier to stop playing and just chat"). The participant suggested tying questions to action cards instead. The tutor also noted that the screen did little that a paper rule drawn from a hat could not.

### 3. Redesign through theory

Olsson et al. (2020) shifted how we saw the screen: from *enabling* an activity to *facilitating*, *inviting* and *encouraging* interaction through shared attention, collective activity and interdependence ([Design Rationale](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Icebreaker_UNO_Design_Rationale.md)). Together with GameFlow (Sweetser & Wyeth, 2005) and evidence that cooperative play builds social closeness and trust (Depping & Mandryk, 2017; Depping et al., 2016), this led us to remove alliances and secret switching and to trigger questions only from action cards. We kept familiar UNO play as the core of the activity, and explored atmosphere and card-swapping mechanics in small side prototypes (V2).

### 4. Iteration 3: optional questions and visible common ground

V5 added interest tags, Guest mode, optional questions that could be changed or passed, and simulated colour "wristbands" showing shared interests. In the [feature test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Feature_Test_Feedback.md) (4 participants), the activity made talking easier ("Playing gave us something to talk about without having to introduce ourselves formally"), and being able to skip made people comfortable. However, colour and shade were confusing, and some participants missed what others said while checking their phones.

### 5. Iteration 4: one shared screen

The [interaction test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Interaction_Test_Feedback.md) (3 participants) confirmed that attention was split ("I sometimes wasn't sure whether to look at my phone or the shared display"). It also showed that a watching tutor made the activity feel assessed. V5.5 therefore moved everything onto one shared screen with a corner per player and no host role, so control was spread across the table.

A [comparative test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Comparative_Testing_Feedback.md) (3 participants) compared a questions-only round with UNO plus questions. All three found UNO more relaxed at the start ("The questions only round felt a bit like an interview"). They also found it harder to listen and follow up while playing: "the next turn started and the moment passed".

### 6. Iteration 5 (final): matches that mean something, and room to talk

V6 responded directly to these findings:

- **Teamwork questions.** Ten questions on study habits and teamwork ([question bank](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Design/Icebreaker_UNO_Question_Bank.md)) replaced general interests, so matching answers matter for group formation. On the preferred-role question, *different* answers count as a match, because a team needs complementary roles.
- **Gradual colour blending.** Colours blend a little with each match instead of switching, and each seat keeps a fixed border colour so players remain identifiable.
- **Cautious similarity results.** Results are shown only for questions both players answered. With one shared question the answers are shown without a percentage, and with more the score starts at 50% and moves gradually, so one or two answers cannot produce an extreme result.
- **Pause.** Pause stops both the game and the timer, so a good conversation does not have to give way to the next turn.
- **Rule changes.** The extra rule changes after every third *answered* question; skips do not count, so skipping is never a way to escape a rule.
- **Optional phones.** Phone screens are optional and carry only what is personal to each player: their colour, their question controls, and a sound and vibration alert when they match someone. The table stays on the shared screen.

In the [final test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker%20UNO%20Final%20Prototype%20Feedback.md) (3 participants), all three understood that the results were a starting point for conversation ("rather than a definite recommendation about who to work with"), and the guest and skip options made them feel in control. Two asked for a QR code to join, which we then added. One participant wondered whether a higher percentage "meant we would work better together", so the results now state that they show shared answers, not teamwork fit. Another asked for it to be clear that skipping does not count against you, which the rules screen now says. In later playtesting, players asked to see their results on their phones, and the two players on the far side of the screen could not read the upside-down centre circle. Phones now show each player's results at the end and explain the current rule, and the far-side seats show the current rule and time in their own corners.

### Limitations and future improvements

- **Email introductions.** Players can enter an email, but this version does not use it yet. Next, a player could choose who they would like to stay in touch with, and the system would send an introduction email on their behalf, only when both people opt in and without revealing either address.
- **Answer options and legend.** Some answer options did not fit everyone, so an "Other" option or a chance to explain aloud would help. A colour legend was also requested.
- **Pick a player.** Being picked by another player under the Pick a player rule felt "slightly more on the spot"; the picked player could be allowed to pass it on.
- **Testing scope.** Testing used small groups of 3–4 and did not include a real tutorial. We cannot yet claim the activity reduces anxiety or leads to better teams.
- **Physical cards.** The screen cannot see the physical cards, so players report their own actions.

## Who did what

**[TEAM: confirm and complete. The duties below come from the Team Charter.]**

| Member | Contribution |
|---|---|
| Zhaoyi Gao (team leader) | User research, prototype development, user testing and evaluation **[TEAM: specifics]** |
| Zhifeng Cheng | Domain research, concept brainstorming, technical implementation and deployment of the final prototype **[TEAM: specifics]** |
| Weijie Peng | Team management and communication, paper research **[TEAM: specifics]** |
| Xueming Wang | User research, evaluation, prototype development (V1) **[TEAM: specifics]** |
| Lei Guo | Academic and contextual research, user testing, documenting design rationale **[TEAM: specifics]** |

## References

- Depping, A. E., & Mandryk, R. L. (2017). Cooperation and interdependence: How multiplayer games increase social closeness. *Proceedings of CHI PLAY '17*. **[TEAM: check details]**
- Depping, A. E., Mandryk, R. L., Johanson, C., Bowey, J. T., & Thomson, S. C. (2016). Trust me: Social games are better than social icebreakers at building trust. *Proceedings of CHI PLAY '16*. **[TEAM: check details]**
- Olsson, T., Jarusriboonchai, P., Woźniak, P., Paasovaara, S., Väänänen, K., & Lucero, A. (2020). Technologies for enhancing collocated social interaction: Review of design solutions and approaches. *Computer Supported Cooperative Work, 29*, 29–83. **[TEAM: check details]**
- Sweetser, P., & Wyeth, P. (2005). GameFlow: A model for evaluating player enjoyment in games. *Computers in Entertainment, 3*(3).
