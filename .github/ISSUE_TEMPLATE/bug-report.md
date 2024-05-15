---
name: New Internal Bug Report Template
about: Template for Mobile Team or Internal VA  Reporting a bug in the VA mobile app
title: BUG - [SEVERITY] - [iOS/Android/All] - [Short description]
labels: bug,qa
assignees:
---
<!-- Please fill out all of the relevant sections of this template. Please do not delete any areas of this template. The tickets can be updated as the sections are finished and any section that doesn't need to have info should be labeled as NA. Do not include any personally identifiable information for any real person in bug writeup, including screenshots. -->
<!-- This template is for members of the VA Health and Benefits team to submit a bug report. Everyone else, please use the External Bug Report template -->
## What happened?
<!-- General overview of what happened and where it happened -->

## Specs:
<!-- What are the specifics that are important to this issue? Delete anything that isn't important -->
- Device:
- OS:
- User Account:
- Accessibility State:

## Steps to Reproduce
<!-- Step by step instructions on how to reproduce. BE AS SPECIFIC AS POSSIBLE -->

## Desired behavior
<!-- What *should* have happened -->

## Acceptance Criteria
<!-- What is/are the requirements for fixing the bug? If this bug was found without a ticket, leave blank. It should be filled in during the next bug scrub. -->

## Bug Severity - BE SURE TO ADD THE SEVERITY LABEL
<!-- How bad is it? --> 
See [Bug Tracking](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA#issue-severity) for details on severity levels
<!-- Pick high or low for each category, using definitions in the link above if needed. -->
- Impact: High Low 
- Frequency: High Low 

<!-- Pick a single severity label (and delete the others) -->
<!-- sev-1 is HIGH for both impact and frequency, sev-2 is HIGH in one measure and LOW in the other, sev-3 is LOW for both -->
- 3 - Low
- 2 - High
- 1 - Critical

## Linked to Story
<!-- OPTIONAL. Add the link to the issue here. you can shorthand the link like this: #598 where 598 is the ticket number. Skip if found during a regression. -->

## Screen shot(s) and additional information
<!-- Add any screen shots, video, gifs, etc that will help the engineers track down the issue. The 'details' section below will expand/collapse, so is a good default location for long JSON responses.  -->

<details>
  <summary>Full JSON response for services related to issue (expand/collapse)</summary>
  <!-- Copy-paste the JSON from Charles here. Easiest is to use the 'raw' tab which will include header + body. -->

</details>

## Ticket Checklist
- [ ] Steps to reproduce are defined
- [ ] Desired behavior is added
- [ ] Labels added (front-end, back-end, global, Health, relevant feature, accessibility, etc)
- [ ] Estimate of 1 added (for front-end tickets)
- [ ] Added either to the relevant feature epic (if found during new feature implementation), or the relevant team's bug epic ([Global](https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/8302), [Health & Benefits](https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/8303), [API](https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/8304), [QART](https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/8305))
