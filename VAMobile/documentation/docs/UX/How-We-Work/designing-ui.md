---
title: Designing the UI
sidebar_position: 3
---

## UI best practices

- **Use [components](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Components/Overview) already available** in the system.
- Use [Balsamiq](https://balsamiq.cloud/s4uw4la/pnnwuqv) or another **lower fidelity tool to ideate**
- If you are working on an existing feature, **take a look in the app using demo mode** to see how it’s currently working. Figma’s shipped screens are our best examples of how it should look, but there may be some inconsistencies.
- Consider which [screen type](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Templates/ScreenTypes) to use.
- Lean on the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) for support if you aren’t sure where or how to work.


## Designing in Figma

There are a few paths that can be taken when updating existing features or creating new features.

- **Most common: Using existing component(s) with no updates**
    - Ideally, we’re using the building blocks we already have when adding new features to the app. If there is an existing component in the library that can be used and does not need to be changed, team members should add the component from the design system's [Component Library](https://www.figma.com/design/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library---Design-System---VA-Mobile?m=auto&node-id=0-1&t=eKUAt5IA4XlJEuk5-1) and/or the [VA Mobile App Design Library](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/VA-Mobile-Design-Library?node-id=1028%3A3927) and** avoid detaching it in your working file**.
- **Rare: Using existing component(s) with some updates**
    - If you believe the existing component needs to be changed, add the component from the [VA Mobile App Design Library](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/VA-Mobile-Design-Library?node-id=1028%3A3927) and **detach it for ideation**.
        - Once approved, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian/) to add it to the library.
- **Caution: Making a new component**
    - If a design requires a new component, try using [Balsamiq](https://docs.google.com/document/d/1rgNpTvUjZR6E2Z6vfSrxLxvXt7Zxq1Jq6kw6TCDJbBk/edit?pli=1#heading=h.7jcyyrw27o8y), pen and paper, or your favorite low fidelity tool to ideate on ideas.
    - When you’re ready, prep documentation for the component by following [how to document components](https://department-of-veterans-affairs.github.io/va-mobile-app/design/About/Contributing%20to%20the%20design%20system/writing-component-documentation).
    - Once approved, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian/) to add it to the library.


### Best practices in Figma

- Follow the rules around [where we work in Figma](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/where-we-work). Generally, most of your work will be done in the working file for the category your feature is in.
- Every working file should include a **Cover** page in your file.
- In your working file, **avoid creating local components** unless it is a new component that will ultimately be imported into the Flagship or Component Library.
- Tagging folks in comments can be a good way to communicate and work async. Try to have longer discussions outside of comments.

## Documenting your work

[TK] - coming up with standards around a11y, design decisions, etc.


## Prepping your work for handoff

Once designs are ready to be handed off to the engineering team, you can review this checklist before handoff to make sure you’ve covered everything that the FE team will need.

### Variations

1. Determine data organization (e.g. how is a list sorted, does it need filtering, etc)
2. Create designs with data variations (e.g. examples for lots of data, not much data)
3. Document and create designs of error states and unhappy paths
4. Document and create designs of empty states
5. Consider your design with fonts enlarged or varying screen sizes
6. Consider dark mode versions of designs
7. Annotate your design using the [VADS Web Annotation Kit](https://www.figma.com/design/CZcnWfQOwtLqPm4WA5paYG/VADS-Web-Annotation-Kit?node-id=415-1135&t=AA1kuENFcAY6o5JH-1).
    - _Note: There is a [mobile / iOS version of the annotation kit](https://www.figma.com/design/MWuEixKG2VG90fBwqSBvZS/TESTING---VADS-iOS-Annotation-Kit?t=XiMx6pFh9fDRwHz9-0) that is still in progress. If you need an annotation that is mobile-specific, you may be able to find it in this kit. If you need something that is not available in either kit, please contact accessibility to determine the best option._


### IA/Flows

1. Document the IA of your feature & where it lives in the app 
   - See: [VA Mobile app - IA documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/Foundations/Information-Architecture#ia-documentation) for the app's sitemap and guidance on adding new features
2. Update category screens, if needed
3. Document intended flow
4. Defined back labels and screen title


### Reviews

1. Have a peer review your work
2. Receive a sign-off from accessibility on the designs and annotations
3. Receive a sign-off from the content designer on all copy
4. Review component updates and/or additions with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian)
    - The Design Librarian will review the updates with the design system team to determine if we will need to coordinate with them on any component updates and/or additions.


### Prepping for handoff

1. Add Figma links and screenshots of designs (light and dark mode) to appropriate tickets 
2. Create pages for each FE implementation ticket in the working file as outlined in the [Figma file workflow](https://www.figma.com/file/myVAkBM6nrpt3iC39RyjXz/%F0%9F%A7%B0-FigmaFileWorkflow---Resource---VAMobile?node-id=344%3A279&t=jC6U9HEvK543P9i4-1) 
3. Check with Product about when work will be handed off
3. Plan to attend a FE handoff meeting to answer any questions


## Handing off and following along

### Development Handoff
 - Team members should expect to do a design walkthrough with engineering as part of the handoff process. In the design walkthrough, team members should be prepared to answer questions related to flow, error/empty states, and design decisions. See [prepping your work for handoff](#prepping-your-work-for-handoff) above.
 - After the design walkthrough, team members should make any updates to designs, and ensure that appropriate tickets are updated with the intended flow, Figma links, and screenshots.
 - As designs are being implemented by the engineering team, team members should respond to questions (in Slack and/or Zenhub) in a timely manner and communicate with the front-end team (engineers and product manager) to collaborate on refinements.

### QA
- QA will be QAing AC in tickets throughout the entire development process for a project/feature.
- Each epic should have visual, interaction, accessibility, and content QA (aka UX QA) completed before release.
- The exact plan and timing for UX QA can vary across features - you will collaborate with Product and QA to ensure that everyone has the same understanding of what will work best for any given feature. That being said, here are some general guidelines:
    - For large features/features with brand new components, do a round of visual and interaction QA early in development (~when implementation ticket is in PR review).
    - For all features, do visual, interaction, accessibility, and content QA on the 'last needed bug fixes build' for a feature, at the same time that QA is doing their fix verification and regression testing.
    - Use the FE handoff pages in the working file to compare the work.
    - For using real test users/data, see this [Slack thread on logging in as a test user](https://adhoc.slack.com/archives/C02F8TLNSGY/p1666966698246379).
    - On your testing device, complete a QA of the feature’s happy path.
    - If you need a testing user to reach a particular screen or edge case, you can message a QA engineer in Slack for help.
    - If bugs/issues are found, log a ticket. Here are examples of a UX bug ([4009](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/4009)) and a content bug ([4121](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/4121)).
- If you notice that QA engineering is not finding bugs that should have been caught in earlier tickets, let QA know, so they can improve their work.

### Launching
- For major features, team members should expect to work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) and the Product team to prepare the [app store content](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Operations/Updating%20the%20App%20Stores).


## Moving/Publishing Work

### Library updates

- When the design work is complete and is approved for launch, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) to implement any needed updates into the [Flagship Library](https://www.figma.com/design/QVLPB3eOunmKrgQOuOt0SU/Flagship-Library---%F0%9F%93%90-Resource---VA-Mobile?m=auto&node-id=719-1428&t=FZCBblfdhmL0HUbe-1).

### Move work to shipped file

- When the design is live in the app, work with the [Design Librarian](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/UX/How-We-Work/design-librarian) to create a shipped file as outlined in the [Figma file workflow](https://www.figma.com/file/myVAkBM6nrpt3iC39RyjXz/%F0%9F%A7%B0-FigmaFileWorkflow---Resource---VAMobile?node-id=344%3A279&t=jC6U9HEvK543P9i4-1).