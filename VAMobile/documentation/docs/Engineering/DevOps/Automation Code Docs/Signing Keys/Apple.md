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

In order to renew certificates you will need to revoke the old certificates with Apple, as well as delete them from the remote private key repository. This needs to be done on in the remote repository, not just locally, as Match will clone the remote repository to a temporary directory and then try (and fail) to decrypt them.

In the remote repository, you will need to delete the following files:

### Provisioning Profile

- `/profiles/appstore/<filename>.mobileprovision`
- `/certs/distribution/<filename>.cer`
- `/certs/distribution/<filename>.p12`

You will need to delete the expiring profile and revoke the certificates from the Developer Console.

### [Certificate](https://developer.apple.com/account/resources/certificates/list)

| NAME                                   | TYPE         | PLATFORM |
|----------------------------------------|--------------|----------|
| US Department of Veterans Affairs (VA) | Distribution | All      |
| gov.va.vamobileapp | Apple Push Services | iOS      |

Apple Push Service certificates need to be refreshed yearly in August and sent to the VANotify team. Review [Apple Documentation on how to create a push certificate](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_certificate-based_connection_to_apns#2947597) and [how to create a signing request](https://developer.apple.com/help/account/create-certificates/create-a-certificate-signing-request). The VA Notify team needs the certificate in `.p12` and the private key unencrypted (`.cer` file). Review [documentation on converting the .cer file into .p12](https://stackoverflow.com/questions/39091048/how-to-convert-a-cer-to-a-p12-file). Coordination for this happens into the [#va-mobile-app-push-notifications Slack channel](https://dsva.slack.com/archives/C01CSM3EZGT).

**Full testing should be completed with QA before retiring the old certificate.**

### [Provisioning Profiles](https://developer.apple.com/account/resources/profiles/list)

| NAME                              | PLATFORM | TYPE      |
|-----------------------------------|----------|-----------|
| match AppStore gov.va.vamobileapp | iOS      | App Store |

Once the certificates have been deleted from both locations you can [run match in your terminal](https://docs.fastlane.tools/actions/match/#run) to renew the certs
navigate to `~/VAMobile/ios/fastlane` and then run `fastlane match appstore`. You should be able to follow the prompt to create a new Distribution Certificate and Provisioning Profile that will be uploaded to the private repository and can then be used for signing apps. If you run into issues, review the following:
 - Try using `brew install fastlane` if your build is erroring out
 - Does the Apple ID in the Matchfile belong to you?
 - The Apple ID is case sensitive. If your Apple ID password is getting rejected, this might be the issue. - 

After generating the new certs, make sure the `MATCH_PASSWORD` secret in the `va-mobile-app` repository is updated so GH Actions can use it.

You should be able to test locally by building with the On-demand Script. If the signing part doesn't fail before build everything should be good to go. You can PR any file changes that may have happened.

:::info
You may need to update the configs and profiles in the VAMobile.plist with xCode if the name strings are changed. If you receive a build error about not finding a cert, double check this first
:::

## Location in the CI

Apple certificates are encrypted by Fastlane match into a private repository and fetched at build time.

On your local machine they can be found in the Keychain Access application.

### ENV Constants for the keys

All keys are stored in match

## More Documentation

- [Apple Codesigning Documentation](https://developer.apple.com/support/code-signing/)
- [Fastlane Codesigning Documentation](https://docs.fastlane.tools/codesigning/getting-started/)
