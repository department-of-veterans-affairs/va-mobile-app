---
title: Automation
---

## Releases

Our releases are made live every other Tuesday morning. A GitHub Action runs every Tuesday morning to check and see if there is a staged build ready for developer release in the Apple App Store. For Play Store, it checks to see if there is a newer build than the production lane waiting in the Pre-Prod Stash lane. If there is, they are released to production at that time and sends a message to the main va-mobile-app channel in DSVA slack. If not, it completes silently.

Release branches are cut by an Action every other Wednesday that follows a release. The release branch acts as a freeze on the develop branch for the next release that allows QA to run regressions from a static point and allows any last-minute changes to be added before being merged to main and build for review in the stores. This release branch being created then starts automation that creates the release ticket in GitHub and assigns the relevant people.

Releases coincide with the last day of a sprint and new release branches are cut on the first day of the sprint.

Release process approval ends with an authorized person (currently a VA Product Owner) releasing the app for build and upload to the stores by running the `/approve` command in the automated release ticket. This is accomplish by adding a comment to the issue in the form of `/approve vX.Y.Z` where X.Y.Z is the next version number. This version number should be present in the title of the ticket.

Once the release is approved, the build system will create and upload production versions of the app to the App Stores for review. Barring any issues, these should be released on the next Tuesday when the release Action runs.

:::note
Because chrontab notation doesn't have a way to schedule a job at an interval , i.e. every two weeks, the release action has to be scheduled for EVERY Tuesday. This means that if the approve command is run before the Tuesday in the middle of the sprint, the releases will go out a week early.  
:::