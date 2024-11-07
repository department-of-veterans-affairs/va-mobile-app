---
title: Development Setup Process
---

# Development setup instructions

## Prerequisites

:::tip
If you are building in the app for prototyping, testing, or demo purposes, you can freely build locally for Android without requesting access or keys.

You can also consider [using our codespaces setup](https://github.com/features/codespaces) to get up and running quickly.
:::

### Access

- You have been fully onboarding into the [VA Github organiztion](https://github.com/department-of-veterans-affairs).
- An SSH key setup with github: [Connect With SSH](https://docs.github.com/en/enterprise-server@3.5/authentication/connecting-to-github-with-ssh/about-ssh).
- You or your team has been approved to build and release a production feature into the VA Mobile App by a [VA Product Owner](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app).
- **If your feature is approved**, reach out to [Flagship support](https://dsva.slack.com/archives/C018V2JCWRJ) to get access to App Store Connect so you can build the iOS app locally.

### Software

- [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
- [Android Studio](https://developer.android.com/studio)
- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)
- [Node.js](https://nodejs.org/en/download/)
- [Homebrew](https://formulae.brew.sh/)
- [git](https://git-scm.com/download/mac)
- [NVM](https://formulae.brew.sh/formula/nvm)
- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)
- [Java JDK](https://www.oracle.com/java/technologies/downloads/#jdk17-mac)

## Environment variables setup

If you are using zsh on Mac you will need to create the `.zprofile` and `.zshrc` files if they do not exists.

In your `bash_profile` or `.zprofile` add the following:

```bash
# JAVA_HOME` variable pointing to the java installed above example
export JAVA_HOME=$(/usr/libexec/java_home -v 15.0.2)

# `NODE_OPTIONS` this is to manage the node memory space
export NODE_OPTIONS=--max_old_space_size=8192

# Android specific vars for the ANDROID_HOME, platform-tools and cmdline-tools
export ANDROID_SDK=/Users/(your user folder)/Library/Android/sdk
export ANDROID_HOME=$ANDROID_SDK
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# The build of the app relies on a scripted creation of the .env 
# file to run correctly. You will need to add the `APP_CLIENT_SECRET` 
# var to work correctly:
export APP_CLIENT_SECRET='client secret ask for this client key'

# The app has a demo mode. To use demo mode the app reads the 
# `DEMO_PASSWORD` var. You can set this to a blank password or 
# assign any string to it

export DEMO_PASSWORD=''
```

After adding the variables, restart your terminal window and the variables should be activated. Run `which adb` to make sure the android variables are working. If they are not, please reach out to [Flagship support](https://dsva.slack.com/archives/C018V2JCWRJ).

## Local project setup

1. Verify you have access to the [Firebase console](https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp). If you don't, please reach out to [Flagship support](https://dsva.slack.com/archives/C018V2JCWRJ).
2. With your preferred code editor, navigate to the `va-mobile-app/VAMobile` folder inside your cloned version of the repository.
3. In the `android/app` directory add a file named `google-services.json`. You can download this `google-services.json` file from the [firebase console](https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp), under the "your apps" section. You can also download the corresponding `GoogleService-Info.plist` file you will need to later place in your in `VAMobile/ios`.

### Download the files from Firebase

#### Android

![Firebase console apps section where you can find the google services file for Android](/img/devSetupImage/firebase-google-services_android.png)

#### iOS

![Firebase console apps section where you can find the google services file for iOS](/img/devSetupImage/firebase-google-services_ios.png)

### Add file to proper directory

![Google services file](/img/devSetupImage/google-service-android-file.png)

1. Open a terminal and type `nvm use` and press enter to set the node version for the project (if the version isn't installed, it will prompt you with the install command).
2. In a terminal, type `yarn` or `yarn install` and press enter to install the projects dependencies. This will create the `node_modules` folder.
3. After dependencies are installed, type `cd ios && pod install && cd ..` and press enter to install pods on iOS (This is done once unless you installed new dependencies that need pods created).
4. Run `yarn env:staging` and press enter to setup the staging environment and create the `.env` file. Verify the file has the client key and demo password that is in your `.zshrc` file.
5. Run `yarn bundle:ios` and press enter to create the IOS bundle.
6. Run `yarn bundle:android` and press enter to create the android bundle.
7. Run `yarn start` to start the metro development server.

## Android Setup

### Emulator Setup

1. Open Android Studios and select to a open project.

   ![Open Android Studio](/img/devSetupImage/open-android-studio-image.png)

2. On the popup window, browse to `va-mobile-app/VAMobile/android` and select the android folder from the VAMobile project and press open.

    ![Select Android Folder](/img/devSetupImage/select-android-folder-android-studio.png)

3. After opening the android project, you will need to sync the project with gradle. Go to `File -> Sync Project With Gradle Files`.

    ![Sync With Gradle](/img/devSetupImage/gradle-project-sync-image.png)

4. Go to `Android Studios -> Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle` and verify that the Gradle JDK is pointing to `/Applications/Android Studio.app/Contents/jre/Contents/Home`

    ![Preference Android](/img/devSetupImage/android-preferences-path.png)

    ![Gradle Java Path](/img/devSetupImage/android-gradle-java-path.png)

5. Add a test emulator in Android Studios `Tools -> AVD Manager`. Follow the instructions on [Android Emulator Setup](https://developer.android.com/studio/run/managing-avds) to add a new virtual device.

6. After adding the new virtual device, select it from the top device menu.

   ![Select Device](/img/devSetupImage/select-device-android-studio.png)

7. Build the project

    ![Build Project](/img/devSetupImage/build-project-android.png)

8. Launch Virtual Device from Android studio.

     ![Launch Project](/img/devSetupImage/launch-virtual-app-android.png)

9. Verify the Virtual Device launches and Android Studio installs and opens the VAMobile app on the device.

### Physical Device Setup

1. Open Android Studio and select to a open project.

   ![Open Android Studio](/img/devSetupImage/open-android-studio-image.png)

2. On the popup window, browse to `va-mobile-app/VAMobile/android` and select the android folder from the VAMobile project and press open.

    ![Select Android Folder](/img/devSetupImage/select-android-folder-android-studio.png)

3. After opening the android project, you will need to sync the project with gradle. Go to `File -> Sync Project With Gradle Files`.

    ![Sync With Gradle](/img/devSetupImage/gradle-project-sync-image.png)

4. Go to `Android Studio -> Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle` and verify that the Gradle JDK is pointing to `/Applications/Android Studio.app/Contents/jre/Contents/Home`

    ![Preference Android](/img/devSetupImage/android-preferences-path.png)

    ![Gradle Java Path](/img/devSetupImage/android-gradle-java-path.png)

5. Turn on developer mode for the phone. [See React Native Instructions](https://reactnative.dev/docs/running-on-device)

6. Connect phone with a usb to the host machine.

7. Open a Terminal and type `adb devices`. You should see an ouput like so.

    ![ADB Devices](/img/devSetupImage/adb-devices-android.png)

8. Type `adb -s <device name> reverse tcp:8081 tcp:8081`.

    ![ADB TCP Reverse](/img/devSetupImage/reverse-tcp-android.png)

9. Select the physical device from the top device menu.

   ![Select Device](/img/devSetupImage/select-device-android-studio.png)

10. Build the project

    ![Build Project](/img/devSetupImage/build-project-android.png)

11. Launch Virtual Device from Android Studio.

     ![Launch Project](/img/devSetupImage/launch-virtual-app-android.png)

12. Verify Android Studio installs and opens the VAMobile app on the device.

## iOS Setup

### Simulator Setup

1. Open Xcode and select to open project or file.

    ![Open Xcode Project](/img/devSetupImage/open-xcode-project.png)

2. On the popup window browse and select the `ios` folder on the `VAMobile` project.

    ![Select Project Xcode](/img/devSetupImage/select-ios-folder-xcode.png)

3. Go to Xcode -> Preference and under account verify you are signed in with the apple id which has the `US Department of Veterans Affairs (VA) developer account`.

    ![Apple Id Account](/img/devSetupImage/xcode-preference-path.png)

    ![Apple Id Account](/img/devSetupImage/xcode-apple-id-account.png)

4. Select the project icon on the left hand explorer and verify you have the right signing. `Team should be US Department of Veterans Affairs (VA)`

    ![Signing Project Account](/img/devSetupImage/signing-xcode.png)

5. Select a simulator from the list in Xcode.

    ![Select Simulator Xcode](/img/devSetupImage/select-emulator-xcode.png)

6. If you are using XCode 15, a temporary workaround is required to avoid a build failure with RCT-Folly.

   a. Select Pods > Build Settings > Apple Clang - Preprocessing section > Preprocessor Macros section
   b. Add to the "Debug" and "Release" sections: _LIBCPP_ENABLE_CXX17_REMOVED_UNARY_BINARY_FUNCTION

    ![XCode 15 workaround](/img/devSetupImage/xcode-15-temporary-workaround.png)

7. Build project on Xcode.

     ![Build Project Xcode](/img/devSetupImage/build-project-xcode.png)

8. Launch simulator by pressing the play button.

     ![Launch Simulator Xcode](/img/devSetupImage/launch-app-xcode.png)

### Physical Device

1. Open Xcode and select to open project or file.

    ![Open Xcode Project](/img/devSetupImage/open-xcode-project.png)

2. On the popup window browse and select the `ios` folder on the `VAMobile` project.

    ![Select Project Xcode](/img/devSetupImage/select-ios-folder-xcode.png)

3. Go to Xcode -> Preference and under account verify you are signed in with the apple id which has the `US Department of Veterans Affairs (VA) developer account`.

    ![Apple Id Account](/img/devSetupImage/xcode-preference-path.png)

    ![Apple Id Account](/img/devSetupImage/xcode-apple-id-account.png)

4. Select the project icon on the left hand explorer and verify you have the right signing. `Team should be US Department of Veterans Affairs (VA)`.

    ![Signing Project Account](/img/devSetupImage/signing-xcode.png)

5. Connect the iPhone via USB to the host machine. [See React Native Instructions](https://reactnative.dev/docs/running-on-device)

6. Accept permissions on your iPhone from Xcode to allow the developers option.

7. Select a device from the list in Xcode.

    ![Select Simulator Xcode](/img/devSetupImage/select-emulator-xcode.png)

8. Build project on Xcode.

     ![Build Project Xcode](/img/devSetupImage/build-project-xcode.png)

9. Launch device by pressing the play button.

     ![Launch Simulator Xcode](/img/devSetupImage/launch-app-xcode.png)
