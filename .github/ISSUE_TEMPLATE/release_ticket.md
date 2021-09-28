---
name: Release Review Template
about: Template for requesting a production release for VA mobile app
title: "{{ env.releaseDate }} Release Sign-Off: {{ env.versionNumber }}"
labels: release
assignees: lexicalninja, ayushchak, DJUltraTom, travis-newby, leanna-usds, drjecker

---

# Release for {{ env.releaseDate }}
This ticket is to control for all the requirements for the upcoming release before the Pull Request is opened. This should hold any tasks or bug fixes unique to the release branch. It should also collect any text for What's New and any content changes for the app stores.

This ticket should be complete by {{ env.vaDueDate }}
## Release Checklist

- [ ] Define version number
- [ ] Create Release Branch
- [ ] What's new text
- [ ] Content updates
- [ ] Pull request opened for review ***BE SURE TO TITLE THE PR `{{ env.versionNumber }}` WITH NOTHING ELSE***

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

## App Store content changes?
All changes should be made to the files in the repo and not directly to the stores. 
Indicate NA if no changes.

- [ ] Images: 
- [ ] Content:
- [ ] Other (Privacy Policy, etc.):

## Severe bugs:
<!-- Link any severe bug tickets here and indicate if they need review or if they are scheduled/blocked -->
