---
title: Incident response
---

# Incident Response

This document outlines a process for the VA mobile team to respond to incidents that might happen in relation to the VA: Health and Benefits flagship mobile app. This should outline a process to follow when we can control issues as well as when issues are out of the control of the team (e.g. when an external service goes down). The process also only applies during business hours (Monday - Friday, 9am ET - 5pm PT), we’re not asking anyone to be responsive outside of normal work hours.

All incidents are starting with the assumption that the team has been alerted to an issue, defining monitoring services are outside the scope of this process.

If any of the following conditions are met, notify the Product Owner and, once the incident is resolved, follow up with a [postmortem report](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/Postmortems/_template.md):

- Incident requires the use of a playbook
- Occurs for a significant portion of the userbase
- Persists for a significant period of time
- Involves the security of a system or a Veteran's data
- Requires out-of-app coordination to fix
- Requires an out-of-band app release

For all other incidents, use your best judgement on who to notify and how to proceed. In addition to a postmortem report, if the incident is such that it may occur again in the future – or if it follows a theme common to incidents in the past – please add the incident and the steps to resolve it as a Mobile Incident Response Play.

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

| Procedure | Usage |
|-----------|-------|
| [Mobile Incident Response Playbook](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/operations/Mobile%20Incident%20Response%20Playbook.md) | Respond to mobile-specific incidents |
| Mobile Incident Response Plays | Plays and postmortems for common incidents |
| [Platform Incident Response Playbook](https://depo-platform-documentation.scrollhelp.site/developer-docs/incident-response-documentation-for-application-te) | Respond to API incidents impacting – but not limited to – mobile |
| Security Incident (URL TBD) | Respond to security incidents |
| [Platform Out-of-band Deploy Process](https://depo-platform-documentation.scrollhelp.site/developer-docs/deployment-policies#DeploymentPolicies-Requestingout-of-banddeploys) | Request out-of-band API releases |

### Incident Example

1. Incident happens
2. Someone notices it
3. Report the incident to the incident commander
4. The incident commander will gather all the relevant information
5. The incident commander will present the information to leadership
6. Leadership will make a recommendation and communicate that to VA
7. If action is needed, the incident commander will start the workstream, monitor, and report progress.

## Incidents we don’t control

Incidents the mobile application team does not control should be reported to Platform and monitored in case any user messaging is necessary. These issues do not require an incident commander, but the reporting team member should also update the OCTO mobile slack channel (#va-mobile-app) with a link to where the issue was reported (support ticket or general channel link) to communicate that the issue is known.

An outage caused by a dependency is still significant and you should still assess the impact, but isolating the cause as being because a dependency adjusts your response. Talk to the responsible team. **If you determine the outage will last a significant period of time, follow the procedure to set a maintenance window on the upstream service, which will create user-visible warnings in the app about temporary loss of functionality.** Make sure the team responsible for the upstream service is aware of the outage; if they are not, escalate the issue to the team responsible for the upstream service. If you need to escalate to another VA team, inform the mobile app product owner and copy them on all communications with other teams.

The mobile app relies on many external systems in order to retrieve and process data. When any of these systems encounter issues, the mobile app is directly impacted. To see a list of external depenencies, view the [upstream services map](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/BackEnd/Architecture/Services/).

### Non-control Incident Example

1. Incident happens
2. Someone notices it
3. That person should check if its been reported to platform, and if not does so.
4. Add a link to the reported message into the OCTO mobile slack channel

## People

If you need to escalate an issue, these are the relevant personnel listed below:

| Role             | Person         | Contact Method |
|------------------|----------------|----------------|
| Product Owner    | Ryan Thurlwell | OCTO Slack     |
| Engineering Lead | Tim Wright     | OCTO Slack     |
| Product Lead     | Becca Tupaj    | OCTO Slack     |
| System Owner.    | Chris Johnston | OCTO Slack     |

## Key Slack Channels

Many issues can be detected / resolved by monitoring / reaching out to others in OCTO Slack. Some of the important channels are:

- #va-mobile-app
- #va-mobile-app-alerts
- #vfs-platform-support
- #identity-support
