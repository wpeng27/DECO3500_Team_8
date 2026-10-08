# Icebreaker — Refined UNO Concept

A Digitally Augmented Physical UNO Experience for University Group Formation

Icebreaker is a digitally augmented use of the familiar physical card game UNO, designed to create structured, low-stakes opportunities for unfamiliar university students to interact before forming assignment groups. Students play physical UNO while a digital system periodically introduces temporary social rule changes that encourage communication, coordination and cooperation. Colour-changing wearable devices provide ambient awareness of whether students are open to joining a group, currently playing, or have organised a group.

## 1. Design Opportunity

When students are asked to self-form assignment groups, the difficulty is not always finding classmates. The difficult part can be approaching unfamiliar people while not knowing whether they already have a group, whether they are open to being approached, or what to say.

- Do they already have a group?
- Are they open to another person joining?
- Who should I approach?
- How do I start the interaction?
- Does talking to them mean I am already committing to their group?

Icebreaker does not attempt to identify the “best” teammates. Instead, it asks: How can a shared, familiar activity create opportunities for unfamiliar students to interact before they decide whether to form a group?

## 2. Why Use UNO?

UNO provides a familiar physical activity around which interaction can occur. The project does not redesign UNO itself; the novel contribution is the social-computing layer added around the physical game.

Using a familiar base game can reduce the amount of new game logic participants need to learn. The prototype should still provide a short explanation so that prior UNO experience is not required.

The design hypothesis is that focusing attention on a shared activity may reduce some of the pressure associated with initiating unstructured conversation. This should be evaluated with users rather than assumed to be true.

## 3. Two Connected Components

### Physical UNO = Shared Interaction

Students physically deal, draw, place and respond to UNO cards. Conversation can begin around the activity rather than requiring personal introductions or forced self-disclosure.

### Digital System = Social Orchestration

A screen or web application periodically changes the current game conditions. These temporary rules are designed specifically to produce communication, cooperation, dependency or playful disruption.

### Wearable = Ambient Awareness

Each student wears a small colour-changing device that communicates their current group-formation availability.

- Green — Open: looking for a group.
- Yellow — Playing: currently participating in an Icebreaker game.
- Blue — Grouped: group has been organised.

## 4. Entering the Experience

Students receive or activate their wearable when group formation begins. A student can see other green indicators in the room and identify classmates who are also open to grouping. Students can then sit at an Icebreaker table and begin playing without having to immediately ask personal or group-membership questions.

When a student joins an active Icebreaker game, their wearable changes from green to yellow. Yellow describes an activity state rather than a judgement such as “considering these people.”

The specific trigger moment for this experience is the period immediately after group formation is announced, when students who have not yet joined a group remain in place, unsure what to do next. This moment is not created by the design; it already occurs whenever a course requires self-selected group formation. Icebreaker tables can also be positioned near the classroom entrance during the pre-tutorial waiting window, when students are arriving and not yet seated, extending the same principle to another naturally occurring lull.

## 5. Base Game

The underlying physical game remains recognisable UNO. Students are dealt cards and play according to the normal base rules used by the prototype. The digital system does not continuously replace these rules; instead, it introduces short temporary modifications and then returns the table to the base game.

NORMAL UNO → DIGITAL RULE CHANGE → SOCIAL INTERACTION → RETURN TO UNO → NEXT RULE CHANGE

## 6. Dynamic Rule Changes

The central computing component periodically introduces temporary rules. The rules should not be random only for novelty; each should have a social purpose.

### Cooperation Rules

- Team Round — Individual winning pauses. The table must get every player's hand below a target number of cards before the timer ends.
- Shared Goal — Complete a table-wide objective before normal UNO resumes.
- Save Another Player — Use a temporary ability to help another player avoid drawing cards.

### Information Dependency

- Blind Hand — Hold your cards facing outward so everyone except you can see them. Other players must help you decide what you can play.
- Guide the Player — One participant receives limited information and must rely on the group to make their next move.

### Communication Changes

- Silent Round — No speaking for a short period; players must communicate through gestures and the physical game.
- Questions Only — For a short period, players may communicate only using questions.
- Partner Decision — Two players must agree before either can complete their next turn.

### Card Exchange and Interaction

- Gift — Give one card to another player that you think may help them.
- Swap — Exchange a selected card or hand with another player when the temporary rule allows it.
- Opposite Partner — Work with the player opposite you until the rule expires.

## 7. Temporary Player Roles

Some digital events can assign temporary roles so that players depend on one another rather than playing independently.

- Dealer — Only this player may draw cards for the table during the role period.
- Rule Keeper — Interprets the current temporary digital rule for the table.
- Switcher — Can change an active condition once during the round.
- Rescuer — Can cancel one penalty or incorrect action for another player.

These roles are intended to create small reasons to ask for help, give help, coordinate decisions and pay attention to other players.

## 8. Physical Special Pieces

To ensure the physical component remains meaningful, Icebreaker can add a small set of project-specific physical tokens or special cards alongside the UNO deck. These pieces interact with the digital layer rather than replacing the UNO cards.

- TEAM-UP token — Place it between two players to activate a cooperative turn.
- RULE BREAKER token — Place it on the reader to cancel the current temporary rule once.
- HELP token — Give it physically to another player to activate a supportive action.
- TABLE CHALLENGE token — Place it in the centre to trigger a group objective.

Players therefore physically give, receive, move and place objects as part of the augmented experience.

### Traces Wall (Shared Memory Wall)

A small whiteboard or pinboard is placed near the Icebreaker tables. After a table resolves a temporary rule — for example, by using a RULE BREAKER token — the digital system prompts the table with a simple question such as "How did you solve it?" Students can pin an anonymous note describing their approach. No note is designated as "best"; any student may place a small sticker next to a note they find interesting. This keeps the wall a shared, low-pressure record of collective experience rather than a ranked leaderboard, and extends the existing token-triggered interaction pattern into an asynchronous trace that later students can see.

### Recognition Stickers

To reinforce cooperative behaviour rather than individual speed, a small non-competitive sticker can be awarded in two situations: when a table successfully completes a Team Round or Shared Goal, and when a student uses a HELP token to assist another player. Stickers are given to everyone involved, not to a single winner, and are not tied to finishing the card game first. The intent is to make cooperative and supportive behaviour visible and appreciated, without introducing an additional competitive incentive.

## 9. Computing and Physical Interaction

A stronger proof of concept creates a two-way relationship between the computer and the tabletop activity. Selected project-specific tokens or special cards could contain NFC/RFID tags and be detected by a reader built into the play area.

DIGITAL RULE → PHYSICAL UNO PLAY → HUMAN INTERACTION → PHYSICAL TOKEN ACTION → DIGITAL RESPONSE

For example, the screen announces a difficult temporary rule. A player places the physical RULE BREAKER token on the reader. The system detects the token, provides feedback, and removes the rule. Not every UNO card needs to be electronically tracked; the key interaction can be demonstrated using a small number of instrumented pieces.

## 10. Wearable System

The wearable communicates availability, not compatibility or performance. The game should never automatically decide that participants should become a group.

- Green — Open to meeting potential group members.
- Yellow — Currently playing/occupied in an Icebreaker interaction.
- Blue — Group organised.

At the end of a game, the student decides whether to return to green, continue playing, or change to blue after they have independently organised a group. The technology communicates the student's state; it does not choose teammates for them.

## 11. Ambient Awareness

The wearable introduces an ambient-awareness layer to the classroom. Rather than repeatedly asking classmates whether they are still looking for a group, students can see an intentionally simple status signal. A key evaluation question is whether this actually makes approaching classmates easier or whether public status creates new social pressure.

## 12. Complete User Journey

GROUP ASSIGNMENT ANNOUNCED  
↓  
Students activate wearables  
↓  
GREEN — Open to group  
↓  
Student notices other available students  
↓  
Join an Icebreaker UNO table  
↓  
YELLOW — Playing  
↓  
Physical UNO begins  
↓  
Digital system introduces a temporary social rule  
↓  
Players talk, exchange cards/tokens, coordinate or cooperate  
↓  
Normal UNO resumes  
↓  
Further rule changes create different interactions  
↓  
GAME ENDS  
↓  
Student decides what they want to do  
↓  
GREEN: meet others / YELLOW: keep playing / BLUE: group organised

## 13. Low-Pressure Design Hypothesis

Icebreaker should not claim that UNO automatically makes group formation low pressure. Instead, the prototype tests several mechanisms that may reduce pressure.

- Structured initiation — joining a game provides a clear reason to approach other students.
- Shared focus — attention can initially be directed toward UNO rather than personal self-presentation.
- Conversation scaffolding — game events create immediate topics and reasons to speak.
- No forced self-disclosure — players are not required to answer personal icebreaker questions.
- No immediate commitment — playing with someone does not mean agreeing to form an assignment group with them.
- Gradual interaction — participants can move from simple play to communication, coordination and cooperation.
- Familiar foundation — using a recognisable card game may reduce the learning burden compared with introducing an entirely new game.

## 14. Risks and Design Questions

- Competition could increase pressure for some participants. Cooperative digital rounds should balance normal competitive UNO play.
- Players unfamiliar with UNO may feel excluded. Provide a quick, visible explanation of the base rules.
- Too many digital interruptions could make the game frustrating. Rule changes should be short and purposeful.
- Yellow status must not imply that a player is evaluating the people at their table.
- Public wearable status may create unwanted visibility. Test whether participants feel comfortable displaying it.
- The game must remain optional; students should not be forced to participate in order to form a group.

## 15. Research Questions

Primary question:

How can a digitally augmented familiar card game support low-stakes interaction between unfamiliar students during self-selected group formation?

Secondary questions:

- How do temporary cooperative and communication-based UNO rule changes affect interaction between unfamiliar students?
- Does having a shared physical activity reduce the perceived difficulty of initiating interaction?
- How might ambient wearable signals affect uncertainty about classmates' group-formation availability?
- Which rule changes encourage natural communication, and which feel forced or uncomfortable?
- Does switching between competitive and cooperative play affect participants' comfort with one another?

## 16. Prototype Plan

The next prototype can remain relatively low fidelity while testing the core social experience.

- One standard physical UNO deck.
- A laptop or tablet displaying temporary digital rule changes and timers.
- A small set of printed Icebreaker-specific physical tokens or special cards.
- Four mock wearable devices using coloured LEDs, programmable devices, or simple colour indicators.
- Optional NFC/RFID reader and tagged Icebreaker tokens for one or two tangible computer interactions.

Test with approximately four participants who do not know each other well. Present the scenario that they are in a tutorial where they will need to form assignment groups, then observe their behaviour without telling them that the system is expected to reduce anxiety.

Observe whether conversation begins naturally, which rules create interaction, whether participants help one another, whether competition creates tension, whether the digital interruptions are enjoyable or annoying, whether the wearable makes approachability clearer, and whether participants report feeling more comfortable interacting after the session.

## 17. Concept Summary

Icebreaker is a digitally augmented use of physical UNO that creates structured opportunities for unfamiliar university students to interact before forming assignment groups. Students play a familiar card game while a digital system periodically introduces temporary cooperative, communication-based and dependency-based rule changes. These interventions encourage participants to respond to one another, exchange physical pieces, coordinate decisions and occasionally work toward shared goals. Colour-changing wearables provide ambient awareness of whether students are open to grouping, currently playing, or have organised a group. Icebreaker does not match students, evaluate compatibility or require personal disclosure; students remain responsible for deciding whether and with whom they form a group.

Core design logic: UNO provides the shared activity; the computer orchestrates changing social interactions; physical special pieces connect the tabletop activity back to the computing system; and the wearable provides ambient group-formation awareness.
