Each entry records the project state at that point, the outcomes, and the next steps. The Week 9 entry comes from our stand-up document ([Project Update](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Icebreaker_UNO_Project_Update.md)). The later entries are written up from the repository history and our testing documents. **[TEAM: add the date and attendees of each internal stand-up, and any decisions that were made in person but are not recorded here.]**

## Week 9 stand-up (21 September 2026)

**State**

- **User research.** Interviews showed that the hard part of group formation is the first approach, not finding people. Students cannot tell who still needs a group, approaching a table risks a visible refusal, and reliability stays invisible until the project starts. An online looking-for-group thread had existed, but "barely anyone used it".
- **Experience requirements.** Seven requirements, ER1–ER7, including a legitimate reason to interact (ER1), keeping the game's rhythm (ER2), passing without penalty (ER4) and contact that is never automatic (ER7).
- **Early prototype: Iteration 1 (V1).** A five-player companion app with a facilitator view, a public board and a private phone view. Players were secretly split into red and blue alliances, and a random rule appeared every three rounds.
- **Evaluation.** A formative playtest and design review ([notes](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Design_Review_Notes.md)).

**Outcomes**

- A question on every turn stalled the game: "eventually it felt easier to stop playing and just chat".
- Questions should be tied to UNO action cards, and players should be able to change the topic or pass.
- Alliances, public leaders and secret switching added complexity without helping the first conversation, so we decided to remove them.

**Next steps**

- Rewrite the rules so that a question appears only when an action card is played.
- Build the next prototype around optional questions and familiar UNO play.
- Test with target users whether the revised design keeps the game's pace and feels low pressure.

## Check-in: 22 September – 8 October

**State**

- Five cooperative interaction rules: Blind Hand, Questions Only, Gift, Swap and Team Round ([core rules](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Design/Icebreaker_UNO_Core_Rules.md)).
- Iteration 2 (V2): side prototypes for card swapping and atmosphere, and reference lists on games and music as low-pressure activities.
- Iteration 3 (V5): interest tags, Guest mode, optional questions and simulated colour wristbands, with [flowcharts](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Design/IceBreaker_UNO_Flowchart_Version5.md).
- Iteration 4 (V5.5): one shared screen with a corner per player, plus an optional microphone quiet detector.
- [Feature test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Feature_Test_Feedback.md) (4 participants) and [interaction test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Interaction_Test_Feedback.md) (3 participants).

**Outcomes**

- The activity made talking easier, and being able to skip made people comfortable.
- The difference between colour and shade was confusing.
- Attention was split between phones and the shared display, and a watching tutor made the activity feel assessed. We moved the table onto one shared screen with no host role.

**Next steps**

- Start Iteration 5 (V6) from the shared-screen design.
- Replace general interest questions with questions about study habits and teamwork.
- Compare a questions-only round with UNO plus questions.

## Check-in: 9 – 17 October

**State**

- Repository restructured and file names standardised.
- [Comparative test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker_UNO_Comparative_Testing_Feedback.md) (3 participants).
- Iteration 5 (V6) core gameplay: ten teamwork questions, a 10-minute timer, action-card questions, a rule change after every third answer, Submit and Skip buttons, Pause, and handling for leaving, skips and duplicate names.
- Optional phone screens and a QR code for joining.
- First drafts of the poster texts.
- The repository was restored to a working version after accidental commits on 15 October.

**Outcomes**

- All three participants found UNO more relaxed than questions alone ("The questions only round felt a bit like an interview"), but harder to listen and follow up while playing. Pause lets a conversation continue without the next turn cutting it off.
- On the preferred-role question, different answers now count as a match, because a team needs complementary roles.
- With only one shared question, results show the answers instead of a percentage.

**Next steps**

- Run a final prototype test with the phones and the shared screen together.
- Finish the poster and align its texts with V6.
- Deploy V6 so it can be used without installing anything.

## Check-in: 19 – 22 October

**State**

- [Final prototype test](https://github.com/wpeng27/DECO3500_Team_8/blob/main/Feedbacks%28Testing%29/Icebreaker%20UNO%20Final%20Prototype%20Feedback.md) (3 participants).
- Final poster and interaction flow diagram.
- V6 deployed at https://icebreaker-uno-v6.zhifeng-cheng.workers.dev, and the README rewritten with usage instructions.
- Design Process Overview and Ethical Considerations published on the WIKI.

**Outcomes**

- Participants understood the results as a starting point for conversation, and the guest and skip options made them feel in control.
- The rules screen now says that skipping never counts against a player, and the results say that they show shared answers, not teamwork fit.
- Phones now show each player's results at the end, and the far-side seats show the current rule and time in their own corners.


# Team Meeting Minutes

## Team Meeting | August 11: Domain Selection and Next Steps

### Decisions

The team selected **social anxiety** as the main research domain. Existing literature will guide further exploration of target users, specific social situations, and opportunities for social and mobile computing.

### Progress

- **Domain selected.** The team agreed on social anxiety, although the scope still needs to be narrowed to specific users and contexts.
- **Initial literature reviewed.** Relevant papers have been collected, with research insights and corresponding design implications identified.
- **Design opportunities remain open.** The findings need to be translated into opportunities that explain whom the design supports, what interactions it enables, and which problems it addresses.
- **Time and space classifications remain incomplete.** Opportunities need to be considered in terms of synchronous/asynchronous and co-located/distributed interaction.
- **GitHub repository established.** The repository will hold literature analysis, meeting minutes, design materials, and key project decisions.

### Focus for the Next Meeting

Narrow the research context, discuss initial design opportunities, and develop a concept direction for further discussion and presentation.

---

## Team Meeting | August 13: Domain Refinement and Initial Concept

### Decisions

The team narrowed the domain to students forming assessment groups with unfamiliar classmates at the beginning of a semester. An initial concept was proposed: a course-specific, time-limited matching forum for UQ students, supporting low-pressure contact before the first tutorial.

### Progress

- **Target users and problem clarified.** The focus is students in courses with group assessment, particularly first-year students, international students, and students without existing connections in the course. They want reliable groupmates but may hesitate to initiate contact.
- **Three core values identified.** Predictability, autonomy, and gradual self-disclosure will guide the design.
- **Initial design opportunity developed.** Asynchronous, low-pressure introductions tied to a specific course and tutorial slot could help students meet potential teammates before class.
- **Time and space characteristics identified.** Online contact is asynchronous and distributed; meeting during the first tutorial is synchronous and co-located.
- **Concept and initial competitor comparison completed.** Candidate features include tutorial-specific spaces, anonymous participation, a one-to-two-week opening window, and a handoff card showing the first tutorial’s time and room. Ed Discussion, course Facebook groups, Study Together, StudyBuddy, and Focusmate were considered.

### Focus for the Next Meeting

Review the design opportunities, identify unresolved concept questions, and refine presentation content and task allocation.

---

## Team Meeting | August 18: Interview Preparation and Initial Prototype Ideas

### Decisions

Following the interview lecture, the team agreed to investigate students’ social pressure, group formation difficulties, and needs through specific experiences and stories. Candidate features and prototype ideas were discussed, but formal prototype design had not started.

### Progress

- **Draft interview questions developed.** Topics include joining unfamiliar groups, avoiding social activities, group project experiences, and difficulties seeking support.
- **Interview focus clarified.** Questions will explore how students communicate, coordinate, and learn about others, including how time and location affect interaction.
- **Candidate features collected.** Ideas include course-and-slot-specific spaces, progressive identity disclosure, interest and working-style tags, structured icebreaker prompts, a limited opening window, meeting cards, an optional campus map, group-seeking status, and private spaces after group formation.
- **Initial prototype approach discussed.** The prototype could simulate multiple users posting, discovering potential teammates, making contact, and meeting in person.
- **Team Charter completed and uploaded.**
- **Initial Design Proposal drafted.** The draft brings together the background, target audience, values, design opportunities, and initial concept for tutor feedback.

### Focus for the Next Meeting

Confirm the interview guide and recruitment responsibilities, discuss tutor feedback on the Design Proposal, and identify questions that need investigation before prototype design.

---

## Team Meeting | August 20: Interview Questions Finalised and Work Plan Revised

### Decisions

The team prioritised interviews and temporarily paused prototype development. Each member will conduct one interview. The previous work plan was replaced with a research-led approach, allowing user needs to guide the design direction and prototype format.

Interviews, initial analysis, and Design Proposal revisions must be completed **before Week 5 begins**.

### Progress

- **Interview questions finalised and uploaded.** The six themes are group formation context, the formation process, decision-making, hesitation and concerns, information needs, and additional experiences.
- **Interview approach and responsibilities confirmed.** Each member will explore a recent experience of forming a group with unfamiliar classmates, using follow-up questions to understand actions, decisions, and feelings.
- **Design direction remains provisional.** Course-specific spaces, anonymity, a limited opening window, and handoff cards remain candidate features to be assessed against research findings.
- **Tutor feedback documented.** The following revisions were identified:

| Area | Planned revision |
|---|---|
| Less text, more visuals | Use scenarios and diagrams to explain the problem and concept. |
| Interview findings | Add actual findings after the target audience section once interviews are completed. |
| Strengths | Highlight the team’s main strengths and potential contributions on the opening page. |
| Social and mobile computing | Explain how social interaction, time, and location relate to the user experience. |
| “Why this matters” | Explain the specific group formation difficulties, their impact, and why they deserve attention. |
| “Going too far” | Reduce premature feature development and confirm needs before committing to a solution. |
| Page three structure | Present the target audience before the values. |

### Focus for the Next Meeting

Combine interview records, discuss shared needs and differences, reconsider feature priorities, and check how the revised Design Proposal addresses tutor feedback.

---

## Team Meeting | August 25: Design Proposal Presentation and Feedback

### Decisions

The team delivered the Design Proposal presentation. Following tutor feedback, the team decided to focus more closely on the group formation process and investigate which interactions could reduce pressure, without restricting the solution to an app.

### Progress

- **Proposal presented.** The presentation covered the domain, target audience, interview and observation findings, values, initial concept, and work plan.
- **Existing findings summarised.** Group formation can feel unstructured and unpredictable; existing relationships influence choices; students often discover teammates’ abilities and working habits only after collaboration begins.
- **Tutor feedback received.** Student profiles and group finders were considered familiar directions. The team needs to explain their social and contextual contribution and how they enable low-pressure interaction.
- **Research questions reconsidered.** The focus will shift from whom students eventually team up with to how they approach, communicate, and gradually form groups.
- **Solution scope reopened.** Further research and literature review will support exploration beyond an app-based solution.

### Focus for the Next Meeting

Discuss revised interview questions, examine pressure and interaction needs throughout group formation, and explore design directions beyond apps.

---

## Team Meeting | August 27: Revised Interview Questions Finalised

### Decisions

Following tutor feedback, the team finalised a revised interview guide covering connections formed during group formation and relationships beyond assessment teams. The revised questions had not yet been used in interviews.

### Progress

- **Teammate judgement question broadened.** “What information would help” was changed to “What would help,” avoiding an exclusive focus on profile information.
- **Relationship development question added.** The guide asks whether students have stayed in contact or become friends with someone they met while forming groups, even without becoming teammates.
- **Approaching classmates question added.** The guide explores wanting to meet a classmate but feeling unsure because there is no clear reason to start a conversation.
- **Interaction outside the group question added.** Students will be asked whether they continue interacting with classmates outside their team after groups are formed, and why.
- **Revised guide completed.** Three themes were added to the original six, creating a nine-theme interview guide. Changes were recorded in GitHub.

### Focus for the Next Meeting

Confirm participants and interview arrangements, conduct interviews using the revised guide, and subsequently analyse the experiences collected.

---

## Team Meeting | September 1: Idea Organisation and Additional Research Methods

### Decisions

Following tutor advice, the team established a Miro board to collect and discuss ideas. The team agreed to continue a new round of interviews and introduce a questionnaire and storyboards to explore user needs and interaction contexts.

### Progress

- **Miro board established.** It will support idea sharing, discussion records, and comparison of design directions.
- **Further interviews agreed.** The revised questions will explore communication barriers, pressure, and relationship development during group formation.
- **Questionnaire proposed.** It will collect additional accounts of group formation experiences and social concerns alongside the interviews.
- **Storyboards proposed.** Concrete scenarios will help the team discuss where the design could intervene and what experience it might create.

### Focus for the Next Meeting

Confirm interview and questionnaire arrangements, discuss storyboard scenarios and key interactions, and continue organising ideas on Miro.

---

## Team Meeting | September 3: Analysis from Multiple Design Perspectives

### Decisions

The team analysed group formation through social, spatial, temporal, and technological perspectives. Ideas were treated as initial design assumptions requiring further research.

### Progress

- **Social perspective.** Discussed low-pressure expressions of interest before face-to-face contact and presenting neutral working preferences rather than grades or ability rankings.
- **Spatial perspective.** Considered how seating proximity influences contact and how table numbers or agreed meeting points could support the transition to face-to-face interaction without precise location tracking.
- **Temporal perspective.** Distinguished preparation before class from information requiring real-time updates during group formation. Opening windows, gentle reminders, and continuing relationships were also discussed.
- **Technological perspective.** Considered availability indicators, remaining group places, immediate invitation updates, and voluntary information sharing. Privacy preferences remain untested.
- **Implementation options kept open.** Personal and shared devices were discussed without committing to a final platform or feature set.

### Focus for the Next Meeting

Use further interviews and the questionnaire to investigate these assumptions, identify key interactions, and represent concrete situations through storyboards.

---

## Team Meeting | September 8: Exploring Methods and Creating Storyboards

### Decisions

Following feedback, the team identified a need for more concrete interaction methods and usage scenarios. Members developed different approaches and represented them through storyboards.

### Progress

- **Gaps reviewed.** Discussion focused on how the design could reduce social pressure and fit actual classroom situations.
- **Ideas generated collaboratively.** Members discussed possibilities and then developed individual interaction approaches.
- **Storyboards completed.** Each approach was illustrated through its context, student actions, key interactions, and intended experience.
- **Multiple directions retained.** The storyboards support concept exploration; a final solution has not been selected.

### Focus for the Next Meeting

Compare the storyboards in terms of context, social value, and feasibility, then select directions for further development.

---

## Team Meeting | September 10: UNO Icebreaker Direction Selected

### Decisions

Based on tutor feedback and relevant literature, the team selected UNO as the basis for an icebreaker activity, using shared gameplay to create opportunities for unfamiliar classmates to interact.

### Progress

- **Icebreaker direction selected.** The design will help students become familiar with one another through play before formal group formation.
- **Initial concept developed.** Discussed combining UNO interactions with opportunities to get to know classmates and reduce the pressure of finding conversation topics.
- **Basic flow and rules outlined.** Considered joining, rule explanation, gameplay, and ending the activity, with possible adjustments for classroom use.

### Focus for the Next Meeting

Refine the flow and rules, identify interactions that could encourage conversation, and discuss creating an initial prototype.

---

## Team Meeting | September 15: UNO Rules Refined and Initial Model Created

### Decisions

The team refined the UNO activity’s flow and rules and created an initial model to make the concept easier to demonstrate and discuss.

### Progress

- **Rules refined.** Clarified basic gameplay, turn order, and icebreaker triggers while considering the balance between smooth play and conversation opportunities.
- **Activity flow developed.** Outlined the process from joining and learning the rules to playing and ending the activity.
- **Initial model created.** Built a first version representing the core gameplay and interactions, ready for trial and adjustment.

### Focus for the Next Meeting

Try the initial model, check whether the rules are understandable and the flow is smooth, and assess whether icebreaker interactions encourage natural conversation.

---

## Team Meeting | September 17: First User Test and Rule Adjustments

### Decisions

The team conducted the first round of user testing and used feedback to revise the initial model. The main rules will be simplified, with alternative interactions explored.

### Progress

- **First user test conducted.** Collected feedback on gameplay, rule comprehension, and interaction experience.
- **Revisions identified.** Reviewed difficulties affecting understanding and gameplay flow.
- **Main rules simplified.** Reduced complex requirements to make the activity easier to learn and leave more room for conversation.
- **New approaches proposed.** Discussed alternative icebreaker interactions for later trial and comparison; these have not been finalised.

### Focus for the Next Meeting

Try the simplified rules and alternative interactions, compare their effects on gameplay and conversation, and continue refining the model.

---

## Team Meeting | September 22: Music-Based Model Trial and Flow Revision

### Decisions

The team tried a music-centred model retaining only switching between five rules. After the tutor described it as too limited and similar to a “teleprompter,” the team immediately abandoned this approach and combined earlier ideas into a new activity flow.

### Progress

- **Music-based model explored.** Considered music’s potential to create atmosphere, provide shared topics, and encourage interaction, alongside relevant literature searches.
- **Rules simplified.** Reduced the model to switching between five rules to lower learning and memory demands.
- **Tutor feedback received.** The system mainly displayed and switched rules, offering insufficient technological support for social interaction. Music might help, but could not justify the overall approach.
- **Direction changed immediately.** Revisited previous interaction ideas and combined useful elements into a revised flow.
- **Technology’s role reconsidered.** Discussed how the system could participate more directly in gameplay, coordination, and interaction.

### Focus for the Next Meeting

Review the revised flow and interactions, try them in practice, and continue adjusting how they support conversation.

---

## Team Meeting | September 24: Gameplay Redesign and Prototype Development

### Decisions

The team redesigned the overall game flow, explored additional functions, and proposed introducing wristbands. Development will move towards an interactive prototype for Week 10 feedback.

### Progress

- **Game flow redesigned.** Reviewed the sequence and transitions between stages, including rules and icebreaker interactions.
- **Additional functions explored.** Discussed how technology could participate more directly in gameplay and support coordination.
- **Wristband concept proposed.** Considered wristbands as a possible interaction device; their functions and implementation remain undecided.
- **Prototype expectations clarified.** Following the tutor’s reminder, the team needs an interactive prototype for Week 10 rather than a conceptual demonstration alone.

### Focus for the Next Meeting

Check the revised flow and wristband feasibility, define core prototype functions and responsibilities, and prepare for Week 10.

---

## Team Meeting | September 28: Framework Review and Prototype Preparation

### Decisions

The team revisited the design framework through social, technological, spatial, and temporal perspectives, examining their relationships and preparing an interactive prototype.

### Progress

- **Framework analysis developed.** Members took responsibility for different perspectives on Miro and reviewed the analysis together.
- **Relationships between design elements examined.** Discussed how wristband colours could affect inclusion, same-colour seating could limit interactions, and frequent questions or rule changes could interrupt conversation.
- **Space and pacing considered.** Reviewed screen visibility, access to controls, and suitable moments for changing tables.
- **Prototype work allocated.** Discussed development responsibilities and ways to implement wristband feedback using the current flow and framework analysis.

### Focus for the Next Meeting

Try the interactive prototype, check its consistency with the framework analysis, and assess device and feedback options.

---

## Team Meeting | October 6: Shared-Screen Prototype and Feedback

### Decisions

The team discussed the shared-screen prototype and testing feedback, continuing to refine operations and explore quiet detection and clearer interaction prompts.

### Progress

- **Flow and instructions updated.** Version 5 flowcharts were prepared, and the prototype’s English instructions were simplified.
- **Shared-screen prototype created.** Multiplayer status, questions, and controls were brought together to support interaction around a table.
- **Quiet detection trial added.** Explored prompting when conversation stalls; its usefulness still requires testing.
- **Prototype feedback documented.** Reviewed question submission, ending turns, and rule operations, with feedback recorded in GitHub.

### Focus for the Next Meeting

Improve the prototype using feedback, discuss colour changes and wristband alternatives, and refine question content.

---

## Team Meeting | October 8: Version 6 Adjustments and Question Refinement

### Decisions

The team continued revising Version 6, focusing on shared-screen readability, teamwork questions, colour feedback, and using phones to simulate wristbands.

### Progress

- **User testing results organised.** Uploaded testing records to GitHub to inform revisions.
- **Interface improved.** Adjusted seat colours, player text size, and colour blending to improve visibility.
- **Question bank revised.** Added questions about team strengths, working preferences, and responses to pressure, while discussing clearer and less demanding answer options.
- **Phone simulation explored.** Considered colour displays and feedback through phones, with functions still under development and trial.
- **Literature support expanded.** Reviewed similarity and social connection research, recognising that similar answers do not necessarily indicate compatibility.

### Focus for the Next Meeting

Refine questions and feedback, check rules and operations, and prepare prototype and poster materials.

---

## Team Meeting | October 13: Rule Refinement and Similarity Mechanism

### Decisions

Following tutor feedback, the team agreed to clarify questions and answers, define automatic rule changes and ending conditions, and examine edge cases involving limited responses.

### Progress

- **Feedback priorities identified.** Questions and options need more specific wording, while opening instructions and the overall flow need clarification.
- **Gameplay mechanism refined.** Action cards trigger questions; every three answered questions trigger an extra rule change. The activity ends after ten minutes or when a player runs out of cards.
- **Similarity presentation reviewed.** Discussed cases where players share very few answered questions, avoiding a potentially misleading percentage based on only one question.
- **Further development planned.** Continue improving question selection, interface prompts, edge-case handling, and phone functions.
- **Poster tasks allocated.** Organise domain, opportunity, solution, and user evidence content, including explanations of social/collaborative and mobile/contextual aspects.

### Focus for the Next Meeting

Check the revised flow, similarity presentation, and phone interaction, and ensure the poster accurately represents the system.

---

## Team Meeting | October 15: System Refinement and Final Exhibition Preparation

### Decisions

The team agreed to focus subsequent work on the system, phone interaction, and exhibition materials. Members will coordinate through group chat and GitHub to complete revisions before the exhibition.

### Progress

- **Presentation gaps identified.** The poster needs clearer explanations of system operation, similarity calculation, rule changes, and ending conditions.
- **Design explanations organised.** Prepared material on feature improvements and similarity calculation, checking consistency between the poster and prototype.
- **Follow-up tasks confirmed.** Refine scenarios, user evidence, phone access, and flowcharts, and prepare the demonstration.

### Follow-Up Actions Before October 20

- **Refine the poster.** Add before-and-after scenarios, a flowchart, and user quotations; reframe the problem as an opportunity; and unify the layout and visual assets.
- **Improve phone access.** Add QR-code joining, check layouts and device connections, and document phone testing.
- **Complete research materials.** Upload supplementary interviews and user evidence, explaining how feedback was collected and influenced the design.
- **Prepare the exhibition.** Check rules, ending conditions, and similarity explanations; allocate speaking roles; and arrange poster printing and the demonstration.





**Next steps**

- Fill in the remaining **[TEAM: …]** items on the Ethical Considerations page, especially recruitment and consent.
- Add images to the Design Process Overview.
- Export the Design Process Overview and Ethical Considerations pages as `TeamName_3DesignPrototype.pdf` by 3pm Monday, Week 13.
- **[TEAM: add the outcomes of the Week 12 tradeshow.]**
