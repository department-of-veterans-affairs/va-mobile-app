---
sidebar_position: 4
sidebar_label: Workflows
---

## `pr`
### Description
This Workflow is run on PRs. It runs the lint and test jobs in order to make sure no breaking changes are merged. Fails should block the PR merging in GitHub.
### Triggers
Currently runs on every commit. Can be reviewed to see if this can be moved to GH Actions, which has triggers for only PR updates and would run less.
### Jobs
```yaml
- lint
- test
```
---

 ## `qa_build`
### Description
This workflow runs every night to create and upload the QA version of the app configured for the staging environment for both Android and iOS.

Creates a Slack thread in the channel and updates the thread with the results of each build job.
### Triggers
```yaml
cron: '0 5 * * 1,2,3,4,5'
```
Runs every Weekday at 0500 UTC on only the develop branch
### Jobs
```yaml
- start_slack_thread:
    message: 'QA build process starting. Please see :thread: for results. This process may take a while.'
- build_android_qa:
      requires:
        - start_slack_thread
- build_ios_qa:
    requires:
      - start_slack_thread
```
---

## `release_build`
### Description
This workflow runs every time a tag with v`int.int.int` pattern is pushed to the origin. It builds production versions for both Android and iOS.

Creates a Slack thread in the channel and updates the thread with the results of each build job.

### Triggers
tags matching the regular expression `/^vd+.d+.d+/`
### Jobs
```yaml
- start_slack_thread:
    message: 'Automation starting release build for the app. This build will be sent to the app stores for review upon completion. Please see :thread: for results. This process may take a while.'
    filters:
      tags:
        only: /^v\d+\.\d+\.\d+/
      branches:
        ignore: /.*/
- build_android_release:
    requires:
      - start_slack_thread
    filters:
      tags:
        only: /^v\d+\.\d+\.\d+/
      branches:
        ignore: /.*/
- build_ios_release:
    requires:
     - start_slack_thread
    filters:
      tags:
        only: /^v\d+\.\d+\.\d+/
      branches:
        ignore: /.*/
```
---

## `feature_build`
### Description
This workflow runs every time a tag with feature-build- pattern is pushed to the origin. It builds staging versions for both Android and iOS.

Creates a Slack thread in the channel and updates the thread with the results of each build job.

### Triggers
tags matching the regular expression `/^feature-build-+/`
### Jobs
```yaml
- start_slack_thread:
    message: 'On-demand feature build process starting. Please see :thread: for results. This process may take a while.'
    filters:
      tags:
        only: /^feature-build-.+/
    branches:
      ignore: /.*/
- build_android_feature:
    requires:
      - start_slack_thread
    filters:
      tags:
        only: /^feature-build-.+/
      branches:
        ignore: /.*/
- build_ios_feature:
    requires:
      - start_slack_thread
    filters:
      tags:
        only: /^feature-build-.+/
      branches:
        ignore: /.*/
```
---

## `release_candidate_build`
### Description
This workflow runs every time a tag with RC-v`int.int.int` pattern is pushed to the origin. It builds staging versions for both Android and iOS.

Creates a Slack thread in the channel and updates the thread with the results of each build job.

### Triggers
tags matching the regular expression `/^RC-v.d+.d+.d+$/`

### Jobs
```yaml
- start_slack_thread:
    message: 'Release Candidate build process starting. This build is a staging build for QA to validate and do regression testing on. Please see :thread: for results. This process may take a while.'
    filters:
      tags:
        only: /^RC-v\d+\.\d+\.\d+-\d+-\d+$/
      branches:
        ignore: /.*/
- build_android_release_candidate:
    requires:
      - start_slack_thread
    filters:
      tags:
        only: /^RC-v\d+\.\d+\.\d+-\d+-\d+$/
      branches:
        ignore: /.*/
- build_ios_release_candidate:
    requires:
      - start_slack_thread
    filters:
      tags:
        only: /^^RC-v\d+\.\d+\.\d+-\d+-\d+$/
      branches:
        ignore: /.*/
```
---

## `new_release_branch`
### Description
Workflow runs in order to create the release branch and kick off the release ticket process.
### Triggers
```yaml
 cron: '30 6 * * 3'
```
Runs every Wednesday at 0630 UTC on only the develop branch
### Jobs
```yaml
- cut_release_branch
```
---

## `go_live`
### Description
Job runs on release day to send approved versions to the stores
### Triggers
```yaml
cron: '0 14 * * 2'
```
Runs every Tuesday at 1400 UTC on only the main branch
### Jobs
```yaml
- run_release_lanes
```
---


