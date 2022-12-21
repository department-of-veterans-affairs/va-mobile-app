---
sidebar_location: 2
sidebar_label: Commands
---

This is a list of all the reusable commands in CircleCI, their parameters and what they do. 

## `install_deps`
### Description
This command runs the scripts that install base build dependencies and set up the ENV files for the configuration.

The command checks the lock to see if it matches the cached dependencies. It then installs yarn with npm, runs a yarn install to catch any missed dependencies from the cache.

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
This command is used to install the python dependencies for any hosted runner that does not have it installed by default. Python is required for the queueing scripts.

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
Installs the cocoa pods for any iOS builds. Not needed for Android builds.
This command loads cached pods with the pod-lock checksum at the start and saves to a cache at the end for faster builds when there have been no changes to those files.
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
This command decodes all the files needed to build and sign for iOS. It currently decodes a signing cert and a provisioning profile, but that may not be necessary because of match and can be tested for removal of the IOS_CERTIFICATE_BASE64 and IOS_CERTIFICATE_BASE64.

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
### Parameters
### Steps
```yaml

```
### Outputs

---

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

---

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs



---
