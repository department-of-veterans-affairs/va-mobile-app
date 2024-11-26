---
name: Release Review Template
about: Template for requesting a production release for VA mobile app
title: "{{ env.releaseDate }} Release Sign-Off: {{ env.versionNumber }}"
labels: release
assignees: timwright12, chrisj-usds, dumathane, rachelhanster, SarahHuber-AdHoc, DonMcCaugheyUSDS, TKDickson

---

# Release for {{ env.releaseDate }}
This ticket is to control for all the requirements for the upcoming release before the Pull Request is opened. This should hold any tasks or bug fixes unique to the release branch. It should also collect any text for What's New and any content changes for the app stores.

This ticket should be complete by {{ env.vaDueDate }}
## Release Checklist

- [ ] What's new content (App Store) - *required*
- [ ] What's new content (In app/Alert Box) - *optional*
- [ ] Content updates

## Sign-offs: 
<!-- All groups should check the box when they approve --> 
- [ ] QA **Due {{ env.qaDueDate }}**
- [ ] Product **Due {{ env.prodDueDate }}**
- [ ] Mobile Release Manager **Due after 10am EST {{ env.vaDueDate }}** 

## Release version
<!-- Automated value, do not change -->
{{ env.versionNumber }}

## What's New content (App Store) - *required*
<!-- Define the content for the What's New sections of the app stores here -->
If there aren't any new features, use standard messaging: We added general improvements and fixed a few bugs.

If a Flagship team decides to update the App Stores What's New content, their work should be done in a ticket and provided to the release manager, who will then update this section. If not provided, it's assumed not to be used. 

## What's New content (In App/Alert Box) - *optional*
<!-- Define the content for the What's New alert box here -->
This work is to be completed by Flagship teams before RC branch is cut and completed by engineering. Flagship team to provide release manager with the ticket this work was completed in for reference. 

## App Store content changes?
All changes should be made to the files in the repo and not directly to the stores. 
Indicate NA if no changes.

- [ ] Images: 
- [ ] Content:
- [ ] Other (Privacy Policy, Promotions etc.):

## Severe bugs:
<!-- Link any severe bug tickets here and indicate if they need review or if they are scheduled/blocked. Reminder Sev-1 bugs to be fixed immediately, Sev-2 in 1 to 2 sprints after identified, and Sev-3 bugs to be prioritized using the team's tech debt capacity -->
{{ env.issues }}

## Regression Testing
[QA Testrail Regression Test Run Here](^^^Testrail-url^^^)

