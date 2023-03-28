---
title: Team charter
---

## Guideposts

### Team Vision

Each Veteran is securely connected to the VA services that matter most to them regardless of device or VA org chart.

### Team Mission Statement

A native mobile app that is a trusted source for Veterans to quickly and easily check the status of their VA services and complete simple, transactional tasks across their health and benefits.

## What we work on

### Product Suite 
- Health, benefits, payments, and profile products and services.
- Global systems like UI library, FE components, accessibility, devops, governance and documentation.

### Product Portfolio

#### Health

- Appointments
- Secure Messages
- Prescriptions
- Vaccines

#### Benefits
- Claims & appeals status
- Disability rating
- Letters

#### Profile
- Personal & military information

#### Payments
- Compensation

## Who we are

### Teams

#### Red Team

Concentrating on health products in the app.

#### Blue Team

Concentrating on benefits products and global features in the app such as navigation, single sign on (SIS), and improvements and maintenance (aka TLC).


### Team Members

#### VA Product Owners

- Chris Johnston
- Rachel Han
- Ryan Thurlwell
- Martha Wilkes (accessibility as needed)

#### Program Management

- Seth Eheart - Program Manager

#### Product

- Matt Hall - Product Leadership
- Adam Bischoff - Product
- Stacy Blackwood - Product
- Meko Hong - Product
- Kelly Lein - Product
- Greta Opzt - Data

#### UX

- Jen Ecker - UX Leadership
- Brea Blackwelder - Accessibility Design
- Holly Collier - Design
- Melissa Lefevre - Design
- Misty Milliron-Grant - Content Strategist
- Lauren Russell - Design
- Liz Straghalis - Research
- Jessica Woodin - Design

#### Engineering

- Tim Wright - Engineering Leadership
- Chika Adibemma - Engineering
- Chris Alexander - Engineering
- Theo Bentum - Engineering
- Jon Bindbeutel - Engineering
- Jason Conigliari - Engineering
- Andrew Herzberg - Engineering
- Dylan Nienberg - Engineering
- Jayson Perkins - Engineering
- Kris Pethtel - Engineering
- Narin Ratana - Engineering
- Tim Roettger - Engineering
- Tom Gammons - Engineering, QA
- Therese Dickson - Engineering, QA
- Rachael Bontrager - Engineering, QA

## How we work

### Team Meetings Cadence

#### Stand-up

Check in on people and product progress. Raise blockers.

- Every Tuesday and Thursdays
- 15-30 minutes
- Red team at 1:30pm ET
- Blue team at 2pm ET

#### Sprint Planning

Outline work to be done this sprint in order to accomplish the team's goals.

- Last Tuesday of every sprint
- 1 hour
- Red team at 1pm ET
- Blue team at 2pm ET

#### Demo

Showcase of work done during the previous sprint.

- Thursday after the end of every sprint
- 45 minutes
- Entire team (Red + Blue) at 2:35 ET

#### Retro

Open discussion on what has gone well, what has been challenging, and discussion of action items.

- Mid-Thursday of every sprint
- 45 minutes
- Entire team (Red + Blue) at 2:30 ET

#### Sprint 0

Team and POs working ahead of the team to define future initiatives. Create draft product briefs that we can pull from in the future. Open to anyone on the team.

- 1 hour
- Weekly on Wednesdays at 1:05pm ET

#### Scrum of Scrums (SoS)

Product, leads, and PO get together to discuss:

- Highlight the quarterly plan and review progress
- Review changes in risks, dependencies, assumptions, or priority for the current sprint
- Review insights from ongoing discovery or delivery work in the current sprint
- Discuss the plan for the upcoming sprint
- Rebalance team staffing if necessary
- Triage unplanned work

Cadence:
- 1 hour
- Weekly on Tuesdays at 4:05pm ET

#### Quarterly Planning

Outline work to be done next quarter in order to accomplish the team's goals.

- Upcoming tentative dates
    - Q2 2023 - 4/4/23
    - Q3 2023 - 6/27/23
    - Q4 2023 - 10/3/23
    - Q1 2024 - 1/9/24
- 2 hours
- Entire team (Red + Blue)

### Issue Etiquette

- Anyone on the team can create a(n) issue/ticket/story.
- All teammates are responsible for keeping them up to date.
- Templates are available within the new issue/ticket/story during creation.

#### Labels to use:

- Team assigned (_mobile-blue-team_, etc)
- Discipline(s) (_ux_, _content_, _front-end_, _back-end_, _qa_)
- Feature area(s) if applicable (_direct-deposit_, _payments_, etc.)
- For bugs, add the _bug_ tag and [applicable severity tag](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/testing/VA%20Mobile%20App%20Test%20Plan.md#issue-severity)


#### Epics should include:

- Clear acceptance criteria
- Definition of done
- A user story that reflects the benefit to a Veteran, Caregiver, or other user
- Been broken up into discrete tasks/Github tickets that are attached to the epic
- All components/steps have been accounted for in the epic
- Documented risks: Risks: Value Risk, Feasibility Risk, Business Viability Risk, Usability Risk

#### Stories/Tickets should include:

- Title that explains the goal in plain language
- Linked to another ticket or epic
- Includes:
    - Description (what happened & why we need this ticket),
    - General tasks to perform
    - Acceptance criteria (expected result)

#### Estimation

We use fibonacci numbers (1, 2, 3, 5, 8, 13) to account for the level of effort, complexity, and amount of unknowns in our work. Here is our guide:


<table>
  <tr>
   <td><strong>Points</strong>
   </td>
   <td><strong>Complexity</strong>
   </td>
   <td><strong>Meaning</strong>
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>xxsmall
   </td>
   <td>Trivial change - Up to 2 hours  (time mostly in submitting the work)
   </td>
  </tr>
  <tr>
   <td>2
   </td>
   <td>xsmall
   </td>
   <td>Small change - Up to 4 hours  (More validation is required)
   </td>
  </tr>
  <tr>
   <td>3
   </td>
   <td>small
   </td>
   <td>Routine addon/none new - 1 to 2 days (small work/high domain knowledge/1 or no moving parts)
   </td>
  </tr>
  <tr>
   <td>5
   </td>
   <td>medium
   </td>
   <td>Routine addon/none new - 2 to 3 days (medium work/1-2 moving parts)
   </td>
  </tr>
  <tr>
   <td>8
   </td>
   <td>large
   </td>
   <td>New work/High Complexity - 3 to 5 days (over 2 moving parts)
   </td>
  </tr>
  <tr>
   <td>13
   </td>
   <td>xlarge
   </td>
   <td>Too big/Risky, should be broken down - 1 to 2 weeks
   </td>
  </tr>
</table>


## Team Norms

### Values

- We strive to create a product that is usable for all Veterans, no matter their abilities.
    - We take a proactive, accessibility-first approach to everything we build. Accessibility is never an afterthought. It’s considered in every step of our process, from initial discovery to QA. 
    - We also believe in accessibility beyond compliance. We don’t just meet the bare minimum of accessibility. recommendations. We go above and beyond these recommendations to ensure we’re creating a product that is truly accessible to all of our users.
- We aim to start simple when building new features and take advantage of existing components.
- We want to act as a partner to VA rather than a vendor.
- We get input and feedback from all disciplines throughout feature implementation.
- We make a point to celebrate our accomplishments.

### Communication

- Meetings follow communication norms as outlined in [inclusive meeting tips](/docs/about/inclusive-meetings).
- We use Slack "threads" to contain conversations in a single place and aim to work in public channels. 
- We don’t wait for meetings get question answered.
- We respect before/after hours time commitments and time zones. When we will be away we communicate availability in Slack, team calendars, and OOO docs.
- We work to balance having just enough meetings for folks to get work done while also feeling connected to team
- NEW: Meetings have agenda, notes, description and desired outcome, send along read ahead.
- NEW: Cameras are encouraged but optional in meetings.
- NEW: We strive to keep Friday a non-meeting day.
- NEW: Be considerate of long Slack threads. Signals of a thread getting out of hand are if you have to @folks to get attention or there are multiple conversations going on. If you see that happening, consider changing the format to a meeting and link meeting notes in the Slack thread.

### Slack DSVA “#va-mobile-app”:

This is our main means of communication with each other. Keep as much conversation in public channels as possible, to minimize duplicative and extraneous communication.

### GitHub

- Product and research documentation are on[ VA.gov repository](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app).
- Codebase and issues are on separate [VA mobile repository](https://github.com/department-of-veterans-affairs/va-mobile-app).
- Update tickets regularly. If conversations happen in Slack that are pertinent to a product or initiative, copy the useful info into GitHub/ZenHub.

### PTO

- We will respect time off and understand that mental, physical, and personal health is the top priority for team members.

