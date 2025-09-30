---
title: QA builds
---

### Daily Builds

Regular QA builds are distributed every weekday. These builds are based on the most current commit on the develop branch in order to provide QA with the most up-to-date versions as possible and can be augmented with the other types of builds.

### On Demand Builds

In addition to our automatically scheduled builds, we also have the ability to create QA or UAT builds at any time from any branch, also known as On Demand builds. The [On Demand Build Workflow](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml), which can also be found on the left hand sidebar in [GitHub Actions](https://github.com/department-of-veterans-affairs/va-mobile-app/actions), allows us to specify a branch and an environment to create a build from ([steps listed out in QA documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/development/DevOps/Overview#on-demand-builds)).

### On Demand Build Script

On Demand Builds can also be run from a developers local machine to create one-off-builds for distribution to a specific team or for a specific configuration. These builds use the [on-demand script](../DevOps/AutomationCodeDocs/Scripts#on-demand-buildsh) and require the developer to have a copy of the signing certificates and keychains on their local machine.

This type of build is usually for very specific builds the developer wants to distribute to other tracks in Test Flight and Play Store. It is also here as a back-up in case the automated build system experiences issues. This allows for manual kick-off of a build, but guarantees that the build will be, at minimum, configured and built correctly.
