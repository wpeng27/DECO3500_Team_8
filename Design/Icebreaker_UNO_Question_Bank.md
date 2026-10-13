# Icebreaker UNO Question Bank

The 10 questions used by the shared-screen prototype (Version 6). Players draw one after playing an action card. Each question has four options and players choose one. Questions focus on study habits and teamwork, so matching answers point to people who may work well together in a group assignment.

The prototype stores these in `QUESTIONS` in `Prototypes/icebreaker_UNO_Version6(shared_screen_Advanced)/lib/game.ts`. If you change a question here, change it there too.

| # | Topic | Question |
|---|---|---|
| 1 | Starting early | It's 3 weeks before a group assignment is due. Usually, you've… |
| 2 | Preferred role | In a group project, which task would you happily pick up first? |
| 3 | Working hours | When do you usually get uni work done? |
| 4 | Communication | How do you prefer your group to communicate? |
| 5 | Goals | What's your main goal for this course? |
| 6 | Unresponsive teammate | A teammate hasn't replied for 2 days and a deadline is close. You would… |
| 7 | First tutorial | In your first tutorial, you'd most like to… |
| 8 | Splitting work | Your group needs to split up the work. You'd prefer to… |
| 9 | Standards | It's the night before the deadline and your part is about 80% done. You'd most likely… |
| 10 | Feedback | If a teammate found problems in your part, how would you like to hear about it? |

## How questions are drawn

1. **When to draw.** Every card except a number card is an action card: Skip, Reverse, Draw Two, Wild and Wild Draw Four. The player who plays one presses **Played an action card? Draw a question** in their own corner. Only that player answers.
2. **Which question comes up.** The screen picks it, not pure chance:
   - It is always a question this player has **not answered yet**, so an earlier answer is never overwritten.
   - Among those, it prefers the question **the most other seated players have already answered**. If several are tied, one of them is picked at random.
   - Once a player has answered all 10, any question can come up again.
3. **Answer or skip.** After reading the question, the player either chooses an option and presses **Submit answer**, or presses **Skip question** (or ×) to close it without answering. A drawn question cannot be swapped for another one.
4. **Counting.** The table shares one count of drawn questions, answered or skipped. After every third, the extra rule changes automatically.

**Why it works this way:** a similarity score can only be calculated between two players who have answered the same question. A 10-minute game gives roughly 8–12 questions for the whole table, about 2–3 per player. With pure random drawing, around half of player pairs would end with no shared question. Steering players towards questions others have answered means almost every pair has 1–2 questions in common at the end.

## Questions and options

### 1. Starting early
It's 3 weeks before a group assignment is due. Usually, you've…

- A. Already started a draft
- B. Made a plan but not started
- C. Not started — I work best close to deadlines
- D. Depends on the course

### 2. Preferred role
In a group project, which task would you happily pick up first?

- A. Building / coding
- B. Research & writing
- C. Visual design
- D. Presenting & coordinating

### 3. Working hours
When do you usually get uni work done?

- A. Mornings
- B. Afternoons
- C. Evenings
- D. Late night

### 4. Communication
How do you prefer your group to communicate?

- A. Group chat, reply anytime
- B. One scheduled meeting a week
- C. Mostly face-to-face in tutorials
- D. Shared doc, minimal chatting

### 5. Goals
What's your main goal for this course?

- A. Aiming for a 7
- B. Learn well, grade comes second
- C. Just pass comfortably
- D. Pick up one specific skill

### 6. Unresponsive teammate
A teammate hasn't replied for 2 days and a deadline is close. You would…

- A. Message them privately
- B. Raise it in the group chat
- C. Quietly cover their part
- D. Let the tutor know

### 7. First tutorial
In your first tutorial, you'd most like to…

- A. Start the conversation myself
- B. Join in once someone else starts
- C. Listen first, talk later
- D. Chat online before meeting in person

### 8. Splitting work
Your group needs to split up the work. You'd prefer to…

- A. Each take one section and own it
- B. Work on everything together
- C. Have one person assign the tasks
- D. Pair up and split into halves

### 9. Standards
It's the night before the deadline and your part is about 80% done. You'd most likely…

- A. Submit it — good enough is fine
- B. Keep polishing until it feels right
- C. Send it to the group for feedback first
- D. Depends on how much it's worth

### 10. Feedback
If a teammate found problems in your part, how would you like to hear about it?

- A. Tell me directly, straight to the point
- B. Mention the good parts first, then the issues
- C. Leave comments in the shared doc
- D. Tell me privately, not in front of the group

## Notes for scoring

- None of these questions has a "Prefer not to answer" option, so every answer counts towards similarity. Players who don't want to answer can press **Skip question**.
- "Depends on the course" (Q1) and "Depends on how much it's worth" (Q9) are treated as ordinary answers. Two players who both choose them count as a match.
- Similarity between two players is `same answers / questions both answered`.
