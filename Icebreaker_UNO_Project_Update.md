# Icebreaker UNO Project Update

This document records the current research evidence, experience requirements, early prototype, formative evaluation findings, and functional prototype progress for **Icebreaker UNO**.

## Project Focus

Icebreaker UNO explores how a hybrid physical-digital game might give university students a lower-pressure, socially meaningful reason to interact with unfamiliar classmates during group formation.

The current evidence supports the need to reduce interpersonal uncertainty and the social cost of initiating contact. It does **not** yet demonstrate that the prototype reduces anxiety. That claim requires further evaluation with target users.

## 1. User Research Findings

The findings below come from interviews.

These findings describe recurring experiences rather than population-level prevalence. Individual differences and contradictory accounts are retained where they affect the design.

### Finding 1: Self-Formed Grouping Creates Time Pressure and Visible Social Risk

In self-formed courses, participants described watching the room, delaying an approach, and worrying that other groups were already full. The longer they waited, the more they feared being left without a team.

Approaching a group also created the possibility of a visible refusal that would remain socially awkward in later classes.

> “I was worried it’d come across as a bit desperate.”

> “There’s also the thought of, ‘What if they’re not going to do any work?’ because you’re committing to working with them for a whole semester.”

The difficulty was therefore not simply locating people. Students were simultaneously managing urgency, uncertainty, possible rejection, and the consequences of making a poor long-term commitment.

### Finding 2: Knowing Who Is Available Is an Immediate Information Need

Several participants said they could not tell:

- which students were still looking;
- which groups still had space; or
- whether an approach would be welcome.

They inferred availability from seating, eye contact, whether someone was alone, and whether a table already appeared socially established.

> “It’s kind of hard to know who already have a group.”

> “If there’s already four people talking together, I just assume they already have a group, even maybe they don’t.”

This suggests that group status may be more immediately useful during the formation moment than a detailed personal profile.

### Finding 3: Familiarity, Proximity, and Visible Engagement Substitute for Missing Evidence

Participants commonly approached:

- friends;
- previously encountered classmates;
- people sitting nearby; or
- people who appeared friendly and approachable.

Tutorial attendance, asking questions, and appearing engaged were used as rough indicators of reliability.

> “I’ve seen this person before, they seem normal, they turn up to class. That was basically the bar.”

These cues made the first approach feel safer, but did not reliably show how someone communicates, handles deadlines, or contributes during a project.

As a result, group formation was often described as random or based on convenience rather than informed compatibility.

### Finding 4: Reliability and Working Compatibility Are Important but Largely Invisible

Across both self-formed and assigned-group accounts, participants wanted to know about potential teammates’:

- communication habits;
- deadline habits;
- availability;
- expected contribution;
- motivation;
- grade expectations;
- preferred roles; and
- relevant strengths.

This information was normally discovered only after the group had begun working.

> “The biggest thing I want to know is just: will this person actually do the work?”

> “You’re making quite an important decision based on very limited information.”

However, one participant said they did not need extensive information before grouping, while another expected to handle the workload independently.

The design should therefore support gradual discovery rather than require comprehensive profiles, GPA disclosure, or public reliability ratings.

### Finding 5: Assigned Grouping Removes the Approach Problem, but Not Collaboration Uncertainty

The participant whose group was assigned did not need to risk asking others for entry. However, they remained uncertain about whether teammates would communicate, contribute equally, and finish work on time.

> “I did not hesitate about joining the group because I did not need to contact people and ask to join them. However, I was a little concerned because I did not know the other group members well.”

Assigned grouping may therefore reduce initiation pressure without resolving concerns about working together.

This means the design opportunity extends beyond matching. Even an already formed group may benefit from a structured first interaction that helps members begin learning how others communicate and collaborate.

### Finding 6: Language Confidence Changes Who Feels Approachable

Several international students described avoiding classmates who appeared highly fluent, fast-speaking, or especially capable because they feared slowing the group down or being judged.

Communication comfort and perceived patience could matter more than technical skill when choosing whom to approach.

> “Communication comfort was probably more important than skills when I first came to UQ.”

> “If I have the second chance, definitely I was not going to be in the same team with her, even though I know she is really good at everything.”

The design should not assume that exposing more performance information will make group formation easier. Rankings, GPA, or competitive signals could intensify perceived differences.

A lower-pressure shared activity may instead allow students to interact before making judgments about one another.

### Finding 7: a Shared Reason Makes the First Conversation Easier

Participants repeatedly said that they sometimes wanted to know classmates but lacked a natural reason to approach them.

Group formation could provide that reason, and even a short conversation sometimes made later greetings or friendship easier, including when the students did not become teammates.

> “For me, starting the first conversation is the hardest part. Once I have already spoken to someone, talking to them again feels much easier.”

> “Group work sometimes gives you that reason, because you can ask like, ‘Do you have a group?’”

After groups formed, interaction usually narrowed to the students’ own teams because the shared task disappeared.

At the same time, not every participant wanted broader or continuing contact. Any replay, messaging, or contact-exchange feature should therefore remain voluntary.

### Finding 8: a Communication Channel Alone Does Not Create Participation

One participant recalled an online looking-for-group thread but said that:

> “Barely anyone used it.”

Across the interviews, students more often relied on face-to-face proximity and existing connections.

This suggests that the opportunity is not simply to create another communication channel. The intervention needs:

- a clear time;
- an appropriate place;
- a shared purpose; and
- an interaction structure that makes participation socially legitimate.

### Research Interpretation

> The design opportunity is to create a brief, structured, and optional shared activity during the group-formation context. It should make the first interaction easier, allow students to learn about one another gradually through behaviour, and reduce the need for an unprompted or publicly rejectable approach. It should not rank students, force personal disclosure, or assume that every participant wants an ongoing social connection.

## 2. Experience Requirements

### ER1: Provide a Legitimate Reason to Interact

The experience should give unfamiliar students a shared reason to communicate, so they do not need to invent a conversation opener or directly request entry into an existing group.

### ER2: Preserve the Rhythm of the Shared Activity

Social interactions should be brief and event-based rather than compulsory on every turn.

Icebreaking should not interrupt or replace the core game.

### ER3: Integrate Social Interaction with Meaningful Game Decisions

Interaction should emerge from recognisable gameplay events, player choices, cooperation, and interdependence rather than from a separate layer of unrelated questions.

### ER4: Maintain Player Agency

Players should be able to:

- choose a light topic;
- answer a question;
- change a prompt; or
- pass without public punishment.

The design should not treat participation in the game as consent to disclose personal information.

### ER5: Enable Indirect Mutual Understanding

Communication preferences, helping behaviour, and interaction styles should emerge through play without requiring players to label their personality or publicly rate one another.

### ER6: Balance Shared Awareness and Privacy

All players should understand the:

- round;
- direction;
- active rule;
- timer; and
- shared outcome.

Private alliance information and private decisions should remain visible only to the relevant player.

### ER7: Support Voluntary Continuation

After the game, players should be able to choose whether to:

- replay;
- leave;
- write a public or private message; or
- consent to future contact.

Continued connection should never be automatic.

## 3. Prototype Description

The current prototype is the combination of physical Uno cards and websites. It is designed for five students and includes three connected interfaces: a facilitator view, a shared public display, and a private mobile view for each player.

The facilitator creates a session and receives a six-character game code. Players use the code to join on their phones and provide a display name, email address, and contact-consent preference. The system assigns players to red and blue alliances, selects one public leader for each alliance, and keeps non-leader alliance information private.

During play, the shared display communicates the timer, round, direction, active rule, leaders, and leader card counts. Private screens communicate each player’s alliance and any secret alliance change. The facilitator records physical game events and activates temporary rules, allowing the website and physical card game to operate as one hybrid experience.

The prototype also implements the current outcome logic. A leader reaching zero cards produces an immediate victory. If time expires, a difference of fewer than three cards produces a shared victory; otherwise, the alliance whose leader has fewer cards wins. The result appears across the public and private displays.

After the game, players can choose whether to replay, leave, post a public message, send a private message, or consent to future contact.

This is a **pre-user-testing prototype**, not the final design. It has been built to make the key multi-user interactions testable before the team commits to the final game rules and interface.

The alliance system, dynamic-rule frequency, conversation mechanics, information visibility, and post-game contact flow are therefore provisional. After testing the complete experience with target users, the team will revise, simplify, or remove features according to observed confusion, interruptions to game flow, perceived social pressure, privacy concerns, and participant feedback.

### Questions Explored

- Does UNO provide a natural reason for unfamiliar students to interact?
- Do question prompts help conversation begin?
- Do prompts preserve or interrupt the pace of the game?
- Does the activity still feel like a game rather than a structured interview?
- Do players retain enough choice over participation and disclosure?

## 4. Evaluation Findings

### Method

A small formative playtest was followed by an open-ended debrief.

The session examined:

- how conversation prompts affected the pace of UNO;
- whether the icebreaker activity felt integrated with the game;
- whether players retained control over participation; and
- whether the game remained enjoyable.

### Evaluation Finding 1: Questions on Every Turn Disrupted the Rhythm

The participant reported that compulsory questions slowed play.

During the three-player session, conversation gradually displaced UNO and reduced motivation to continue playing.

> “When every turn required a question, the game slowed down. Eventually it felt easier to stop playing and just chat.”

*Translated and lightly edited from the transcript for clarity.*

GameFlow identifies concentration, control, clear goals, feedback, and social interaction as connected components of game enjoyment (Sweetser & Wyeth, 2005).

The finding therefore supports removing questions from ordinary turns.

### Evaluation Finding 2: Interaction Should Be Connected to Game Mechanics

The participant suggested linking conversation to selected UNO action cards rather than imposing a separate question task.

> “If I play a Skip card, I should accept a social consequence, such as allowing the skipped player to ask me a question.”

*Translated and lightly edited from the transcript for clarity.*

This direction is consistent with research showing that cooperation and interdependence can support social closeness (Depping & Mandryk, 2017).

It is also consistent with findings that gameplay can build trust more reliably than a direct social icebreaker in the tested context (Depping et al., 2016).

### Evaluation Finding 3: Mechanic Integration Does Not Automatically Make Interaction Low Pressure

The participant noted that a card-triggered question could still force communication.

The revised design should therefore provide:

- topic choice;
- light and non-sensitive prompts;
- a change-topic option; and
- a pressure-free pass option.

### Evaluation Finding 4: Social Consequences May Create Strategic Choice

The participant suggested that players who enjoy answering questions may use action cards more aggressively, while players who prefer not to answer may play more cautiously.

This could allow interaction preferences to emerge indirectly through play.

This is a **design hypothesis**, not a validated finding. It requires testing with the revised prototype.

### Evaluation Finding 5: Topic Selection Could Work as a Reward

The participant proposed allowing the winner to select the next conversation category, such as:

- university life;
- everyday interests; or
- hobbies.

This may provide a lightweight reward while preserving game motivation, but it has not yet been evaluated.

### Design Changes After Evaluation and Concept Review

The playtest directly showed that asking a question on every turn interrupted the rhythm of UNO. The team then reviewed whether the alliance system and randomly introduced rules helped address this problem.

Removing alliances is a **design decision for the next iteration**, rather than a result already validated by users.

| Pre-testing design | Revised direction |
| --- | --- |
| Icebreaker prompts operated separately from UNO | Physical UNO action cards trigger corresponding social rules |
| Players were expected to answer | Players can answer, change topic, or pass without penalty |
| Red and blue alliances, public leaders, and secret switching | Remove alliances, leaders, and secret team switching |
| A random rule appeared every three rounds | A rule appears only when its associated UNO action card is played |
| The public display showed alliance and leader information | Display only the timer, play direction, active rule, and shared instructions |
| Victory depended on leader card counts | Return to recognisable UNO play without alliance scoring |

## 5. Functional Prototype Progress

The functional prototype is a multi-device web companion for the physical card game.

It currently provides separate:

- facilitator interface;
- public-display interface; and
- private-player interface.

### Implemented

- A facilitator can create a session and receive a six-character game code.
- Five players can join the same session from their phones.
- Players register a display name, email address, and contact-consent preference.
- The system assigns red and blue alliances.
- One leader from each alliance is publicly displayed.
- Non-leader alliance information remains private.
- The public board displays leaders, leader card counts, timer, direction, round, and active rule.
- Private player screens display alliance assignments and private alliance-change notifications.
- The facilitator can record rounds, reverse direction, update leader card counts, and activate dynamic rules.
- A leader reaching zero cards ends the game immediately.
- At timeout, a leader-card difference below three produces a shared victory.
- If the difference is three or greater, the leader with fewer cards wins.
- Results appear on public and private screens with a victory animation.
- Post-game options include stay, leave, replay voting, public messages, and private messages.
- Consented email addresses become visible to the facilitator only after the game.
- Cloudflare D1 stores session and game state.
- Polling synchronises host, board, and private-player views.
