---
title: Mobile App Platform Workflow
sidebar_position: 1
---

## Full Process
![Feature Workflow](FeatureWorkflow.png)

## Project Kickoff
Main objectives:
![Project Kickoff Objectives](KickoffMainObjectives.png)

**During this step feature teams are responsible for:**
* Create an epic ticket documenting the problem statement and success criteria
* Schedule a kickoff meeting with the Mobile App Platform Team

**During this step the Mobile App Platform team will be responsible for:**
* Ensuring feature teams have access to appropriate process documentation
* Identifying any potential hindrances in the development process and future proofing against them
* Setting a Go Live goal and cross modality requirements
* Warning about any potential code or delivery collisions with other teams
* Creating Mobile App Platform team work tied to any homescreen integrations

## Design Cycle
Main objectives:
![Design Cycle Objectives](DesignCycleObjectives.png)

**During this step feature teams are responsible for:**
* Scheduling a design critique meeting [when applicable](../design/About/designers#when-to-attend)
* Getting officially approved signoff on UI and design from the Mobile App Platform team

**During this step the Mobile App Platform team will be responsible for:**
* Helping iterate on proposed designs
* Confirming approved UI for development

## Development
Main objectives:
![Devlopment Objectives](DevelopmentObjectives.png)
**During this step feature teams are responsible for:**
* Following development best practices:
    * Avoid NPM Library imports except when absolutely required
    * Keep filtering and sorting logic on the BE code layer for efficient processing
    * Create meaningful unit and e2e tests
    * Add relevant demo mode examples
    * Use translation files for content inclusions
    * Develop for screenreader and other accessibility requirements
    * Use pre-existing components/patterns unless doing so would alter them drastically
    * Ensure backwards compatibility
* Ensuring all work is behind a feature flag unless it can be delivered standalone
* Clarifying any questions with the Mobile App Platform team in the **#va-mobile-app-engineering** channel

**During this step the Mobile App Platform team will be responsible for:**
* Assisting in any onboarding or setup requirements for engineers
* Answering any outstanding questions
* Helping steer development when applicable
* Supplying pre-existing models as a template
* Helping to alter components and processes appwide for new required functionality


## Code Review/QA
Main objectives:
![Code Review and QA Objectives](CRandQAObjectives.png)
**During this step feature teams are responsible for:**
* Creating [pull requests](./SetUp/Pull%20Requests/) that meet engineering and QA requirements
* Supplying meaningful and comprehensive acceptance criteria, accessibility requirements, and staging data
* Responding to peer review change requests and comments
* Engaging in good faith discourse
* Confirming and fixing merge-blocking bugs reported

**During this step the Mobile App Platform team will be responsible for:**
* Ensuring coding best practices have been followed
* Confirming all code is legible and easy to understand
* Suggesting pre-existing alternatives when they exist to avoid wheel remaking and conformity
* Thorough accessibility testing and acceptance criteria confirmation on both Android and iOS devices
* All feedback/bugs described as required or not for merge

## Prep for Go-Live
Main objectives:
![Go Live Objectives](GoLiveObjectives.png)
**During this step feature teams are responsible for:**
* Documenting a production test with Veteran volunteers or requesting the Mobile App Platform team to do so
* Confirming all UX has been approved by the Mobile App Platform PO
* Filling out a [Go-Live Template ticket](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?template=Go-Live-Approval-Template.md)
* Responding to any new QA requirements

**During this step the Mobile App Platform team will be responsible for:**
* Regression test all tickets associated with the feature
* Execute a phased rollout upon request
* Add in-app what's new content and release notes when applicable
* Ensure there are no feature collisions with other teams

## Monitor Feature
Main objectives:
![Monitor Objectives](MonitorObjectives.png)
**During this step feature teams are responsible for:**
* Reviewing given analytic solutions for feature health at Go-Live and beyond
* Gathering larger scale feedback regarding feature
* Report any critical issues identified to the Mobile App Platform team ASAP
* Consider analytic retirement or next steps for feature

**During this step the Mobile App Platform team will be responsible for:**
* Report any unique user feedback to the feature team
* Report any critical issues identified to the feature team ASAP

## Mobile Platform Approval Steps
![Mandatory Steps](MandatorySteps.png)