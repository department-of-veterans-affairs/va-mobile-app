# Google Signing Keys 

## Overview
Google .aab files are signed with an upload key and signed by Google's app signing process after upload and before distribution. 

A new upload keystore and upload key are generated in Android Studio. Those keys are then stored as base64 strings within the CI and decoded during the build process.

An additional step of creating a Google Play service worker in order to upload with Fastlane tooling. This can only be done by the account holder. [You can find that information for the VA account here](https://play.google.com/console/u/0/developers/7507611851470273082/contact-details)

This process rarely needs to happen. A service account can live the life of the app if the credentials are not shared. The same is true for the upload certificates. 

## Location in the CI
The Android certificates are stored in GitHub Actions as base64 strings that are decoded by the CI when they are needed. 

### ENV Constants for the keys 
| Key Name               | ENV String     | Destination ENV String | Decoded Location                                     | CI Command          |
|------------------------|----------------|------------------------|------------------------------------------------------|---------------------|
| Android Keystore       | GOOGLE_KS      | GOOGLE_KS_PATH         | ~/project/VAMobile/android/keys/vamobile             | decode_android_keys |
| Google Service Account | GOOGLE_SA_JSON | GOOGLE_SA_PATH         | ~/project/VAMobile/android/keys/service-account.json | decode_android_keys |

## More Documentation
- [Android Developers](https://developer.android.com/studio/publish/app-signing)
- [Fastlane Google Setup](https://docs.fastlane.tools/actions/supply/#setup)
- [Google Play Developer API](https://developers.google.com/android-publisher/getting_started)
- [Sample Walk-through](https://help.moreapp.com/en/support/solutions/articles/13000076096-how-to-create-a-service-account-for-the-google-play-store-moreapp)
