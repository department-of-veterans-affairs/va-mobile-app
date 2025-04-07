---
sidebar_position: 2
sidebar_label: Scripts, Etc.
---

Lists all the reusable scripts available in the repository. 

## `on-demand-build.sh`

### Description
This script allows a developer with the correct Signing Keys stored locally to build a configured version for one of the stores. 

This version can be configured with any of the below parameters and will run the correct Fastlane script to complete the job. 
### Parameters
| Flag                        | Description                                                             | required? | type    | default?         | choose from (case sensitive)                                                                                                                                       |
|-----------------------------|-------------------------------------------------------------------------|-----------|---------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|-o OR --os            | Operating system to build for                                           | yes       | string  | none             | [ios, android]                                                                                                                                                     |
|-e OR --environment | Vets API environment to build for                                       | no        | string  | staging          | [staging, production]                                                                                                                                              |
| -b OR --branch      | Branch to checkout                                                      | no        | string  | develop          | Any GitHub Branch                                                                                                                                                  |
| -t OR --type                | Type of build                                                           | no        | string  | qa               | [qa, release, hotfix]                                                                                                                                              |
| -f OR --flight_group        | Test Flight group to build for (iOS)                                    | no        | string  | Development Team | [Development Team, Ad Hoc Production Testers, IAM Group, Push Testing, UAT Group, VA 508 Testers, VA Employee (Wide) Beta, VA Production Testers, VA Stakeholders] |
| -p OR --play_track          | Google Play Track to build for (Android)                                | no        | string  | Development Team | [Development Team, VA Production Testers]                                                                                                                          |
| -n OR --notes               | Notes to display in Test Flight or Firebase Distribution for this build | no        | string  | none             | NA                                                                                                                                                                 |
| -h OR --help                | Displays this help menu                                                 | no        | NA      | NA               | NA                                                                                                                                                                 |


### File location
[~/VAMobile.on-demand-build.sh](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/on-demand-build.sh)

---

## `production.sh`

### Description
Build an production version of Android or iOS. This will deploy to the release staging lane for the OS.

Requires that the developer have the corret certificates installed on their local machine. 
### Parameters
| Flag            | Description                   | required? | type   | default? | choose from (case sensitive)                                              |
|-----------------|-------------------------------|-----------|--------|----------|---------------------------------------------------------------------------|
| -o OR --os      | Operating system to build for | yes       | string | none     | [ios, android]                                                            |
| -v OR --version | Version name                  | yes       | string | none     | Should conform to the regular expression `/^v\d+\.\d+\.\d+/` (eg v1.1.10) |
| -h OR --help    | Displays this help menu       | NA        | NA     | NA       | NA                                                                        |

### File location

[~/VAMobile/production.sh](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/production.sh)

---

## `release_branch.sh`

### Description
This script is used by the release branch automation. because release branches happen every two weeks and chrontabs notation does not offer intervals we have this script.

#### From the help: 
>Release branch automation script
>
>This script does the following:
>1. Checks the date to see if it occurs at a 2 week interval from August 4, 2021. (If this is true, then we should cut a release branch from develop
>2. Checks out the main branch, then pulls the latest tag.
>3. Increments the latest tag by the minor version to get the next release version number
>4. Checks out and pulls latest develop branch
>5. Creates a new release branch with the correct name and pushes it up to the origin

### Parameters
None
### File location

[~/VAMobile/release_branch.sh](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/release_branch.sh)

---

