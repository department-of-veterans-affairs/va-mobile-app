---
title: Incident Response
---
**If you are not a member of the Mobile Platform team and need to report a mobile incident:**  
post a message in the va-mobile app channel, tagging @mobile-incident-response. 

**For members of the Core Mobile Platform team:**  
This document outlines the process for responding to critical VAHB incidents reported during business hours (Monday - Friday, 9am ET - 5pm PT).

For more explicit guidance around recurring issues, refer to [Mobile Plays and Postmortems](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/operations/Mobile%20Plays%20and%20Postmortems.md).


## Step one - Acknowledge the incident
Regardless of the method by which the incident has been detected, take the following steps to acknowledge the incident and bring the incident response crew together.

1. Acknowledge the issue in #va-mobile-app if it has not already been posted and tag @mobile-incident-response
2. Identify the Incident Commander (Default to Michelle Middaugh, Backup: Ryan Thurlwell). This person will be the a primary point of contact and will be responsible for keeping Leadership updated with the current status of an active incident at least every hour with the following:
    1. The current state of the service
    2. Remediation steps taken
    3. Any new findings since the last update
    4. Theory eliminations (i.e. ‘What have we determined is not the cause?’)
    5. Anticipated next steps
    6. ETA for the next update (if possible)
3. Identify the lead engineer (Default to Jon Bindbeutel, Backup: John Marchi)
4. The IC creates a temporary Slack channel using conventional naming such as `010826-mobile-incident`, tagging @mobile-incident-response. This channel will be dedicated to incident conversations and can be closed following post mortem and retro.
5. Return to the original incident post in #va-mobile-app and thread the name of the Incident commander and a link to the incident channel
6. Open an incident room/bridge call and post in the temp channel 

## Step two - Determine impact

**If it is a widespread outage affecting both web and mobile:**  

1. Acknowledge the issue in #va-mobile-app and tag @mobile-incident-response
2. Check the #oncall and #vfs-platform-support channels. If OCTO or Platform staff are aware of and addressing the incident, stand by and monitor for escalation of any mobile-specific questions. Report the incident if no post exists. 

**If the incident is an external outage:**

1. Acknowledge the issue in #va-mobile-app and tag @mobile-incident-response and the relevant Experience team(s)
2. Check the #oncall and #vfs-platform-support channels. If OCTO or Platform staff are aware of and addressing the incident, stand by and monitor for escalation of any mobile-specific questions. Report the incident if no post exists. 

**If mobile only, first assess whether this is a security incident: Security incidents are prioritized as Critical and need to be escalated as described below.**

1. Has the system has been compromised by a third party? 
2. Has there been a leak of personally identifiable information? 
3. Is the system under attack?
* If yes to any of the above, the incident is considered a critical security incident. If this is the case, immediately inform VA Product Owners who will escalate the incident to Tier 3 following the steps in the [Security Incidents](https://depo-platform-documentation.scrollhelp.site/support/va-platform-incident-playbook#VAPlatformIncidentPlaybook-SecurityIncidents) documentation. Critical protocol applies.

**If Mobile only and not a security incident:**
Determine the impact using the below matrix and with consideration for the user experience. An incident may be more severe if the app does not respond gracefully or present appropriate error messaging. 

|<div style={{width:100}}> **Incident level** </div>|<div style={{width:200}}> **Qualifications for level** </div>|<div style={{width:200}}> **Escalation steps** </div>|
|--------------------|--------------------|--------------------|
|**Critical incident**|<ul><li>Confidentiality or privacy is breached OR</li><li>Veteran data is at risk OR</li><li>Total product outage OR</li><li>Most or all users are impacted and the feature or functionality has direct impact on patient care or financial systems</li></ul>|<ul><li> Incident Commander will declare an incident in #vfs-platform-support if one has not already been created, and with the “Incident” label. Please follow the Incident Handling Steps in the VFS Incident Playbook for instructions.</li><li>The VA Product Owner will initiate the Major Incident Management Playbook.</li></ul>|
|**Priority/Major incident**|<ul><li>Most or all users are impacted and there is risk to patient care or financial systems</li><li>core functionality is significantly impacted</li></ul>|<ul><li>Incident Commander will declare an incident in #vfs-platform-support if one has not already been created, and with the “Incident” label. Please follow the Incident Handling Steps in the VFS Incident Playbook for instructions.</li><li>The VA Product Owner will initiate the Major Incident Management Playbook.</li></ul>|
|**Moderate/Medium incident**|<ul><li>there is direct impact or risk to patient care or financial systems for a limited number of Veterans (> 2,500 Veterans/day) OR</li><li>one or more services is unavailable to 10% or less of veterans</li></ul>| As a rule, no escalation is needed for medium incidents but the Incident Commander can choose to escalate at their discretion.|
|**Minor/Low incident**|<ul><li>Impact is very localized or affects few Veterans</li><li>Some functionality is unavailable, but there’s a workaround</li><li>The app does not look the way it should, but it doesn’t affect functionality</li><li>Degradation in service to customers that are not Veterans</li></ul>|As a rule, no escalation is needed for minor incidents but the  Incident Commander can choose to escalate at their discretion.|

Additional Incident Matrix documentation: [VA Major Incident Management Team Matrix](https://depo-platform-documentation.scrollhelp.site/developer-docs/incident-response-documentation-for-application-te#Incidentresponsedocumentationforapplicationteams-Determinetheincidentpriorityusingthismatrix:)


## Step three - Communicate with Veterans and Stakeholders
In addition to the Incident Commander's communication requirements, consider others you may need to keep informed, including:

**Veterans**
Use appropriate tooling and communication channels to ensure Veterans are aware of the issue as necessary and do not spend time doing work that will be lost. This may include:

* Adding an [availability framework](https://department-of-veterans-affairs.github.io/va-mobile-app/gettingStarted/AppFeatures/Availability%20Framework/#how-to-enable) message (FE or BE)
* Disabling a given feature via [remote config](https://department-of-veterans-affairs.github.io/va-mobile-app/development/FrontEnd/RemoteConfig)

**Stakeholders**
Ensure that your VA points of contact are informed and aware of the issue, its impact, and expected resolution timeline. Please include a link to issues and/or slack conversations so that they may keep up to date on progress.


## Step four - [Diagnosis and determine path to resolution](https://department-of-veterans-affairs.github.io/va-mobile-app/communityAndSupport/Incident%20Response/Playbook/#diagnosing-and-resolving-the-incident)

1. Determine the root cause 
    1. Go wide, then go deep. First verify the overall state of the system. Is it a particular API endpoint that is unavailable, or the whole API? Isolate what parts of the system are actually affected.
    2. Rule out external factors. Given the nature of vets-api as a facade over other VA systems, check whether any relevant upstream dependencies are unavailable or experiencing elevated error rates. In this case the likely response process will be to notify the team responsible for the upstream system, and if possible, set a maintenance window in PagerDuty to trigger the downtime notification mechanism.
    3. Don't forget about non-API dependencies such as the VA network gateways that sit in front of our backend services. If these are experiencing an issue it's almost certainly also affecting VA.gov and possibly the VA as a whole.
    4. Look for what changed. If a behavior began suddenly, determine if anything changed recently that can account for it - did an API deployment occur? Did the Web Platform operations team change some infrastructure?
    5. Look inward. Is there something we did that caused the issue? Sometimes certs expire and upstream terms of services need to be accepted without our knowledge.
    6. Refer to [Triaging an Incident](https://depo-platform-documentation.scrollhelp.site/support/va-platform-incident-playbook#VAPlatformIncidentPlaybook-TriaginganIncident) steps as necessary
2. The incident commander should capture notes, discussions, and other items (screenshots, log messages, etc.) that can act as a part of the record of the incident for later reporting to stakeholders, and to assist the team when a retrospective is conducted.
3. Consider the Amount of time to next natural release
4. Recommendation for mitigation and any applicable execution
5. The Incident Commander continues to  communicate the current state and process in the incident thread with relevant details

## Step Five - [After incident](https://department-of-veterans-affairs.github.io/va-mobile-app/communityAndSupport/Incident%20Response/Playbook/#after-the-incident)

A post-mortem report and retro are required for incidents which 

* are determined to be Critical or High priority, including those which involve the security of a system or a Veteran's data
* require the use of a playbook
* impact a significant portion of the userbase
* persists for a significant period of time
* requires out-of-app coordination or an out-of-band app release
* OCTO leadership requests

**Post Mortems**
The goal of the postmortem is not to assign blame, but to improve our ability to prevent, detect, and respond to future incidents. Possible follow-up actions that may result include adding additional monitoring, adding implementation safeguards, tuning alerts, adding documentation, and refining inter-team communication processes.

* Follow the instructions to create a [postmortem document](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/tree/master/Postmortems) and get a draft up within 24 hours. 
* Follow the instructions for the [Incident Retrospective process](https://depo-platform-documentation.scrollhelp.site/support/va-platform-incident-playbook#VAPlatformIncidentPlaybook-IncidentRetrospectiveProcess)
* Ensure that your team’s VA points of contact are aware of the incident resolution and given a chance to review the post-mortem as well as the VA Platform’s points of contact (Steve Albers and Erika Washburn)
* If the incident is such that it may occur again in the future – or if it follows a theme common to incidents in the past – add the incident and the steps to resolve it as a Mobile Incident Response Play.



