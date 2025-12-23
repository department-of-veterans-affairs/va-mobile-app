---
name: Turn on Waygate/Turn off feature flag
about: Template for feature go live check off list to turn on waygate and turn off
  feature flag.
title: "[Feature]: Turn on Waygate/Turn off feature flag"
labels: front-end
assignees: ''

---

<!-- Please fill out all of the relevant sections of this template. Please do not delete any areas of this template. The tickets can be updated as the sections are finished and any section that doesn't need to have info should be labeled as NA -->

## Description
As part of production readiness we need to complete the following pre-production go-live tasks

## Acceptance Criteria

#### Engineering
<!-- Add a checkbox for each item required to fulfill the issue. -->

1. - [ ] Ensure that waygate is set to true
2. - [ ] Turn off feature flag
3. - [ ] Add What's New In-App text (if applicable): 

#### QA
<!-- Add a checkbox for each item required to fulfill the issue. -->

1. - [ ] [Feature name] feature is on by default (visible in app after install, without touching feature flag overrides)
2. - [ ] [Feature name] waygate flag is 'on' in the developer screen after initial install
3. - [ ] [Feature name] waygate (remote) flag is 'on' in the developer screen after initial install
4. - [ ] Turning off [Feature name] waygate flag turns off the [Feature name] feature (no longer visible in app)
5. - [ ] [Feature name] non-waygate flag has no impact on whether [Feature name] displays in-app or not
6. - [ ] In demo mode, after setting in-app updates & encouraged update versions both to [release version], can see [Feature name] content in What's New banner
