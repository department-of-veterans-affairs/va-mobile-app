---
title: Build automation overview
postion: 1 
---

## Releases
Our releases are made live every other Tuesday morning. A GitHub Action runs every Tuesday morning to check and see if there is a staged build ready for developer release in the Apple App Store. For Play Store, it checks to see if there is a newer build than the production lane waiting in the Pre-Prod Stash lane. If there is, they are released to production at that time and sends a message to the main va-mobile-app channel in DSVA slack. If not, it completes silently. 

Release branches are cut by an Action every other Wednesday that follows a release. The release branch acts as a freeze on the develop branch for the next release that allows QA to run regressions from a static point and allows any last-minute changes to be added before being merged to main and build for review in the stores. This release branch being created then starts automation that creates the release ticket in GitHub and assigns the relevant people.

Releases coincide with the last day of a sprint and new release branches are cut on the first day of the sprint.

Release process approval ends with an authorized person (currently a VA Product Owner) releasing the app for build and upload to the stores by running the `/approve` command in the automated release ticket. This is accomplish by adding a comment to the issue in the form of `/approve vX.Y.Z` where X.Y.Z is the next version number. This version number should be present in the title of the ticket.

Once the release is approved, the build system will create and upload production versions of the app to the App Stores for review. Barring any issues, these should be released on the next Tuesday when the release Action runs. 
##### NOTE: *Because chrontab notation doesn't have a way to schedule a job at an interval , i.e. every two weeks, the release action has to be scheduled for EVERY Tuesday. This means that if the approve command is run before the Tuesday in the middle of the sprint, the releases will go out a week early.*  

## QA Builds
### Daily Builds
Regular QA builds are distributed every weekday. These builds are based on the most current commit on the develop branch in order to provide QA with the most up-to-date versions as possible and can be augmented with the other types of builds. 

### On Demand Builds
In addition to our automatically scheduled builds, we also have the ability to create QA or UAT builds at any time from any branch, also known as On Demand builds.  The [On Demand Build Workflow](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml), which can also be found on the left hand sidebar in [GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions), allows us to specify a branch and an environment to create a build from.

### On Demand Build Script

On Demand Builds can also be run from a developers local machine to create one-off-builds for distribution to a specific team or for a specific configuration. These builds use the [on-demand script](Automation%20Code%20Docs/Scripts.md/#on-demand-buildsh) and require the developer to have a copy of the signing certificates and keychains on their local machine. 

This type of build is usually for very specific builds the developer wants to distribute to other tracks in Test Flight and Play Store. It is also here as a back-up in case the automated build system experiences issues. This allows for manual kick-off of a build, but guarantees that the build will be, at minimum, configured and built correctly. 
