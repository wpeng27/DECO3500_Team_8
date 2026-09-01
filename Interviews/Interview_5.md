# Interview 5 — Observations

**Context:** Semi-structured interview exploring students' experiences of forming course groups with classmates they did not know well.

---

## 1. Anxiety vs. Last-Minute Avoidance Behavior

The interviewee explicitly reported feeling anxious from the outset ("I was so anxious"), yet still delayed action until the professor was about to assign remaining students to groups — at which point they approached a nearby classmate out of necessity.

This supports the design assumption behind the **time-limited active window**: simply providing a tool for early connection may not be enough. A nudge or deadline-driven mechanism may be needed to counteract avoidance-driven procrastination, since users may not act on the tool until forced to.

---

## 2. "Invisible Sense of Oppression" — A More Specific Pain Point Than General Stranger Anxiety

This is the most notable finding in the interview. The interviewee reported actively **avoiding classmates who spoke very fluent English**, describing this as producing an "invisible sense of oppression."

This is not generic social anxiety toward strangers — it's a form of **status anxiety rooted in perceived competence gaps**, particularly relevant for international students, where language fluency becomes an implicit evaluative dimension that causes self-screening and withdrawal before any real interaction occurs.

> **Design implication:** This insight can directly strengthen the persuasiveness of the Wei persona on Slides 2/3, and further supports the **progressive anonymity** design logic. If first impressions are typically formed through verbal/spoken interaction, then an anonymous or semi-anonymous text-based icebreaking stage could delay fluency-based judgment and give users a buffer period before being evaluated on spoken language performance.

---

## 3. Superficial Selection Criteria with an Underlying Desire for Risk Mitigation

- The primary method for choosing group members was observing surface-level social cues (willingness to talk, outgoing personality) rather than competence or reliability indicators.
- However, the interviewee also mentioned that "in the worst case, checking GPA" would be worthwhile — revealing an underlying desire for **more substantive reliability information**, even though no accessible channel for this currently exists, forcing reliance on superficial personality cues instead.

> **Design implication:** If the platform could surface more structured, lower-risk information (e.g., self-declared availability, past group-work experience, self-reported working style tags) rather than relying solely on chat-based impressions, it might better address this underlying need to "verify compatibility" that currently goes unmet. Note, however, that GPA-type information raises privacy and feasibility concerns, so the design should look for alternative, lower-sensitivity trust signals.

---

## 4. Not All Students Experience High Anxiety — User Heterogeneity

In response to Q5, the interviewee stated: *"I don't really mind, because I have the confidence that I can handle the workload on my own"* — a mindset formed at the point of enrolling in a coursework-based course.

This is a reminder that the target user group is **not homogeneous**: some students, particularly those who mentally prepared for a coursework-heavy course, have relatively low social needs and are less sensitive to group quality.

> **Design implication:** This doesn't undermine the chosen persona direction, but it suggests the audience profile on Slide 3 should more clearly define the **core target user** as those with high anxiety and a strong desire for early connection — rather than generalizing to all students.

---

## 5. Relationships Do Not Extend Beyond the Immediate Task

Responses to Q7–Q9 were uniformly "no" — no lasting contact was formed with people met during group formation who weren't ultimately teammates, and there was no continued interaction with classmates outside the group after formation.

This suggests that current group-forming behavior is **purely task-oriented and transactional**, with no accumulation of broader social capital.

> **Design implication:** This is a useful check on platform scope. If the goal is solely to solve the pre-group icebreaking pain point, this finding aligns well (no need to force a long-term social network). However, if the team wants the platform to also foster longer-term in-course peer networks, this data indicates that such behavior does **not occur naturally by default** — additional design features would be needed to create incentives for maintaining these connections.

---

## Summary

The most valuable contribution of this interview is that it concretizes "social anxiety" into a **specific status anxiety triggered by perceived language fluency**, which is more precise and vivid than generic "fear of strangers" framing, and resonates strongly with the lived experience of international students.

This finding could be directly cited in the design rationale section to strengthen the justification for the progressive self-disclosure design choice.

*If additional interview transcripts become available, a cross-interview affinity map could be built to check whether this "invisible sense of oppression" theme recurs across participants or is specific to this individual case.*
