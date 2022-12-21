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

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

## `Name`
### Description
### Parameters
### Steps
```yaml

```
### Outputs

