---
name: Detox Nightly Build Failure Template
about: Template for reporting a detox nightly build failure
title: "Bug - {{ env.dateOfIssue }}: {{ env.OS }} - Detox Nightly Build failure"
title: "Bug - Detox - Fix Overnight Failures"
labels: bug, QA and Release 
assignees: rbontrager

---

## What failed
Some detox tests have failed in the overnight build.  Here is a list:

{{env.dateOfIssue}} {{env.OS}}: {{issues}}


