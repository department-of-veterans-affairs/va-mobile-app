---
title: Incident response
---

# Incident Response

This document outlines a process for the VA mobile team to respond to incidents that might happen in relation to the VA: Health and Benefits flagship mobile app. This should outline a process to follow when we can control issues as well as when issues are out of the control of the team (e.g. when an external service goes down). The process also only applies during business hours (Monday - Friday, 9am ET - 5pm PT), we’re not asking anyone to be responsive outside of normal work hours.

All incidents are starting with the assumption that the team has been alerted to an issue, defining monitoring services are outside the scope of this process.

## Incidents we control

Actual issues with the mobile app on iOS or Android that we can fix with a code update, this includes shipped bugs and unintended side effects of how third party systems were implemented.

### Personnel needed

[Incident commander](https://www.atlassian.com/incident-management/incident-response/incident-commander) (a primary point of contact and backup plans set within the leadership team and communicated out to the rest of the team)

### Information needed

- Data: Users impacted
- QA: Severity level
- Engineering: Effort level to remediate
- Product: Amount of time to next natural release

The team member who initially discovers the issue should report it to the active incident commander, who will be in charge of gathering the necessary information and presenting it to the leadership team.

The above information will be presented, by the incident commander, to the VA Mobile App leadership for recommended action. The recommendation should then be presented to the OTCO-DE product owner for final decision.

### Incident Example

1. Incident happens
2. Someone notices it
3. Report the incident to the incident commander
4. The incident commander will gather all the relevant information
5. The incident commander will present the information to leadership
6. Leadership will make a recommendation and communicate that to VA
7. If action is needed, the incident commander will start the workstream, monitor, and report progress.

## Incidents we don’t control

Incidents the mobile application team does not control should be reported to Platform and monitored in case any user messaging is necessary. These issues do not require an incident commander, but the reporting team member should also update the DSVA mobile slack channel (#va-mobile-app) with a link to where the issue was reported (support ticket or general channel link) to communicate that the issue is known.

### Non-control Incident Example

1. Incident happens
2. Someone notices it
3. That person should check if its been reported to platform, and if not does so.
4. Add a link to the reported message into the DSVA mobile slack channel
