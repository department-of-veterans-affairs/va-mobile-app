---
title: Contributing
sidebar_position: 2
---

## VA Health & Benefits: Mobile & Web Collaboration

### Collaboration Phases

This model shows how collaboration between web and mobile teams evolves as web teams develop more experience working in the mobile app and add mobile specific resources to their teams.

**The outcome is such that an Experience team owns one or multiple Veteran-facing experiences across modalities – mobile app(s), va.gov, and future modalities.**

Any support with Experience teams will be dependent on prioritization.

### Definitions

Web team: An OCTO-led team that owns Veteran-facing va.gov experience(s).

Mobile team: An OCTO-led team that owns all experiences in VA: Health and Benefits mobile app.

Experience team: A yet-to-exist team that owns Veteran-facing experiences across all modalities: native mobile apps, va.gov, and current/future technologies.

| Phase A: Mobile works independently | Phase B: Web experience advises mobile | Phase C: Mobile and Web split responsibilities | Phase D: Mobile advises web experience team** | Phase E: Web team works independently and become an Experience team. |
| --- | --- | --- | --- | --- |
| VAHB Mobile App team does all of the implementation and maintenance work | VAHB Mobile App team does all of the implementation and maintenance work | Web experience team works to identify, strategize, and design initiatives<br/><br/>VAHB builds/ships, measures and maintains. | Web experience team does all of the implementation and maintenance work<br/><br/>VAHB may lend resources as needed | **Experience** team does **all** the implementation and maintenance work |
|     | Web experience team advises mobile team as experience subject matter experts | VAHB team advises the experience team | VAHB team advises the experience team, runs QA, and reviews code. | VAHB runs QA and reviews code prior to submission and release |
| Mobile OCTO team POs manage initiatives | Mobile OCTO team POs manage initiatives | Experience OCTO POs manage initiatives | Experience OCTO POs manage initiatives | Experience OCTO POs manage initiatives |

### **_How an initiative will work in detail_**

Transition Phase C (Mobile and Web split responsibilities) represents the next available stage of collaboration that web and mobile teams can move to while most mobile expertise is still within the mobile team.

#### Success measures for Phase C

1. Web teams move through the strategy and design phases with minimal support from the mobile team.
2. The mobile team implement requirements and designs that the web experience team created with minimal rework.

**What needs to be done to move on to the next step:**

| Initiative Steps   | Web Application Team | VAHB Mobile Team |
|--------------------|----------------------|------------------|
| Step 0: Identify   | Create a [project brief](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?template=feature-request.yml) that roughly lays out abstract requirements, risks, and major players. | - Mobile reviews the brief and gives feedback on mobile specific elements. - This is the review gate to consider if this feature or update is appropriate for VAHB. |
| Step 1: Strategize | - Web team drafts product strategy and decides on requirements. - A formal kickoff could be scheduled at this stage to lay out how these teams will collaborate with each other, timelines, and points of contact. - Web team creates tickets on their own board for research and design. | - Mobile reviews and gives feedback on mobile specific considerations. - Mobile will prioritize resources to consult on Step 2 |
| Step 2: Design | - Evaluative research, design and product ideation is done in order to define the first version of a feature. Finalize what is in and what isn’t. What does it look like? - Web creates an implementation plan and submits a [testplan request](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?template=QA_Test_Plan.md) to the mobile QA team. | - Mobile will consult on research, design, data, content, accessibility, etc - Mobile reviews implementation plan - Mobile prioritizes implementation                                                                                                               |
| Step 3: Build/Ship | - Web shares test accounts and assists with testing - Web assists with providing app store and what’s new content | - Mobile copies over engineering tickets and test plans - Mobile points engineering and QA tickets - Mobile implements - Mobile leads all necessary steps to include in whole app release process, including phased release, app store info, and what’s new content |
| Step 4: Measure    | - Web assists with comparing web and mobile analytics | - Mobile monitors initial launch success |
