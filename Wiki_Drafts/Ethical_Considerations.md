We assessed Icebreaker UNO with the **Ethical Disclaimer** from the Ethics for Designers toolkit (Gispen, n.d.). The method works through the current situation, the stakeholders and the design intentions. It then imagines the design in use, lists the unethical situations it could create, and sorts them into those the team takes responsibility for and those it does not, with reasons. It is meant to be a living document, so the last section records what changed at each milestone.

## 1. Current situation

In the first tutorials of a course with group work, the tutor asks students to self-form teams. Students who do not know anyone must approach strangers without knowing who still needs a group. Many fall back on proximity, appearance and fluency when deciding whom to approach. Students who are quiet, late or less confident in English are the most likely to be left out or to end up in a group by default.

## 2. Stakeholders

| Direct | Indirect |
|---|---|
| Students who play, including those who join as guests | Students in the room who choose not to play |
| Tutors who run the activity | Course coordinators and the university |
| | Cloudflare (hosts the app and stores temporary phone-connection data) |
| | Future teammates of the players |

## 3. Design intentions

For students forming groups in a tutorial, Icebreaker UNO should give unfamiliar classmates a shared, low-pressure reason to talk and help them notice common ground in how they like to work. It should leave every decision to the players: whether to play, what to share, and whether to team up. It is not meant to rank students, predict who will be good teammates, or keep any record after the session.

## 4. Potential unethical situations

| # | Situation | Stakeholders affected |
|---|---|---|
| U1 | **Pressure to disclose.** The table waits for an answer, and skipping feels like a social cost. Being picked under the Pick a player rule puts someone "on the spot". | Players, especially shy players and those less confident in English |
| U2 | **Similarity scores read as compatibility or worth.** A low percentage is taken to mean "don't team up with this person", which reinforces the exclusion the design aims to reduce. | Players with less common answers |
| U3 | **Homophily.** Matching on similar answers pushes people towards groups of the same kind, leaving out students whose views or backgrounds differ. | Players, minority groups |
| U4 | **Collecting more personal data than needed.** Email addresses are entered but the final prototype does not use them. | Players who sign in |
| U5 | **Data leaving the room.** Phone sign-in sends a name and email through the server. Room data (names, colours, open questions) sits in the cloud database for up to 12 hours. Anyone with the room link can see and control players. | Players, Cloudflare |
| U6 | **Surveillance and assessment.** A tutor watching, or treating the activity as an assessment, makes it feel evaluative. Results could be photographed or used to allocate groups. | Players, tutors |
| U7 | **Excluding people who cannot or will not play.** Examples include students without a phone, players who are colour-blind (colour carries the main feedback), students unfamiliar with UNO, and those who simply do not want to play a game. | Non-players, players with disabilities |
| U8 | **Attention drawn to phones instead of people.** Alerts and phone screens pull eyes away from the person speaking. | Players |
| U9 | **Starting relationships no one wanted.** Players feel obliged to keep talking or team up after a high match. | Players |

## 5. Responsibility sorting

### We take responsibility (and what we did)

| # | Response in the design |
|---|---|
| U1 | **What we built:** every question can be skipped without explanation, and skips never move the rule on or affect colours or scores. Guest mode needs no details, and questions appear only after action cards, not on every turn. After final testing, the rules screen now says that skipping is always fine and never counts against you. **Still open:** being picked under the Pick a player rule can still feel "on the spot"; a future version could let the picked player pass the question on. |
| U2 | **What we built:** scores compare only questions both players answered. One shared question shows the two answers with no percentage, and with more, scores start at 50% and move gradually, so a few answers cannot produce an extreme result. Because final testing showed percentages could still be read as "how well we'd work together", the results now say so directly: each player's results note that they show shared answers, not teamwork fit, and the centre of the table tells players to use them as conversation starters, not as a verdict on who to team up with. |
| U3 | **What we built:** on the preferred-role question, *different* answers count as a match, so the design rewards complementary roles, not only sameness. Results are given for every pair at the table, not only for the closest match. |
| U4 | **Current state:** the final prototype asks for an email address at sign-in, but nothing in this version uses it yet. Collecting data before the feature that needs it is a gap in data minimisation, so we limit the harm: Guest mode asks for nothing, the email is never shown to anyone, it is not sent to other phones, and it disappears when the game ends. **Planned use (future improvement):** at the end of a game, a player can choose who they would like to stay in touch with, and the system sends a short introduction email on their behalf. The email would go only to players who also opted in (mutual consent), without revealing either address on screen, and the address would be deleted once the email is sent. This keeps continued contact voluntary (ER7) and spares players from asking for contact details face to face. |
| U5 | **What we built:** emails are never shown on screen or included in what phones receive. Seats and answers live in the PC browser and are cleared on refresh. Room data expires after 12 hours. The rules screen tells players what connected phones can see and offers Guest mode to avoid sharing details. At the end of a game, phones also show match results, which are the same results already displayed on the shared screen, so no new information is revealed. Interview and testing data are reported without names. **Consent:** before each interview and test we asked participants for verbal consent, and anyone who declined did not take part (see section 6). |
| U8 | **What we built:** phones are optional, the shared screen carries the table's information, and alerts can be muted, leaving only a visual message. **Still open:** a "vibrate only" default (requested in final testing). |
| U9 | **What we built:** the session ends with results and nothing else: no contact exchange, no messaging, no team assignment. Whether to continue is left entirely to the players, following ER7. The planned email introduction (U4) would keep this principle: nobody is contacted unless both people opt in. |

### Outside our direct control (and how we reduce the risk)

| # | Why it is outside our control | How we reduce the risk |
|---|---|---|
| U6 | How tutors run the activity and use the results is up to them. | Recommend in the usage notes that tutors introduce the activity and step back (a finding from interaction testing). Results are never stored or exported, and they disappear when the game ends. |
| U7 | Some students will not want to join a game, or cannot. | The activity is optional, and the tutor's usual method of forming groups stays available. Phones are optional. Each seat also has a fixed, labelled border, so players are not identified by colour alone. **Still open:** add a colour-independent cue for matches (text or pattern) and a short UNO primer. |

## 6. Research ethics

- **Recruitment.** Interviewees and test participants were classmates we approached at random in class.
- **Consent.** Before each interview and test we asked for verbal consent. Taking part was voluntary, and anyone who declined did not take part.
- **Recordings.** Where an interview was audio-recorded, the recording was used only to write the transcript and was then deleted. We made no video recordings.
- Transcripts and feedback are anonymised (P1–P8 and Participant 1–4), and translated quotes are marked as translated and lightly edited.
- We report findings as recurring experiences in small samples, not as evidence that the prototype reduces anxiety.

## 7. Living document: changes by milestone

| Milestone | Ethical change |
|---|---|
| Proposal → Iteration 1 | Dropped the anonymous online forum in favour of a short, face-to-face activity in the tutorial. Added consent to future contact. |
| Iteration 1 → 3 | Removed secret alliance switching and public leaders (hidden information and status differences). Made questions optional, with change and pass options. |
| Iteration 3 → 4 | Consolidated onto one shared screen and removed the host role, spreading control across the table. |
| Iteration 4 → 5 | Teamwork questions with complementary-role matching, cautious similarity scoring, Pause, skip-proof rule changes, and emails excluded from what phones receive. The optional microphone "quiet detector" from Iteration 4 was removed: users worried that their casual conversation might be recorded, and a screen that reacts to silence made not talking feel like pressure. |
| After final testing | The rules screen now says that skipping never counts against you (U1). Results now explain that scores show shared answers, not teamwork fit (U2). The email field is kept for a planned, mutual opt-in email introduction (U4). |
| Future | Mutual opt-in email introductions (U4). A pass option for Pick a player (U1). A colour-independent match cue (U7). Vibrate-only alerts by default (U8). |

## References

- Gispen, J. (n.d.). *Ethical Disclaimer*. Ethics for Designers. https://www.ethicsfordesigners.com/ethical-disclaimer
