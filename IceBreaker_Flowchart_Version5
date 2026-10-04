# Icebreaker Flowchart - Version 5

English Markdown version of **IceBreaker_Flowchart_Version5.pdf**.

This file uses Mermaid flowcharts. Open it in a Markdown viewer that supports Mermaid to see the diagrams. Edit the text inside each `mermaid` block to change a step or a connection.

## Design perspectives

| Perspective | Main focus |
| --- | --- |
| Social | Let students choose how to take part. Questions are optional. |
| Technological | Use wristbands and shared screens to support interaction. Separate score calculation from public updates. |
| Spatial | Let students choose seats. Make screens and controls easy to see and reach. Keep paths clear. |
| Temporal | Keep the game moving. Offer no more than one question per round. Update public feedback at a suitable break. |

## 1. Join, choose a seat, and finish

```mermaid
flowchart TD
    A["Students enter the classroom<br/>The teacher introduces the activity"] --> B{"How would you like to take part?"}
    B -->|Other activity| C["Join the teacher's usual icebreaker activity"]
    B -->|Guest| D["Try as a Guest<br/>Guest answers are never saved"]
    B -->|Use the system| E["Get a wristband and open the join link<br/>Read what others can see<br/>and when data will be deleted"]
    E --> F{"Do you choose to connect LinkedIn?"}
    F -->|Yes| G["Import selected interest information"]
    F -->|No| H["Choose interest tags by hand"]
    G --> I["Check and confirm your interests<br/>Set your interest category"]
    H --> I
    I --> J["Choose any available table<br/>Colour is only a seating suggestion<br/>Different colours can sit together"]
    J --> K["After seating, calculate shared interests<br/>Use only available information<br/>that players agreed to use at this table"]
    K --> L["Play UNO at this table<br/>See Section 2"]
    D --> M["Follow the Guest joining flow<br/>See Section 4A"]
    M --> L
    L -->|Activity ends| N["Students choose whether to keep talking,<br/>make friends, form a group, or leave"]
    N --> O["After class, close the session<br/>Delete the saved activity data"]
```

**Wristband meaning**

- Colour shows an interest category. Also use text or a symbol.
- Shade shows shared interests with players at the same table.
- It does not show popularity or willingness to talk.
- A colour or shade change does not require anyone to move.

**Sharing and saving**

- Before sharing an answer, explain who can see it.
- Let the person choose whether to share it. Do not show their name with the answer.
- Do not treat a skipped or unanswered question as negative information.
- Never save Guest answers.

## 2. UNO game loop

```mermaid
flowchart TD
    A["Start a new round at this table<br/>Use normal UNO for the first round<br/>Reset the question flag"] --> B["The current player takes a turn<br/>Apply normal card effects"]
    B --> C{"Has someone used all their cards,<br/>or has the teacher ended the activity?"}
    C -->|Yes| D["End the activity<br/>Follow Section 1 to finish"]
    C -->|No| E{"Was a chosen action card played,<br/>and has no question been offered this round?"}
    E -->|Yes| F["Mark the question flag as used<br/>Open one optional question<br/>See Section 3A"]
    E -->|No| G["Record the turn as done<br/>Move to the next player<br/>Do not wait for an answer"]
    F -->|Keep playing right away| G
    G --> H{"Have all current players<br/>finished their turn in this round?"}
    H -->|No| B
    H -->|Yes| I["End the round at a natural break<br/>Check pending feedback<br/>Handle new players and optional table changes"]
    I --> J["Keep the current rule,<br/>or introduce one random extra rule gradually"]
    J --> A
```

**What counts as one round?**

A round ends when each current player has taken a turn, been skipped, passed, or left the table. A skipped turn counts as done. Remove a player who leaves from the turn order. A round does not mean that every player has used all their cards.

**Extra rules**

Introduce changes gradually: Hidden cards, Optional questions, Give a card, or Swap cards. The Optional questions rule does not require everyone to ask or answer a question.

## 3. Optional questions and wristband feedback

### 3A. Optional question - runs alongside the game

```mermaid
flowchart TD
    A["A chosen Draw or Skip card triggers a question<br/>The affected player gets one optional prompt"] --> B["Show the question on this table's shared screen<br/>Let the player choose what to do"]
    B -->|Answer| C["Give a short answer"]
    B -->|Change question| D["Choose another question"]
    D --> C
    B -->|Invite someone| E["Invite another willing player<br/>They choose whether to answer"]
    E -->|Accept| C
    E -->|Decline| B
    B -->|Skip| F["Close this prompt<br/>No extra game penalty<br/>Do not lower the shared-interest score"]
    B -->|Answer later| G["Keep playing<br/>Answer before your next turn"]
    G --> H{"Did you choose to answer<br/>before your next turn?"}
    H -->|Yes| C
    H -->|No| I["Close this prompt<br/>No extra penalty or lower score"]
    C --> J["Explain who can see the answer<br/>Share it only if the person chooses<br/>Do not show their name"]
    J --> K{"Is the person answering a Guest?"}
    K -->|Yes| L["Do not save the Guest answer"]
    K -->|No| M["Calculate shared interests at this table<br/>Keep the result for a later public update"]
    L --> N["Close the completed prompt<br/>Do not offer a second question this round"]
    M --> N
    F --> N
    I --> N
```

UNO continues on every path. Questions do not pause the game. Skipping or not answering is never used as negative interest information.

### 3B. Public wristband update

```mermaid
flowchart TD
    A["A new shared-interest result is waiting"] --> B{"Is it the end of a round<br/>or another natural break?"}
    B -->|No| C["Keep the result waiting<br/>Do not change public wristbands yet"]
    C -->|Check at the next natural break| B
    B -->|Yes| D{"Are students still talking?"}
    D -->|Yes| E["Let the conversation continue<br/>Delay the public update"]
    E -->|Check at the next suitable break| B
    D -->|No| F["Update the wristband shade<br/>Show shared interests at this table<br/>No one has to change seats"]
```

Private notifications may appear right away. Public wristband feedback waits for a suitable break. Calculating a result and showing it publicly are separate steps.

## 4. New players, tea breaks, and space

### 4A. Guests and late arrivals

```mermaid
flowchart TD
    A["A Guest or late student asks to join"] --> B["Wait until this table's round ends<br/>If a seat is free, they may sit and watch first"]
    B --> C{"Is there a free seat<br/>at the chosen table?"}
    C -->|No| D["Offer another table with a free seat,<br/>or let the student choose to wait"]
    D -->|Check the chosen table at a round break| C
    C -->|Yes| E["The student chooses a seat<br/>Join the next round<br/>They may stay as a Guest"]
    E --> F{"Would the Guest like to register?"}
    F -->|No| G["Keep playing as a Guest<br/>Do not save answers"]
    F -->|Yes| H["Explain and confirm how data is used<br/>Follow Section 1 to confirm interests<br/>Then include them in this table's comparison"]
```

### 4B. Tea breaks and optional table changes

```mermaid
flowchart TD
    A["The teacher starts a tea break<br/>at a suitable pause"] --> B["Pause this table's game"]
    B --> C["Students may talk, rest, or choose another table<br/>The screen may offer conversation topics<br/>No one has to answer or stop a conversation"]
    C --> D["The teacher ends the tea break"]
    D --> E["Check seats, current players,<br/>and the game's current state"]
    E --> F["For anyone who changed tables,<br/>compare interests with their new table"]
    F --> G["Continue the game<br/>Return to Section 2"]
```

**Space at each table**

- Provide one shared screen per table.
- Everyone should be able to see the question and comfortably reach the four corner controls.
- Show interest categories with text or symbols as well as colour.
- Keep paths clear and provide seats that are easy to use.
- Seat choices and table changes are voluntary.

**Details still to define**

The PDF does not set the exact shared-interest formula or wristband shade scale. Define these before implementation. Shared interests do not measure willingness to talk. Unanswered questions must not count as negative information.

## Scope of this file

This file translates the Version 5 PDF flow. It is a design flow, not a statement that every feature is connected in the current prototype. For example, LinkedIn remains an optional path in the PDF; the current prototype uses manual interest tags.
