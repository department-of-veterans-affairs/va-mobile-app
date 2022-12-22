---
sidebar_location: 2 
sidebar_label: Commands
---

This is a list of all the reusable commands in CircleCI, their parameters and what they do.

## `install_deps`

### Description

This command runs the scripts that install base build dependencies and set up the ENV files for the configuration.

The command checks the lock to see if it matches the cached dependencies. It then installs yarn with npm, runs a yarn
install to catch any missed dependencies from the cache.

Once complete, it then runs the yarn env: command for the specified environment

It then saves the yarn cache, installs the bundler gem and then exits.

This command should be used for any setup that is universal to *all* the builds.

### Parameters

| Name        | Description                                               | type   | default? |
|-------------|-----------------------------------------------------------|--------|----------|
| environment | String value for the api environment to use for the build | string | staging  |

### Steps

```yaml
- restore_cache:
    key: yarn-v1-{{ checksum "VAMobile/yarn.lock" }}-{{ arch }}
- run:
    command: |
      echo INSTALLING YARN
      npm install yarn
      echo INSTALLING NODE MODULES
      cd VAMobile
      yarn install --frozen-lockfile --non-interactive
      echo CREATING ENV FILE FOR env:<<parameters.environment>>
      yarn env:<<parameters.environment>>
- save_cache:
    key: yarn-v1-{{ checksum "VAMobile/yarn.lock" }}-{{ arch }}
    paths:
      - VAMobile/node_modules
- run:
    command: |
      echo INSTALLING BUNDLER
      sudo gem install bundler
```

### Outputs

None

---

## `install_python`

### Description

This command is used to install the python dependencies for any hosted runner that does not have it installed by
default. Python is required for the queueing scripts.

This command updates apt-get, installs python3-pip with apt-get, and installs the requests plugin for py3

### Parameters

None

### Steps

```yaml
- run: sudo apt-get update
- run: sudo apt-get install python3-pip
- run: python3 -m pip install requests
```

### Outputs

None

---

## `bundle_app`

### Description

Bundles the app for the OS specified using the React Native bundle command

### Parameters

| Name | Description                                          | type   | default? |
|------|------------------------------------------------------|--------|----------|
| os   | String value for the OS to build for. [android, ios] | string | none     |

### Steps

```yaml
- run:
  working_directory: ~/project/VAMobile
  command: yarn bundle:<<parameters.os>>
```

### Outputs

None

---

## `lint`

### Description

Runs the lint checks for the app. Lints error on any warnings.

### Parameters

None

### Steps

```yaml
- run:
  working_directory: ~/project/VAMobile
  command: yarn lint:ci
  when: always
```

### Outputs

None

---

## `jest`

### Description

Runs the automated unit tests with jest using [time splitting](https://circleci.com/docs/parallelism-faster-jobs/).

### Parameters

None

### Steps

```yaml
- run:
  working_directory: ~/project/VAMobile
  command: |
    TEST=$(circleci tests glob "src/**/*.test.ts*" | circleci tests split --split-by=timings)
    yarn test $TEST -w 2
  when: always
- store_test_results:
  path: VAMobile/coverage/junit/
- store_artifacts:
  path: VAMobile/coverage/junit/
```

### Outputs

None

---

## `install_pods`

### Description

Installs the cocoa pods for any iOS builds. Not needed for Android builds. This command loads cached pods with the
pod-lock checksum at the start and saves to a cache at the end for faster builds when there have been no changes to
those files.

### Parameters

None

### Steps

```yaml
- restore_cache:
  key: pods-v1-{{ checksum "VAMobile/ios/Podfile.lock" }}-{{ arch }}
- run:
  working_directory: ~/project/VAMobile/ios
  command: |
    echo INSTALL COCOA PODS
    pod check || pod install
- save_cache:
  key: pods-v1-{{ checksum "VAMobile/ios/Podfile.lock" }}-{{ arch }}
  paths:
    - VAMobile/ios/Pods
```

### Outputs

None

---

## `create_keys_directory`

### Description

creates a directory for the google keys because that folder is ignored by git

### Parameters

None

### Steps

```yaml
- run:
  command: mkdir VAMobile/android/keys
```

### Outputs

None

---

## `decode_file`

### Description

Decodes a base64 string to a file and saves it to the specified path

### Parameters

| Name         | Description                                      | type   | default? |
|--------------|--------------------------------------------------|--------|----------|
| workingDir   | String value for the directory to decode file to | string | none     |
| secretString | base64 string value to decode                    | string | none     |
| destination  | Filename to save as                              | string | none     |

### Steps

```yaml
- run:
  working_directory: <<parameters.workingDir>>
  command: |
    # decode base64 secret string
    echo <<parameters.secretString>> | base64 --decode | tee <<parameters.destination>> >/dev/null
```

### Outputs

None

---

## `decode_ios_keys`

### Description

This command decodes all the files needed to build and sign for iOS. It currently decodes a signing cert and a
provisioning profile, but that may not be necessary because of match and can be tested for removal of the
IOS_CERTIFICATE_BASE64 and IOS_PROVISIONING_BASE64.

### Parameters

None

### Steps

```yaml
- decode_file:
  workingDir: '~/project/VAMobile/ios'
  secretString: ${IOS_CERTIFICATE_BASE64}
  destination: ${IOS_CERTIFICATE_PATH}
- decode_file:
  workingDir: '~/project/VAMobile/ios'
  secretString: ${IOS_CERTIFICATE_BASE64}
  destination: ${IOS_PROVISIONING_PATH}
- decode_file:
  workingDir: '~/project/VAMobile/ios'
  secretString: ${APPSTORE_CONNECT_BASE64}
  destination: ${APPSTORE_CONNECT_FILEPATH}
- decode_file:
  workingDir: '~/project/VAMobile/ios'
  secretString: ${IOS_GS_PLIST_BASE64}
  destination: ${IOS_GS_PLIST_PATH}
```

### Outputs

None

---

## `ios_fastlane`

### Description

This command runs all the steps and commands in order to build for iOS. This is a configurable commands that will build
and upload to Test Flight based on the configuration options sent in.

This command loads cached gems at the beginning and saves them at the end for faster builds with fastlane and its
plugins.

This command sets the vendor directory for ruby and updates the fastlane bundle app.

If a slack thread is indicated it will get that information from the attached workspace. It then runs the fastlane
script with the available configuration.

### Parameters

| Name             | Description                                                                                            | type    | default? |
|------------------|--------------------------------------------------------------------------------------------------------|---------|----------|
| version          | String value for the build type. Options are 'qa' or a version string like 'v1.1.1'                    | string  | qa       |
| lane             | String name for the fastlane lane to run [qa, demo, review, release, on_demand, rc]                    | string  | qa       |
| tf_group         | String name of the Test Flight Group to send to. See Test Flight groups in AppStoreConnect for options | string  |          |
| use_slack_thread | Boolean value to indicate if a Slack thread should be pulled from an attached workspace                | boolean | true     |
| notes            | String value for notes that show up in description in Test Flight                                      | string  |          |

### Steps

```yaml
- restore_cache:
  key: bundle-v1-{{ checksum "VAMobile/ios/Gemfile.lock" }}-{{ arch }}
- run:
  working_directory: ~/project/VAMobile/ios
  command: bundle config set --local path 'vendor/bundle' && bundle install
- run:
  working_directory: ~/project/VAMobile/ios
  command: |
    echo UPDATING FASTLANE
    bundle update fastlane
- save_cache:
  key: bundle-v1-{{ checksum "VAMobile/ios/Gemfile.lock" }}
  paths:
    - VAMobile/ios/vendor/bundle
- when:
  condition: <<parameters.use_slack_thread>>
  steps:
    - get_slack_thread
- run:
  working_directory: ~/project/VAMobile/ios
  command: bundle exec fastlane <<parameters.lane>> version:<<parameters.version>> notes:"<<parameters.notes>>" tfGroup:"<<parameters.tf_group>>" --verbose
  no_output_timeout: '30m'
```

### Outputs

Uploads .ipa file to Test Flight with the configured build

---

## `decode_android_keys`

### Description

This command decodes all the keys needed to build and upload to google play

### Parameters

None

### Steps

```yaml
- decode_file:
  workingDir: '~/project/VAMobile/android/keys'
  secretString: ${GOOGLE_KS}
  destination: ${GOOGLE_KS_PATH}
- decode_file:
  workingDir: '~/project/VAMobile/android/keys'
  secretString: ${GOOGLE_SA_JSON}
  destination: ${GOOGLE_SA_PATH}
- decode_file:
  workingDir: '~/project/VAMobile/android/app'
  secretString: ${GOOGLE_SERVICES_JSON}
  destination: ${GOOGLE_SERVICES_PATH}
- decode_file:
  workingDir: '~/project/VAMobile/android/keys'
  secretString: ${FIREBASE_DIST_FILE_BASE64}
  destination: ${FIREBASE_DIST_DECODE_PATH}
```

### Outputs

None

---

## `android_fastlane`

### Description

This command runs all the steps and commands in order to build for Android. This is a configurable commands that will
build and upload to Play Store based on the configuration options sent in.

This command loads cached gems at the beginning and saves them at the end for faster builds with fastlane and its
plugins.

This command sets the vendor directory for ruby and updates the fastlane bundle app.

If a slack thread is indicated it will get that information from the attached workspace. It then runs the fastlane
script with the available configuration.

### Parameters

| Name             | Description                                                                                                                                          | type    | default? |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|---------|----------|
| version          | String value for the build type. Options are 'qa' or a version string like 'v1.1.1'                                                                  | string  | qa       |
| lane             | String name for the fastlane lane to run [qa, demo, review, release, on_demand, rc, firebase_app_dist_add_testers, firebase_app_dist_remove_testers] | string  | qa       |
| ps_track         | String name of the Play Store Lane to send to. See Play Store Closed Testing groups for options                                                      | string  |          |
| use_slack_thread | Boolean value to indicate if a Slack thread should be pulled from an attached workspace                                                              | boolean | true     |
| notes            | String value for notes that show up in description in Firebase Distribution                                                                          | string  |          |

### Steps

```yaml
- restore_cache:
  key: bundle-v1-{{ checksum "VAMobile/android/Gemfile.lock" }}-{{ arch }}
- run:
  working_directory: ~/project/VAMobile/android
  command: bundle check || bundle config set --local path 'vendor/bundle' && bundle install
- run:
  working_directory: ~/project/VAMobile/android
  command: |
    echo UPDATING FASTLANE
    bundle update fastlane
- save_cache:
  key: bundle-v1-{{ checksum "VAMobile/android/Gemfile.lock" }}
  paths:
    - VAMobile/android/vendor/bundle
- when:
  condition: <<parameters.use_slack_thread>>
  steps:
    - get_slack_thread
- run:
  working_directory: ~/project/VAMobile/android
  command: bundle exec fastlane <<parameters.lane>> --verbose version:<<parameters.version>> notes:"<<parameters.notes>>" psTrack:"<<parameters.ps_track>>"
```

### Outputs

.aab file sent to Play Store

---

## `run_script`

### Description

Runs a bash script.

Takes the working directory, script name and script options as params

This is useful if there is a script that needs to be run in different directories, allowing you to write once and use
everywhere.

This command runs chmod +x on the script to ensure it is executable in the CI runner.

### Parameters

| Name           | Description                                                             | type   | default?           |
|----------------|-------------------------------------------------------------------------|--------|--------------------|
| workingDir     | String value for the directory to decode file to                        | string | ~/project/VAMobile |
| script_name    | String value for the name of the script, i.e. run_me.sh                 | string | none               |
| script_options | String value for any flags or options that need to be set on the script | string | none               |

### Steps

```yaml
- run:
  working_directory: <<parameters.workingDir>>
  command: |
    chmod +x <<parameters.script_name>>
    bash <<parameters.script_name>> <<parameters.script_options>>
```

### Outputs

None

---

## `get_slack_channel_id`

### Description

Checks DSVA slack to get the channel id from a channel name.

Slack can sometimes change the channel id and channel name is not reliable to send messages so we search for the id by
channel name and set it to the BASH ENV on the runner.

### Parameters

| Name        | Description                                                          | type   | default? |
|-------------|----------------------------------------------------------------------|--------|----------|
| channelName | String of the channel name in VA DSVA Slack that you want to post to | string | none     |

### Steps

```yaml
- run:
  name: 'Find the right channel id since it can sometimes change'
  command: |
    id=$(curl -X GET -H 'Authorization: Bearer '"$SLACK_API_TOKEN"' ' \
      -H 'Content-type: application/x-www-form-urlencoded' \
      https://slack.com/api/conversations.list\?limit=1000 |
      jq '.channels[] | .name as $data | select($data == "<<parameters.channelName>>").id' )
    echo "export SLACK_CHANNEL_ID=${id}" >> $BASH_ENV
```

### Outputs

BASH_ENV::SLACK_CHANNEL_ID

---

## `send_slack_message`

### Description

Sends a slack message in the specified channel and sets the SLACK_THREAD_TS ENV var

### Parameters

| Name      | Description                                                                              | type    | default? |
|-----------|------------------------------------------------------------------------------------------|---------|----------|
| channelId | String value of the Slack channel id is VA DSVA Slack that you want to send a message to | string  | none     |
| message   | The string message that you want to send to the channel.                                 | string  | none     |

### Steps

```yaml
- run:
  name: 'Post message to slack'
  command: |
    ts=$(curl -X POST -H 'Authorization: Bearer '"$SLACK_API_TOKEN"' ' \
      -H 'Content-type: application/json' \
      --data '{"channel":"'<<parameters.channelId>>'","text":"<<parameters.message>>"}' \
      https://slack.com/api/chat.postMessage|
      jq -r '.ts')
    echo "export SLACK_THREAD_TS=${ts}" >> $BASH_ENV
```

### Outputs

BASH_ENV::SLACK_THREAD_TS

---

## `persist_env`

### Description

Persist a bash env to the workspace for other jobs

This command creates a [workspace](https://circleci.com/docs/workspaces/) in the CircleCI runner in order to share
persisted environment variables across concurrent jobs, since they are running on separate VMs

### Parameters

Name   | Description                                                                                                                                                                             | type   | default? |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------|
| envVar | Name of the environment variable to persist to a workspace, i.e. MY_ENV_VAR                                                                                                             | string | none     |
| path   | String name of workspace path. Can be whatever to just indicate a unique workspace. `save_slack_thread` uses a path of 'threadTs` to save to a unique workspace for threading messages. | string | none     |

### Steps

```yaml
- run: mkdir -p workspace
- run: echo << parameters.envVar >> > workspace/<< parameters.path >>
- persist_to_workspace:
  root: workspace
  paths:
    - << parameters.path >>
```

### Outputs

creates a workspace at `workspace/<path>` with BASH_ENV::envVar

---

## `retrieve_persisted_env`

### Description

This command pulls in a workspace and persists a BASH_ENV from that workspace onto the runner

### Parameters

| Name   | Description                                                                                | type   | default? |
|--------|--------------------------------------------------------------------------------------------|--------|----------|
| envVar | Name of the environment variable to pull from a workspace into the runner, i.e. MY_ENV_VAR | string | none     |
| path   | String name of workspace path that you would like to persist an ENV from                   | string | none     |

### Steps

```yaml
- attach_workspace:
  at: /tmp/workspace
- run:
  command: |
    echo `cat /tmp/workspace/<< parameters.path >>`
    var=$(cat /tmp/workspace/<< parameters.path >>)
    echo "export <<parameters.envVar>>=${var}" >> $BASH_ENV
```

### Outputs

BASH_ENV::envVar


---

## `save_slack_thread`

### Description

Uses the [`persist_env`](#persist_env) command to save the Thread TS variable for a Slack thread onto the workspace.

### Parameters

None

### Steps

```yaml
- persist_env:
  envVar: ${SLACK_THREAD_TS}
  path: 'threadTs
```

### Outputs

Creates a workspace at `workspace/threadTs` with BASH_ENV::SLACK_THREAD_TS persisted

---

## `get_slack_thread`

### Description

Retrieves the workspace at `workspace/threadTs` and persists the workspace SLACK_THREAD_TS to the current runner.

### Parameters

None

### Steps

```yaml
- retrieve_persisted_env:
  envVar: 'SLACK_THREAD_TS'
  path: 'threadTs'
```

### Outputs

BASH_ENV::SLACK_THREAD_TS

---

## `queue_android_jobs`

### Description

This command runs the queue job for Android builds.

Python does not come pre-installed on the Android runners in CircleCI, so this command calls
the [`install_python`](#install_python) command before it runs the queue script

The BUILD_REGEX value is saved to the BASH_ENV so that the queue script can pick up the job filter

### Parameters

| Name  | Description                                                                                                                                                        | type   | default?        |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|-----------------|
| regex | Regular expression string for the filtering of jobs in the queue. Usually just '^build_android_' or '^build_ios_' but can be any filter of job names in the config | string | ^build_android_ |

### Steps

```yaml
- run: echo "export BUILD_REGEX=<<parameters.regex>>" >> $BASH_ENV
- install_python
- run:
  working_directory: ~/project/VAMobile
  command: python3 queue-builds.py  
```

### Outputs

None

---

## `queue_ios_jobs`

### Description
This command runs the queue job for iOS builds.

Pyhton3 is pre-installed on the Mac runners, but does not have the requests plugin installed. This command installs that plugin before running the script.

The BUILD_REGEX value is saved to the BASH_ENV so that the queue script can pick up the job filter
### Parameters

| Name  | Description                                                                                                                                                        | type   | default?        |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|-----------------|
| regex | Regular expression string for the filtering of jobs in the queue. Usually just '^build_android_' or '^build_ios_' but can be any filter of job names in the config | string | ^build_ios_ |


### Steps

```yaml
- run: echo "export BUILD_REGEX=<<parameters.regex>>" >> $BASH_ENV
- run: python3 -m pip install requests
- run:
  working_directory: ~/project/VAMobile
  command: python3 queue-builds.py
```

### Outputs

None
