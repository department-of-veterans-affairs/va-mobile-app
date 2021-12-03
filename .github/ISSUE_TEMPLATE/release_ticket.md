---
name: Release Review Template
about: Template for requesting a production release for VA mobile app
title: "{{ env.releaseDate }} Release Sign-Off: {{ env.versionNumber }}"
labels: release
assignees: lexicalninja, MekoHong, DJUltraTom, travis-newby, leanna-usds, drjecker, b-rocha

---

# Release for {{ env.releaseDate }}
This ticket is to control for all the requirements for the upcoming release before the Pull Request is opened. This should hold any tasks or bug fixes unique to the release branch. It should also collect any text for What's New and any content changes for the app stores.

This ticket should be complete by {{ env.vaDueDate }}
## Release Checklist

- [ ] What's new text
- [ ] Content updates

## Sign-offs: 
<!-- All groups should check the box when they approve --> 
- [ ] QA **Due {{ env.qaDueDate }}**
- [ ] Product **Due {{ env.prodDueDate }}**
- [ ] VA **Due {{ env.vaDueDate }}**

## Release version
<!-- Automated value, do not change -->
{{ env.versionNumber }}

## What's New content
<!-- Define the content for the What's New sections of the app stores here -->
You can now [describe xyz new feature(s)]. We’ve also [enhanced or improved abc] and fixed a few bugs.

Or if there aren't any new features use standard messaging: We added general improvements and fixed a few bugs.

## App Store content changes?
All changes should be made to the files in the repo and not directly to the stores. 
Indicate NA if no changes.

- [ ] Images: 
- [ ] Content:
- [ ] Other (Privacy Policy, etc.):

## Severe bugs:
<!-- Link any severe bug tickets here and indicate if they need review or if they are scheduled/blocked -->
{{ env.issues }}
