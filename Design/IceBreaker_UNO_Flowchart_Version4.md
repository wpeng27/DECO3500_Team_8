# Ice Breaker Flowcharts - Version 4

DECO3500 - Ice Breaker Team Project

## 1. Main Flowchart

```mermaid
flowchart TD
    M1("At the start of the semester,<br/>students enter the classroom") --> M2("The teacher arranges self-selected grouping<br/>/ getting to know one another")
    M2 --> M3("Students choose how to participate")
    M3 --> M13("Participate in the teacher's<br/>original icebreaker activity")
    M3 --> M14("Try as a Guest")
    M3 -->|Use the system| M4("Receive a wristband<br/>(displaying personal status)")
    M4 --> M5("Join the system via a link")
    M5 --> M6("Authorise LinkedIn?")
    M6 -->|Yes| M7("Load information, calculate and record<br/>initial similarity")
    M6 -->|No| M15("Fill in interest-tag cards")
    M15 --> M7
    M7 --> M8("Wristbands display the same colour;<br/>students sit next to one another")
    M8 --> M9("The system plays music;<br/>formal icebreaking begins")
    M9 --> M10("Wristband: colour = category;<br/>shade = degree of belonging")
    M10 --> M11("UNO icebreaker game loop<br/>(see Section 2)")
    M11 --> M12("Icebreaking ends; students decide whether<br/>to make friends / form a group")
    M14 --> M11

    classDef system fill:#e0f3ed,stroke:#008366,color:#07584b;
    classDef physical fill:#efedff,stroke:#6554e8,color:#3c3695;
    classDef guest fill:#fbece5,stroke:#b94b26,color:#85351c;
    classDef general fill:#f8f7f3,stroke:#898781,color:#333333;
    classDef emphasis stroke-width:2px;
    class M5,M7,M9,M15 system;
    class M4,M8,M10 physical;
    class M14 guest;
    class M1,M2,M3,M6,M11,M12,M13 general;
    class M11 emphasis;
```

**Legend**

- Green: System action.
- Purple: Wristband / in-person action.
- Orange: Guest path.
- Neutral: General step / decision.

## 2. UNO Game Loop

The four listed rule options are alternatives: Blind Hand, Questions Only, Gift, and Swap.

```mermaid
flowchart TD
    U1("Everyone completes one round<br/>→ Randomly draw a rule")

    subgraph rule_options[" "]
        direction LR
        U2("Blind Hand")
        U3("Questions Only")
        U4("Gift")
        U5("Swap")
        U2 ~~~ U3 ~~~ U4 ~~~ U5
    end

    U1 --> U3
    U3 --> U6("Players play cards according<br/>to this round's rule")
    U6 --> U7("Was a Draw / Skip card played?")
    U7 -->|No| U8("Next player's turn")
    U8 --> U6
    U7 -->|Yes| U9("The player affected by the Draw / Skip card<br/>selects one preset question")
    U9 --> U10("The central screen displays the question;<br/>select answers at the four corners")
    U10 --> U11("Update similarity<br/>(do not record for Guests)")
    U11 --> U12("The wristband shade updates<br/>with the degree of belonging")

    style rule_options fill:transparent,stroke:transparent;
    classDef system fill:#e0f3ed,stroke:#008366,color:#07584b;
    classDef physical fill:#efedff,stroke:#6554e8,color:#3c3695;
    classDef general fill:#f8f7f3,stroke:#898781,color:#333333;
    class U1,U10,U11 system;
    class U2,U3,U4,U5,U9,U12 physical;
    class U6,U7,U8 general;
```

**Loop:** After everyone completes one round, return to the top and randomly draw another rule.

### Parallel Flow: Tea Break

```mermaid
flowchart LR
    T1("The teacher manually starts<br/>the tea break") --> T2("The screen displays<br/>topic prompts")
    T2 --> T3("The teacher ends the tea break;<br/>continue")

    classDef system fill:#e0f3ed,stroke:#008366,color:#07584b;
    classDef general fill:#f8f7f3,stroke:#898781,color:#333333;
    class T2 system;
    class T1,T3 general;
```

### Parallel Flow: Guest Joining

```mermaid
flowchart LR
    G1("Guest clicks 'Join'") --> G2("Queue and wait for<br/>this round to end")
    G2 --> G3("Officially join the system")

    classDef guest fill:#fbece5,stroke:#b94b26,color:#85351c;
    class G1,G2,G3 guest;
```
