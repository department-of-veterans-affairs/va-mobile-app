---
name: Release Review Template
about: Template for requesting a production release for VA mobile app
title: "{{ env.releaseDate }} Release Sign-Off: {{ env.versionNumber }}"
labels: release
assignees: timwright12, MekoHong, DJUltraTom, chrisj-usds, drjecker, narin, bischoffa, dumathane, rachelhanster

---

# Release for {{ env.releaseDate }}
This ticket is to control for all the requirements for the upcoming release before the Pull Request is opened. This should hold any tasks or bug fixes unique to the release branch. It should also collect any text for What's New and any content changes for the app stores.

This ticket should be complete by {{ env.vaDueDate }}
## Release Checklist

- [ ] What's new content (App Store)
- [ ] What's new content (In app/Alert Box)
- [ ] Content updates

## Sign-offs: 
<!-- All groups should check the box when they approve --> 
- [ ] QA **Due {{ env.qaDueDate }}**
- [ ] Product **Due {{ env.prodDueDate }}**
- [ ] VA **Due {{ env.vaDueDate }}**

## Release version
<!-- Automated value, do not change -->
{{ env.versionNumber }}

## What's New content (App Store)
<!-- Define the content for the What's New sections of the app stores here -->
You can now [describe xyz new feature(s)]. We’ve also [enhanced or improved abc] and fixed a few bugs.

Or if there aren't any new features use standard messaging: We added general improvements and fixed a few bugs.

## What's New content (In App/Alert Box)
<!-- Define the content for the What's New alert box here -->
All changes should be coordinated with Engineering Team.

## App Store content changes?
All changes should be made to the files in the repo and not directly to the stores. 
Indicate NA if no changes.

- [ ] Images: 
- [ ] Content:
- [ ] Other (Privacy Policy, Promotions etc.):

## Severe bugs:
<!-- Link any severe bug tickets here and indicate if they need review or if they are scheduled/blocked -->
{{ env.issues }}


