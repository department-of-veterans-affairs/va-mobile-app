# Apple Signing Keys

## Overview
Apple Signing and Distribution keys are obtained through the Apple Developer Portal [Certificates, Identifiers, and Profiles](https://developer.apple.com/account/resources/certificates/list)

Developers will each need to have a development certificate created for them, or else a team will need a shared key for each machine. 

Apple and iOS Distribution certificates are limited in the organization. Currently, the Health and Benefits App has its own certificate for Apple Distribution. In the future, it may be that teams have a shared signing path with different provisioning profiles, but at this time it is not necessary.

Apple Certificates expire every year and need to be renewed. This process is linked below and requires updating both the Certificates' area in the Developer Portal, and work to update the [Fastlane Match](https://docs.fastlane.tools/actions/match) system used to sign apple builds. 


## Fastlane Match and Apple Signing
Apple Signing in our build system is managed with [Fastlane match](https://docs.fastlane.tools/actions/match/). Match manages and stores the certificates so that a single Distribution certificate can be shared with the team through GitHub authorization to the [private, encrypted repository](https://github.com/department-of-veterans-affairs/va-mobile-app-private).

Match can be called from a local machine to download the certificates and provisioning profiles for distribution or development. It is also used to sign certificates in the CI during Fastlane scripts. 
## Renewing Certificates
In order to renew certificates you will need to delete the old certificates from Apple, as well as delete them from the private key repository. 

In the repository, you will need to delete the following files:
#### Provisioning Profile
- `/profiles/appstore/<filename>.mobileprovision`
- `/certs/distribution/<filename>.cer`
- `/certs/distribution/<filename>.p12`

You will need to delete the expiring profile and certificates from the Developer Console
#### [Certificate](https://developer.apple.com/account/resources/certificates/list)
| NAME                                   | TYPE         | PLATFORM | CREATED BY     | EXPIRATION |
|----------------------------------------|--------------|----------|----------------|------------|
| US Department of Veterans Affairs (VA) | Distribution | All      | Narin Ratana | 06/26/2024 |

#### [Provisioning Profiles](https://developer.apple.com/account/resources/profiles/list)
| NAME                              | PLATFORM | TYPE      | EXPIRATION |
|-----------------------------------|----------|-----------|------------|
| match AppStore gov.va.vamobileapp | iOS      | App Store | 06/26/2024 |

Once the certificates have been deleted from both locations you can [run match in your terminal](https://docs.fastlane.tools/actions/match/#run) to renew the certs
navigate to `~/VAMobile/ios/fastlane` and then run `fastlane match appstore`. You should be able to follow the prompt to create a new Distribution Certificate and Provisioning Profile that will be uploaded to the private repository and can then be used for signing apps.

You should be able to test locally by building with the On-demand Script. If the signing part doesn't fail before build everything should be good to go. You can PR any file changes that may have happened. 

*NOTE: You may need to update the configs and profiles in the VAMobile.plist with xCode if the name strings are changed. If you receive a build error about not finding a cert, double check this first*

## Location in the CI
Apple certificates are encrypted by Fastlane match into a private repository and fetched at build time. 

On your local machine they can be found in the Keychain Access application.

### ENV Constants for the keys
All keys are stored in match

## More Documentation
- [Apple Codesigning Documentation](https://developer.apple.com/support/code-signing/)
- [Fastlane Codesigning Documentation](https://docs.fastlane.tools/codesigning/getting-started/)

