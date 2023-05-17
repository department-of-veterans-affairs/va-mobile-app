# Firebase Signing Keys

## Overview
In order to use any of the Firebase plugins in our application we need to include the correct configuration keys in the build. 

The current Firebase configuration files can be downloaded from the [project page settings page](https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp)

If you need to create new keys because they were leaked or for any other reason you will need to follow the [Getting Started Menu here](https://firebase.google.com/docs/guides?authuser=0).

Android QA and other staging versions are distributed with Firebase Distribution and this file is also help in a base64 string in the CI

## Location in the CI
Apple and Android certificates are stored in GitHub as base64 strings that are decoded by the CI when they are needed.

### ENV Constants for the keys
| Key Name                     | ENV String                | Location ENV String       | Decoded Location                                    | CI Command          |
|------------------------------|---------------------------|---------------------------|-----------------------------------------------------|---------------------|
| Apple Google Services plist  | IOS_GS_PLIST_BASE64       | IOS_GS_PLIST_PATH         | ~/project/VAMobile/ios/GoogleService-Info.plist     | decode_ios_keys     |
| Android Google Services json | GOOGLE_SERVICES_JSON      | GOOGLE_SERVICES_PATH      | ~/project/VAMobile/android/app/google-services.json | decode_android_keys |
| Firebase Distribution Key    | FIREBASE_DIST_FILE_BASE64 | FIREBASE_DIST_DECODE_PATH | ~/project/VAMobile/android/keys/firebase-dist.json  | decode_android_keys |

## More Documentation
- [Firebase Documentation Site](https://firebase.google.com/?authuser=0)
- [Firebase Distribution Documentation](https://firebase.google.com/products/app-distribution?authuser=0)
