## Links

- **Poster:** [Poster.png](https://github.com/wpeng27/DECO3500_Team_8/blob/main/poster_related/images/Poster.png) · [Interaction flow](https://github.com/wpeng27/DECO3500_Team_8/blob/main/poster_related/images/Interaction%20Flow.png)
- **Live prototype:** https://icebreaker-uno-v6.zhifeng-cheng.workers.dev. Nothing to install and no login: each player signs in with a preferred name and any email address, or chooses **Continue as Guest**. You also need a physical UNO deck. Phones can join by scanning the QR code under **Mobile screens**.
- **Repository and usage instructions:** [README](https://github.com/wpeng27/DECO3500_Team_8#readme)
- **Ethical considerations:** [Ethical Considerations](Ethical-Considerations)

## Summary

When a tutor says "form your groups", students who know no one face a small but stressful problem. They cannot tell who still needs a group, approaching a table risks a visible refusal, and what matters (how someone communicates, meets deadlines or contributes) stays invisible until the project starts.

Icebreaker UNO gives that moment a shared, low-pressure activity. Up to four students play UNO with real cards around one shared screen. Playing an action card lets the player draw an optional teamwork question. When two players' answers match, their corner colours move closer and their phones chime. After 10 minutes, the screen shows each pair's shared answers as a starting point for conversation, not a recommendation. Students then decide for themselves whether to team up.

## Process

Iterations are numbered 1–5 as in the README. The V numbers are the names of the prototype folders.

### 1. Research: the problem is the first approach, not finding people

Our proposal began as an online matching forum. Eight semi-structured interviews ([analysis](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Interviews/Interview_Analysis.md)) and a questionnaire changed that direction. Students relied on proximity and surface cues ("I've seen this person before, they seem normal, they turn up to class. That was basically the bar"), an online looking-for-group thread had existed but "barely anyone used it", and international students avoided classmates who seemed highly fluent. What students lacked was not another channel but a legitimate reason to talk, at the right time and place.

We turned this into seven experience requirements ([Project Update](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Icebreaker_UNO_Project_Update.md)), including a legitimate reason to interact (ER1), keeping the game's rhythm (ER2), passing without penalty (ER4) and contact that is never automatic (ER7). We deliberately avoided rankings, GPA and ratings, which interviewees suggested would widen the gaps they already felt.

### 2. Iteration 1 (V1): alliances and a facilitator

V1 was a five-player companion app with a facilitator view, a public board and a private phone view for each player. Players were secretly split into red and blue alliances, and a random rule appeared every three rounds. A playtest and design review ([notes](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Design_Review_Notes.md)) found that a question on every turn stalled the game ("eventually it felt easier to stop playing and just chat"), and the participant suggested tying questions to action cards. The tutor noted that the screen did little that a paper rule drawn from a hat could not.

![V1 facilitator view during a game](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v1_host_in_game.jpg)
*V1 facilitator view: leaders and their card counts are public, and everyone else's alliance is private. (Screenshots on this page were recreated with demo players.)*

![V1 private player screen after a secret alliance switch](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v1_player_private.jpg)
*V1 private player screen: a secret alliance switch.*

### 3. Redesign through theory, and Iteration 2 (V2)

Olsson et al. (2020) shifted how we saw the screen: from *enabling* an activity to *facilitating*, *inviting* and *encouraging* interaction through shared attention and interdependence ([Design Rationale](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Icebreaker_UNO_Design_Rationale.md)). Together with GameFlow (Sweetser & Wyeth, 2005) and evidence that cooperative play builds social closeness and trust (Depping & Mandryk, 2017; Depping et al., 2016), this led us to drop alliances and secret switching and to trigger questions only from action cards. Iteration 2 (V2) explored card swapping and background sound in small side prototypes.

### 4. Iteration 3 (V5): optional questions and visible common ground

V5 added interest tags, Guest mode, optional questions that could be changed or passed, and colour "wristbands" showing shared interests. In the [feature test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Feature_Test_Feedback.md) (4 participants), playing made talking easier ("Playing gave us something to talk about without having to introduce ourselves formally") and being able to skip made people comfortable. However, colour and shade were confusing, and some participants missed what others said while checking their phones.

![V5 joining screen with interest tags and Guest mode](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v5_join_interest_tags.jpg)
*V5 joining screen: interest tags set a player's band colour, or they can join as a Guest.*

![V5 shared screen showing an optional question](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v5_shared_screen.jpg)
*V5 shared screen: a Skip card opens an optional question while the game continues.*

### 5. Iteration 4 (V5.5): one shared screen

The [interaction test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Interaction_Test_Feedback.md) (3 participants) confirmed that attention was split ("I sometimes wasn't sure whether to look at my phone or the shared display") and that a watching tutor made the activity feel assessed. V5.5 moved everything onto one shared screen with a corner per player and no host role.

![V5.5 shared screen with four corners](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v5.5_shared_screen.jpg)
*V5.5: each corner faces its seat, and the centre circle shows the current rule.*

A [comparative test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Comparative_Testing_Feedback.md) (3 participants) found UNO more relaxed than questions alone ("The questions only round felt a bit like an interview"), but it was harder to follow up on answers: "the next turn started and the moment passed".

### 6. Iteration 5 (V6, final): matches that mean something, and room to talk

- **Teamwork questions.** Ten questions on study habits and teamwork ([question bank](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Design/Icebreaker_UNO_Question_Bank.md)) replaced general interests. On the preferred-role question, *different* answers match, because a team needs complementary roles.
- **Gradual colour blending.** Each match blends colours a little, and fixed borders keep every seat identifiable.
- **Cautious results.** Only questions both players answered count. One shared question shows the answers instead of a percentage; with more, the score starts at 50% and moves gradually.
- **Pause** stops the game and the timer, so a good conversation can continue.
- **Rule changes** follow every third *answered* question, so skipping never escapes a rule.
- **Optional phones** carry only personal controls and a match alert. The table stays on the shared screen.

<img src="https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v6_mobile_seats.png" alt="V6 phone screen connected to the table, showing the timer, extra rule and seats" width="280"> <img src="https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v6_mobile_question.png" alt="V6 phone screen showing a question with Submit answer and Skip question" width="280">

*V6 phone screens: the time, rule and seat choice (left), and a private question (right).*

![V6 shared screen after two players give the same answer](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v6_answer_match.jpg)
*V6: matching answers move the colours of Seats 3 and 4 closer.*

![V6 results after the game](https://raw.githubusercontent.com/wpeng27/DECO3500_Team_8/main/Wiki_Drafts/images/v6_results.jpg)
*V6 results: with one shared question, the pair's answer is shown instead of a percentage.*

In the [final test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker%20UNO%20Final%20Prototype%20Feedback.md) (3 participants), all three understood the results as a starting point for conversation ("rather than a definite recommendation about who to work with"), and the guest and skip options made them feel in control. In response, we added a QR code for joining and made it explicit that results show shared answers, not teamwork fit, and that skipping never counts against you. Later playtesting led us to show results on phones and the current rule and time in the far-side corners.

### Limitations and future improvements

- **Email introductions.** Emails are collected but not yet used. Next, the system could send an introduction only when both players opt in, without revealing either address.
- **Answer options and legend.** Some options did not fit everyone; an "Other" option and a colour legend were requested.
- **Pick a player** felt "slightly more on the spot"; the picked player could be allowed to pass it on.
- **Testing scope.** Testing used groups of 3–4, not a real tutorial, so we cannot yet claim the activity reduces anxiety or leads to better teams.
- **Physical cards.** The screen cannot see the cards, so players report their own actions.

## Who did what

Summarised from the repository's commit history.

**Zhifeng Cheng**
- Uploaded and updated the Team Charter (docx + pdf)
- Wrote the three proposal scripts: Domain/Problem Space; Design Opportunity/Audience/Concepts/Prior Attempts; Plan of Work
- Wrote the prototype function description (prototype design.txt)
- Maintained the README links (Slides, ACM, presentation script, Miro, questionnaire results)
- Interview 5
- Refined UNO Concept v2 document (traces wall, timing anchor, cooperation rewards)
- Two reference lists: games as low-pressure activities; music for stress reduction
- V2 card-swapping prototype
- V5.5 shared-screen prototype, including the microphone quiet detector
- V6 core gameplay:
  - 10 teamwork questions and the question-drawing algorithm
  - 10-minute timer, action-card-triggered questions, and an automatic rule change after every third answer
  - Start game button, rule-change notice, and seat border colours
  - Complementary matching for Question 2; answers shown instead of a percentage when players share only one question
  - Edge-case handling: pause, leaving, timer drift, skips, and duplicate names
  - Multiple rounds of UI refinement (centre circle, corner panels, colours)
- Stopped tracking the Vite cache in V6
- Added explanations that skipping never counts against players and that results do not indicate teamwork fit
- Final results on phones; current rule and time shown to far-side seats
- Deployed V6 to Cloudflare
- Created the poster_related folder
- Revised the poster texts against V6 (our_solution, social&mobile, user_feedback, scenario), splitting problem and scenario
- Rewrote the root README
- Two Wiki drafts: Design Process Overview and Ethical Considerations

**Weijie Peng**
- Created the GitHub repository
- Added the team name to the Team Charter
- Initial interview questions and responses document
- Interview 3 and Interview 7
- Interview Analysis
- Organised the Proposal and Team Charter folders; uploaded the final presentation slides and script
- New game rules (Rules.md)
- Prototype testing feedback (Prototype_feedback.md)
- User testing results (User_Testing.md)
- Comparative Testing Feedback
- Final Prototype Feedback
- V6: Submit and Skip question buttons
- V6: mobile screen
- V6: QR code for mobile joining
- V6: layout fixes
- Poster text: renamed user_feedback to user_evidence and expanded its content
- Restored the repository to a working version after it was disrupted by accidental commits

**Xueming Wang**
- Created the Interviews folder and wrote the interview questions (multiple revisions)
- Interview 1 and Interview 6
- Revised the Plan of Work script
- V1 prototype (red/blue alliances, facilitator view, public board, multi-player phone views)
- Stand-up document
- Initial V6 version (icebreaker-uno-matching)
- Poster text: social&mobile (converted from txt to md)
- Poster text: rewrote problem as opportunity
- Cleaned up csv and .DS_Store files

**Zhaoyi Gao**
- Interview 2
- Feedback and suggestions on the UNO game (design review)
- First drafts of the poster texts: domain, problem_scenario, our_solution, user_feedback
- Added gameplay details to our_solution
- Feature improvements and similarity calculation documentation
- Poster images: UNO.png and the mermaid diagram

**Lei Guo**
- Completed Interview 4 and Interview 8
- Developed the V5 prototype, using simple English and including a shared screen, interest tags, Guest mode, and wristband colours
- Created the V5 flowcharts
- Created the V4 flowcharts
- Wrote the Design Rationale based on Olsson et al. (2020)
- Completed the final visual refinement of the Team Proposal Slides
- Created the final poster, interaction flow diagram, and decoration images
- Simplified and finalised the final poster text
- Recorded and compiled the team meeting minutes
- Organised the Design folder: Concept Version2, Concept Earlier Draft, Core Rules, and Detailed Rules Version2
- Organised the References folder: Games References and Music References
- Organised the Feature Test Feedback, Interaction Test Feedback, and Design Review Notes
- Expanded the stand-up document into the Project Update
- Restructured the repository and standardised file naming

## References

- Depping, A. E., & Mandryk, R. L. (2017). Cooperation and interdependence: How multiplayer games increase social closeness. In *Proceedings of the Annual Symposium on Computer-Human Interaction in Play (CHI PLAY '17)* (pp. 449–461). ACM. https://doi.org/10.1145/3116595.3116639
- Depping, A. E., Mandryk, R. L., Johanson, C., Bowey, J. T., & Thomson, S. C. (2016). Trust me: Social games are better than social icebreakers at building trust. In *Proceedings of the 2016 Annual Symposium on Computer-Human Interaction in Play (CHI PLAY '16)* (pp. 116–129). ACM. https://doi.org/10.1145/2967934.2968097
- Olsson, T., Jarusriboonchai, P., Woźniak, P., Paasovaara, S., Väänänen, K., & Lucero, A. (2020). Technologies for enhancing collocated social interaction: Review of design solutions and approaches. *Computer Supported Cooperative Work (CSCW), 29*(1–2), 29–83. https://doi.org/10.1007/s10606-019-09345-0
- Sweetser, P., & Wyeth, P. (2005). GameFlow: A model for evaluating player enjoyment in games. *Computers in Entertainment, 3*(3), Article 3. https://doi.org/10.1145/1077246.1077253
