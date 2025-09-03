---
title: Mobile Incident Response Plays
---

# Mobile Incident Response Plays

As a team, we must anticipate and prepare for major issues and common outages. And as we tackle issues and gain firefighting experience as team, we will undoubtably encounter common themes or repeats of similar issues. This section is an attempt to document plays containg steps or tips to fix those major issues, common outages, or recurring issues.

Having an existing play does not abdicate you of your responsibility to follow the playbook and alert the proper people. But it should serve as a guide to help you more quickly resolve problems.

## Overall Tips

There are a few overarching tips that are applicable across issues. Use your best judgement on when to apply each.

- When possible, work in the open.
- When finished, contribute back to this list of plays.
- It's often preferable to create a temporary Slack channel – instead of a direct message group – to address issues and maintain a historical record. Use your best judgement on when to create a channel; when in doubt, work in the open.
- Check to see if the issue is impacting mobile, vets-api, or the wider VA. If it's more than mobile, find the right people and inform them of the issue; never assume someone else will do the job.
- Don't be afraid to escalate an issue.
- Involve the Product Owner when working across teams, when the issue impacts a large number of Veterans, or when there is a security or information breach.
- Be a champion for our issues; squeaky wheels get fixed.

## Plays

**Jump to plays**

- [App Crash](#app-crash)
- [General Identity](#general-identity)
- [SSOe OAuth](#ssoe-oauth)
- [DNS](#dns)

### App Crash

App crashes occur for a wide variety of reasons with a wide variety of consequences. Some must be immediately addressed, while others can wait to be fixed until the next on-cycle deploy.

#### Manifestation 

Problems usually manifest themselves as Veterans not being able to see their data once they're signed in, or as Veterans seeing the wrong data.

#### Detection

For these types of identity problems, we may be:

- [Crashlytics](https://console.firebase.google.com/u/2/project/va-mobile-app/crashlytics/app/android:gov.va.mobileapp/issues?state=open&time=last-seven-days&types=crash&tag=all&sort=eventCount) alerting.
- Alerted by the call center
- Informed of the issue in an app review
- Told of the issue through Slack

#### Correction

1. Triage the crash: determine how widespread the crash is, which platforms it occurs on, and whether it's specific to a few devices or all. Determine if the fix can be done through the backend, or if the app must be updated.
2. For a crash that impacts more than 3% of users on any platform, alert the Product Owner. (It's probably a good idea to alert the Product Owner of any recurring crash that happens more than a few times, but officially alert the Product Owner in the case of 3%.)
3. If the crash is related to bad data on the API side, fix the issue and, if necessary, request an out-of-band deploy to get the fix in place.
4. If the crash is related to the app itself, use the [severity scale](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/#issue-severity) determine your next steps.
    - If the crash is SEV-3 it may be worth waiting until the next release to fix the issue.
    - If the crash is SEV-2 it's worth fixing with an off-cycle release of the app.
    - If the crash is SEV-1 temporarily removing the app from sale should be a strong consideration. This is especially true if the crash is detected immediately following a deploy, or is somehow corrupting the device.
5. Fix the issue, test the fix, and redeploy the fix as an off-cycle app deploy if necessary. Do not make things worse by releasing another broken version.

_For widespread or catastrophic crashes, consider rebuilding and retesting the last previous stable version, and uploading that version to the store to replace the crashing version. This is often the fastest choice, and will give you time to more thorougly address the crash._

### General Identity

Identity across the VA is complicated, and identity issues may manifest themsleves in many ways. For example, problems may manifest as Veterans not being able to see their data once they're signed in, or as more complex scenarios where the wrong data is shown for a Veteran. This section addresses general identity issues; those specific to SSOe OAuth are covered in another play.

#### Manifestation

Problems usually manifest themselves as Veterans not being able to see their data once they're signed in, or as Veterans seeing the wrong data.

#### Detection

For these types of identity problems, we may be:

- Alerted by the call center
- Informed of the issue in an app review
- Told of the issue through Slack / Teams

#### Correction

These issues will generally be one-off and specific to individual Veterans. However, if there is a larger identity issue that we are the first to find, be sure to alert the Product Owner, post in #identity-support Slack channel, and follow up with a wider audience.

- Isolate the problem. Is it specific to an individual, a group, or all Veterans? Is it specific to the mobile app, or a va.gov-wide issue? Try to collect all the information you can.
- Alert the Product Owner and post the issue in #identity-support Slack channel. Be sure to add enough specifics that they can triage, but _do not_ post PII (Personal Identifiable Information) in Slack.
- If this issue happens outside of normal business hours and you deem it critical, you may post in the #oncall channel.
- If the issue is widespread or could result in the exposure of Veterans data, alert a wider audience immediately.  This should include the Product Owner and VA engineers.

### SSOe OAuth

SSOe OAuth issues are a fairly common occurrence. They usually manifest themselves by one or more credential types not being able to sign in.

#### Manifestation

 Problems usually manifest themselves by one or more credential types not being able to sign in.

#### Detection

You may detect the problem in one of many ways, including (but not limited to):

- Getting notified in the #va-mobile-app-alerts channel on Slack
- Seeing a lack of authentications for one or more credentials in our logs / monitoring software
- Receiving a notice that users are having trouble signing in
- Reading bad reviews on the app stores

#### Correction

- Check the #identity-support slack channel to see if there are widespread or known issues. If so, alert the Product Owner and continue to monitor the situation.
- If the problem is not widespread, alert the Product Owner and begin your investigation:
    - Have we changed anything lately that would impact logging in? Since we use SSOe OAuth, the answer is usually no. But perhaps we made some backend changes we should investigate.
- At the point we've determined we've not made any changes that would impact login, use Slack to escalate to the Indentity team.

### DNS

Though rare, we do encounter DNS issues from time to time. They manifest in many different ways that are almost impossible to 
predict. But when it's DNS, you'll know it.

#### Manifestation

Almost impossible to predict. You'll know, usually when all else fails to fix the problem. Often DNS issues impact a much wider audience than just our app. In those cases, you'll see complaints appear in multiple channels in Slack.

#### Detection

You may detect the problem in one of many ways, including (but not limited to):

- Seeing widespread access issues
- Seeing problems that aren't solvable in any other ways

#### Correction

Check the Slack to see if there are widespread or known issues. If so, alert the Product Owner and continue to monitor the situation.

- If the problem is not widespread, alert the Product Owner and begin your investigation.
- DNS issues fall under the purview of Gateway Ops. They are a small group with a huge amount of responsibility. Because of that, it's best to approach them with a lot of evidence that DNS is the problem. 
- It is also important to note the lack of automation in Gateway Ops. So often issues are intermittent or regionalized.
- At the point you've collected enough data, contact Gateway Ops. They are on a rotational schedule, so if you contact one of them directly they'll tell you to use the generic email address. That is, VANSOCOperationsGateWay@va.gov. When you create a ServiceNow ticket with them, it'll need to get routed to: IO.NETWORK.NOC.TICGATEWAY.
- You _MUST_ be proactive and continue to push DNS or other Gateway Issues forward. They will not get resolved on their own.
