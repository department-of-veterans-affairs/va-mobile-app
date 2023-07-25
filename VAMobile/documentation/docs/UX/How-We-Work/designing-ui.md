---
title: Designing the UI
sidebar_position: 3
---

## UI best practices

- **Use [components](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/ComponentsSection/) already available** in the system.
- Use [Balsamiq](https://balsamiq.cloud/s4uw4la/pnnwuqv) or another **lower fidelity tool to ideate**
- If you are working on an existing feature, **take a look in the app using demo mode** to see how it’s currently working. Figma’s shipped screens are our best examples of how it should look, but there may be some inconsistencies.
- Consider which [screen type](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/Templates/ScreenTypes) to use.
- Lean on the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) for support if you aren’t sure where or how to work.


## Designing in Figma

There are a few paths that can be taken when updating existing features or creating new features.

- **Most common: Using existing component(s) with no updates**
    - Ideally, we’re using the building blocks we already have when adding new features to the app. If there is an existing component in the library that can be used and does not need to be changed, team members should add the component from the [VA Mobile App Design Library](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/VA-Mobile-Design-Library?node-id=1028%3A3927) and** avoid detaching it in your working file**.
- **Rare: Using existing component(s) with some updates**
    - If you believe the existing component needs to be changed, add the component from the [VA Mobile App Design Library](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/VA-Mobile-Design-Library?node-id=1028%3A3927) and **detach it for ideation**.
        - If components have been changed, have them reviewed by the [Component Committee](https://docs.google.com/document/d/1rgNpTvUjZR6E2Z6vfSrxLxvXt7Zxq1Jq6kw6TCDJbBk/edit?pli=1#bookmark=id.pv64bxlp7e6c) before finalizing your design.
        - Once approved, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian/) to add it to the library.
- **Caution: Making a new component**
    - If a design requires a new component, try using [Balsamiq](https://docs.google.com/document/d/1rgNpTvUjZR6E2Z6vfSrxLxvXt7Zxq1Jq6kw6TCDJbBk/edit?pli=1#heading=h.7jcyyrw27o8y), pen and paper, or your favorite low fidelity tool to ideate on ideas.
    - When you’re ready, prep documentation for the component by following [how to document components](https://docs.google.com/document/d/1pC-Pyc_HDZMtHb17XRND_57u7H8I3IDATUDGgGxFZAg/edit#heading=h.iwlf7nqnidb).
    - You will be invited to a meeting and will review the component and the documentation with the Component Committee. _Note: These do not have to be high fidelity designs._
    - Once approved, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian/) to add it to the library.


### Best practices in Figma

- Follow the rules around [where we work in Figma](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/where-we-work#ui-library-and-feature-designs---figma). Generally, most of your work will be done in the [working file](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/where-we-work#categoryname) for the category your feature is in.
 When starting a new feature, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian/) to create a new working file.
- Every working file should include a **Cover** and **Readme** page in your file.
    - Readme page orients people to your file and the work in general. It should contain project info, important links, team members, etc.
- In your working file, **avoid creating local components**.
- Tagging folks in comments can be a good way to communicate and work async. Try to have longer discussions outside of comments.

## Documenting your work

[TK] - coming up with standards around a11y, design decisions, etc.


## Prepping your work for handoff

Once designs are ready to be handed off to the engineering team, you can review this checklist before handoff to make sure you’ve covered everything the FE team will need.

### Variations


1. Determine data organization (e.g. how is a list sorted, does it need filtering, etc)
2. Create designs with data variations (e.g. examples for lots of data, not much data)
3. Document and create designs of error states and unhappy paths
4. Document and create designs of empty states
5. Consider your design with fonts enlarged or varying screen sizes
6. Consider dark mode versions of designs


### IA/Flows

1. Document the IA of your feature & where it lives in the app 
See: [Determining Navigation & Information Architecture Placement for New VA Mobile App Features](https://docs.google.com/document/d/1XQcYxnCifloaBFNKL2C9JNS7KIj6wEhb4VokPGxBZU8/edit), [VA Mobile app: Detailed sitemap (future state 9-30-22](https://app.mural.co/invitation/mural/adhoccorporateworkspace2583/1655989910332?sender=u28718b63c8993f515e0b2240&key=6f96be43-72c9-4ae6-b529-a2941eb14ba9) 
2. Update category screens, if needed
3. Document intended flow
4. Defined back labels and screen title


### Reviews

1. Present at Show and Tell or have a peer review your work
2. Complete an accessibility review, if needed
3. Receive sign-off from content designer on all copy
4. Review components with [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian)


### Prepping for handoff

1. Add Figma links and screenshots of designs (light and dark mode) to appropriate tickets 
2. Create pages for each FE implementation ticket in the working file as outlined in the [Figma file workflow](https://www.figma.com/file/myVAkBM6nrpt3iC39RyjXz/%F0%9F%A7%B0-FigmaFileWorkflow---Resource---VAMobile?node-id=344%3A279&t=jC6U9HEvK543P9i4-1) 
3. Check with Product about when work will be handed off
3. Plan to attend FE handoff meeting to answer any questions


## Handing off and following along

### Development Handoff
 - Team members should expect to do a design walkthrough with engineering as part of the handoff process. In the design walkthrough, team members should be prepared to answer questions related to flow, error/empty states, and design decisions_. See prepping your work for handoff above._
- After the design walkthrough, team members should make any updates to designs, and ensure that appropriate tickets are updated with the intended flow, Figma links, and screenshots.
- As designs are being implemented by the engineering team, team members should respond to questions (in Slack and Zenhub) in a timely manner and communicate with the front-end team (engineers and product manager) to collaborate on refinements.
### QA
- QA will be QAing AC in tickets throughout the entire development process for a project/feature.
- Before release, QA will let you know when you can do a visual, interaction, and content QA. Use the FE handoff pages in the working file to compare the work.
    - For using real test users/data, see this [Slack thread on logging in as a test user](https://adhoc.slack.com/archives/C02F8TLNSGY/p1666966698246379).)
    - On your testing device, complete a QA of the feature’s happy path.
    - If you need a testing user to reach a particular screen or edge case, you can message a QA engineer in Slack for help.
    - If bugs/issues are found, log a ticket. Here are examples of a UX bug ([4009](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/4009)) and a content bug ([4121](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/4121)).
- If you notice that QA engineering is not finding bugs that should have been caught in earlier tickets, let QA know, so they can improve their work.
### Launching
- For major features, team members should expect to work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) and the Product team to prepare app store content.


## Moving/Publishing Work

### Move work to shipped file

- When the design is live in the app, the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) will work with you to create a shipped file as outlined in the [Figma file workflow](https://www.figma.com/file/myVAkBM6nrpt3iC39RyjXz/%F0%9F%A7%B0-FigmaFileWorkflow---Resource---VAMobile?node-id=344%3A279&t=jC6U9HEvK543P9i4-1).