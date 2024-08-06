---
name: Detox Nightly Build Failure Template
about: Template for reporting a detox nightly build failure
title: "Bug - Detox - Fix Overnight Failures"
labels: bug, QA and Release 
assignees: rbontrager

---

## What failed
Some detox tests have failed in the overnight build. Failures can be found [here](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/e2e_ios.yml) for iOS and [here](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/e2e_android.yml) for Android. Please look at the list for what might be failing.

Here is a list:

- {{env.dateOfIssue}} {{env.OS}}: {{issues}}


