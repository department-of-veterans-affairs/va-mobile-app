---
sidebar_position: 1
sidebar_label: Overview
---
# Circle CI

## Overview
All of our builds happen in CircleCI workers. At the time this is written, CircleCI has better ability to make and reuse pieces of the build process. 

The build system currently allows us to build in multiple ways and for multiple configurations.

:white_check_mark:  Staging API or Production API

:white_check_mark:  Special Release Candidate configuration

:white_check_mark:  Options to upload to a specific lane or Test Flight group

:white_check_mark:  Configurations to create one-off builds for feature branch testing prior to merging

:white_check_mark:  Queueing capabilities to avoid build collisions on build numbers

:white_check_mark:  Automated testing and linting

:white_check_mark:  Dependency installation and caching to speed up delivery

:white_check_mark:  Slack integration to send useful messages to our DSVA Slack channels to raise errors and to indicate success

## Images
Current list of runners that we have for each job
```yaml
  default:
    docker:
      - image: cimg/ruby:3.0.2-node
  android:
    docker:
      - image: cimg/android:2022.09.2-node
    resource_class: xlarge
  ios:
    macos:
      xcode: 13.4.1
```
- [Default](https://circleci.com/docs/circleci-images/#ruby)
- [Android](https://circleci.com/docs/circleci-images/#android)
- [Mac](https://circleci.com/docs/using-macos/)

## Local Testing
You can run and check your `.config` file locally with the [CircleCI CLI Tool](https://circleci.com/docs/local-cli/)

