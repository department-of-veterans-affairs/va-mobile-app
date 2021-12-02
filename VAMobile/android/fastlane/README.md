fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android qa
```
fastlane android qa
```
Deploy a QA new version to the Google Play
### android review
```
fastlane android review
```
Build new Production version for Google Play and stash in Pre-Prod Stash track
### android release
```
fastlane android release
```
Promote the release in Pre-Prod stash to Production
### android on_demand
```
fastlane android on_demand
```
Lane for non-automated build calls. Should only run from a local machine and requires signing certs
### android firebase_app_dist_add_testers
```
fastlane android firebase_app_dist_add_testers
```
add a tester to Firebase Distribution. options.emails is a comma-separated string of emails to add to testers. Once added, they will need to be added to the QA team in Firebase Distribution console.
### android firebase_app_dist_remove_testers
```
fastlane android firebase_app_dist_remove_testers
```
remove a tester from Firebase Distribution. options.emails is a comma-separated string of emails to remove to testers.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
