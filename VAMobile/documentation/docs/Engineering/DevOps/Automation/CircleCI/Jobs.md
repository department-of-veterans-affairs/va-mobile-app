---
sidebar_position: 3
sidebar_label: Jobs
---
This is a list of all the reusable commands in CircleCI what they do.

## `lint`

### Description
This reusable job spins up an instance, installs dependencies and runs the lint command to check for lint errors. Should be run before builds and merges.
### Image (see [Images](Overview.md/#Images))
default
### Steps
```yaml
- checkout
- install_deps
- lint
```

---

## `test`

### Description
Reusable job that runs the Unit tests. This runs them with parallelism in order to complete them faster and runs on an x-large resource container.
### Image (see [Images](Overview.md/#Images))
default
### Steps
```yaml
- checkout
- install_deps
- jest
```

---

## `start_slack_thread`

### Description
Reusable job that sends a message to the va-mobile-app channel in DSVA slack and starts a thread to keep from cluttering the Slack feed.
### Image (see [Images](Overview.md/#Images))
default
### Parameters
| Name    | Description                                                                           | type   | default? |
|---------|---------------------------------------------------------------------------------------|--------|----------|
| message | String value of the message that will serve as the top of the thread in Slack channel | string | none     |

### Steps
```yaml
- get_slack_channel_id:
    channelName: 'va-mobile-app'
- send_slack_message:
    message: << parameters.message >>
    channelId: ${SLACK_CHANNEL_ID}
- save_slack_thread
```

---

## `build_ios_qa`

### Description
Reusable job that runs the iOS build commands and is configured for daily QA builds.
### Image (see [Images](Overview.md/#Images))
ios
### Steps
```yaml
- checkout
- install_deps
- decode_ios_keys
- install_pods
- bundle_app:
    os: 'ios'
- queue_ios_jobs
- ios_fastlane
```

---

## `build_android_qa`

### Description
Reusable job that runs the Android build commands and is configured for daily QA builds.

### Image (see [Images](Overview.md/#Images))
android
### Steps
```yaml
- checkout
- install_deps
- create_keys_directory
- decode_android_keys
- bundle_app:
    os: 'android'
- queue_android_jobs
- android_fastlane
```

---

## `build_ios_feature`

### Description
Reusable job that runs the iOS build commands and is configured to run off a tag. Release Notes will use the git tag to generate a readable string.
Sends all builds to the Development Team in Test Flight
### Image (see [Images](Overview.md/#Images))
ios
### Steps
```yaml
- checkout
- install_deps
- decode_ios_keys
- install_pods
- bundle_app:
    os: ios
- queue_ios_jobs
- ios_fastlane:
    lane: on_demand
    notes: ${CIRCLE_TAG}
    tf_group: Development Team
```

---

## `Name`

### Description
Reusable job that runs the Android build commands and is configured to run off a tag. Release Notes will use the git tag to generate a readable string.
Sends all builds to the Development Team track in the Play Store
### Image (see [Images](Overview.md/#Images))
android
### Steps
```yaml
- checkout
- install_deps
- create_keys_directory
- decode_android_keys
- bundle_app:
    os: android
- queue_android_jobs
- android_fastlane:
    lane: on_demand
    notes: ${CIRCLE_TAG}
    ps_track: Development Team
```

---

## `cut_release_branch`

### Description
This reusable command calls the `release_branch.sh` script in order to create a new branch to freeze for release.
### Image (see [Images](Overview.md/#Images))
default
### Steps
```yaml
- checkout
- run_script:
    script_name: 'release_branch.sh'
    script_options: ''
    workingDir: '~/project/VAMobile'
```

---

## `build_ios_release`

### Description
Reusable command that builds a production version of the app for review by the App Store.
The CIRCLE_TAG will be the version number, i.e. 'v1.1.1'
### Image (see [Images](Overview.md/#Images))
ios
### Steps
```yaml
- checkout
- install_deps:
    environment: 'production'
- decode_ios_keys
- install_pods
- bundle_app:
    os: 'ios'
- queue_ios_jobs
- ios_fastlane:
    version: ${CIRCLE_TAG}
    lane: 'review'
```

---

## `build_android_release`

### Description
Reusable command that builds a production version of the app for review by the Play Store.
The CIRCLE_TAG will be the version number, i.e. 'v1.1.1'
### Image (see [Images](Overview.md/#Images))
android
### Steps
```yaml
- checkout
- install_deps:
    environment: 'production'
- create_keys_directory
- decode_android_keys
- bundle_app:
    os: 'android'
- queue_android_jobs
- android_fastlane:
    version: ${CIRCLE_TAG}
    lane: 'review'
```

---

## `run_release_lanes`

### Description
This reusable command runs the `release` lanes in the fastfiles in order to release any pending versions that have been approved by the stores. 
### Image (see [Images](Overview.md/#Images))
default
### Steps
```yaml
- checkout
- create_keys_directory
- decode_ios_keys
- decode_android_keys
- android_fastlane:
    lane: 'release'
    use_slack_thread: false
- ios_fastlane:
    lane: 'release'
    use_slack_thread: false
```

---

## `build_android_release_candidate`

### Description
Reusable job that runs the Android build commands and is configured to build with the special release candidate configurations for the QA team.
Sends all builds to the Development Team track in the Play Store

### Image (see [Images](Overview.md/#Images))
android
### Steps
```yaml
- checkout
- install_deps
- create_keys_directory
- decode_android_keys
- bundle_app:
    os: 'android'
- queue_android_jobs
- android_fastlane:
    lane: 'rc'
```

---

## `build_ios_release_candidate`

### Description
Reusable job that runs the iOS build commands and is configured to build with the special release candidate configurations for the QA team.
Sends all builds to the Development Team track in the Test Flight

### Image (see [Images](Overview.md/#Images))
ios
### Steps
```yaml
- checkout
- install_deps
- decode_ios_keys
- install_pods
- bundle_app:
    os: 'ios'
- queue_ios_jobs
- ios_fastlane:
    lane: 'rc'
```

---
