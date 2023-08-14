---
title: Development Setup Process
sidebar_position: 5
---

# Development Setup Instructions

## Prerequisites

#### Download and install the latest versions of the following IDEs and Native Hosts:

- [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

- [Android Studio](https://developer.android.com/studio)

- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)

- [Node.js](https://nodejs.org/en/download/)

- [Java JDK](https://www.oracle.com/java/technologies/downloads/#jdk17-mac)


#### Depending on which IDE you are using install the following:

- [VSCode](https://code.visualstudio.com/download)

- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/#section=mac)



## ENV Variables Setup

:::info
    If you are using z on Mac you will need to create the .zprofile and .zshrc files if they do not exists.
:::

#### On your bash_profile or .zprofile add the following:

- **`JAVA_HOME` variable pointing to the java installed above example:**

 `export JAVA_HOME=$(/usr/libexec/java_home -v 15.0.2)` make sure you use the version you installed.

- **`NODE_OPTIONS` this is to manage the node memory space:**

 `export NODE_OPTIONS=--max_old_space_size=8192`
 
#### On your bashrc or .zshrc add the following:

- **Android specific vars for the `ANDROID_HOME`, `platform-tools` and `cmdline-tools`:**

 `export ANDROID_SDK=/Users/(your user folder)/Library/Android/sdk`
 
 `export ANDROID_HOME=$ANDROID_SDK`

 `export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin` 

 `export PATH=$PATH:$ANDROID_HOME/platform-tools` 

- **The build of the app relies on a scripted creation of the .env file to run correctly. You will need to add the `APP_CLIENT_SECRET` var to work correctly:**

 `export APP_CLIENT_SECRET='client secret ask for this client key'`

- **The app has a demo mode. To use demo mode the app reads the `DEMO_PASSWORD` var. You can set this to a blank password or assign any string to it:**

 `export DEMO_PASSWORD=''`

 
:::info
    After adding the variables if you have a terminal open run source .zprofile and source .zshrc. If you do not have a terminal open than open a brand new terminal and the variables should be activated. Run which adb to make sure the android vars are working.
:::

## Github And Cloning Repo

- Verify you have access to the [VAMobile](https://github.com/department-of-veterans-affairs/va-mobile-app) repo.

- Make sure you have the SSH Github setup on your machine if not follow these instruction [Connect With SSH](https://docs.github.com/en/enterprise-server@3.5/authentication/connecting-to-github-with-ssh/about-ssh).

- Create a folder where you wish to clone the repo to. Example (`/Users/(your user folder/Workspace`).

- Using your prefer method or prefer IDE (example cmd line, Github Desktop, VSCode, or IntelliJ) clone the VAMobile repo to the folder created in the previouse step.

- Verify you see a folder structure like `/Users/(your user folder/Workspace/va-mobile-app/VAMobile`.


## With VSCode or IntelliJ IDEA Project Setup

- Verify you have access to the [Firebase console](https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp). If you don't, please reach out to VA Mobile engineering leadership./

- With your prefer IDE Open the `/Users/(your user folder/Workspace/va-mobile-app/VAMobile` folder.

- In the `android/app` directory add a file named `google-services.json`. You can download this `google-services.json` file from the [firebase console](https://console.firebase.google.com/u/0/project/va-mobile-app/settings/general/android:gov.va.mobileapp), under the "your apps" section. You can also download the corresponding `GoogleService-Info.plist` file you will need to later place in your in `VAMobile/ios`.

### Download the files from Firebase

#### Android

![Firebase console apps section where you can find the google services file for Android](/img/devSetupImage/firebase-google-services_android.png)

#### iOS

![Firebase console apps section where you can find the google services file for iOS](/img/devSetupImage/firebase-google-services_ios.png)

### Add file to proper directory

   ![Google services file](/img/devSetupImage/google-service-android-file.png)

- Open a terminal in the IDE and type `yarn` or `yarn install` and press enter to install the projects dependencies. This will create the `node_modules` folder.

- After dependencies are installed type `cd ios && pod install && cd ..` and press enter to install pods on ios (This is done once unless you installed new dependencies that need pods created).

- After pods are installed type `yarn env:staging` and press enter to setup the staging environment and create the `.env` file. Verify the file has the client key and demo password that is in your .zshrc file.

    ![Env file Location](/img/devSetupImage/env-file-image.png)  

    ![ENV File Content](/img/devSetupImage/env-file-content-image.png) 


- After the env file is created type `yarn bundle:ios` and press enter to create the IOS bundle.

- After the ios bundle is done tye `yarn bundle:android` and press enter to create the android bundle.

- After the android bundle is done type `yarn start` to start the metro development server.

     ![Metro Started](/img/devSetupImage/metro-started-image.png)  


## Android Setup 

### Emulator Setup: 

- Open Android Studios and select to a open project.

   ![Open Android Studio](/img/devSetupImage/open-android-studio-image.png) 

- On the popup window browse to `/Users/(your user folder/Workspace/va-mobile-app/VAMobile/android` and select the android folder from the VAMobile project and press open.

    ![Select Android Folder](/img/devSetupImage/select-android-folder-android-studio.png) 

- After opening the android project you will need to sync the project with gradle. Go to `File -> Sync Project With Gradle Files`.

    ![Sync With Gradle](/img/devSetupImage/gradle-project-sync-image.png) 

- Go to `Android Studios -> Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle` and verify that the Gradle JDK is pointing to `/Applications/Android Studio.app/Contents/jre/Contents/Home`

    ![Preference Android](/img/devSetupImage/android-preferences-path.png) 

    ![Gradle Java Path](/img/devSetupImage/android-gradle-java-path.png) 

- Add a test emulator in Android Studios `Tools -> AVD Manager`. Follow the instructions on [Android Emulator Setup](https://developer.android.com/studio/run/managing-avds) to add a new virtual device.

- After adding the new virtual device select it from the top device menu.

   ![Select Device](/img/devSetupImage/select-device-android-studio.png) 

- Build the project. 

    ![Build Project](/img/devSetupImage/build-project-android.png) 
   
- Launch Virtual Device from Android studio.

     ![Launch Project](/img/devSetupImage/launch-virtual-app-android.png) 

- Verify the Virtual Device launches and Android Studios installs and opens the VAMobile app on the device.

### Physical Device Setup: 

- Open Android Studios and select to a open project.

   ![Open Android Studio](/img/devSetupImage/open-android-studio-image.png) 

- On the popup window browse to `/Users/(your user folder/Workspace/va-mobile-app/VAMobile/android` and select the android folder from the VAMobile project and press open.

    ![Select Android Folder](/img/devSetupImage/select-android-folder-android-studio.png) 

- After opening the android project you will need to sync the project with gradle. Go to `File -> Sync Project With Gradle Files`.

    ![Sync With Gradle](/img/devSetupImage/gradle-project-sync-image.png) 

- Go to `Android Studios -> Preferences -> Build, Execution, Deployment -> Build Tools -> Gradle` and verify that the Gradle JDK is pointing to `/Applications/Android Studio.app/Contents/jre/Contents/Home`

    ![Preference Android](/img/devSetupImage/android-preferences-path.png) 

    ![Gradle Java Path](/img/devSetupImage/android-gradle-java-path.png) 

 - Turn on developer mode for the phone. [See React Native Instructions](https://reactnative.dev/docs/running-on-device)

 - Connect phone with a usb to the host machine.

 - Open a Terminal and type `adb devices`. You should see an ouput like so.

    ![ADB Devices](/img/devSetupImage/adb-devices-android.png) 

 - Type `adb -s <device name> reverse tcp:8081 tcp:8081`.

    ![ADB TCP Reverse](/img/devSetupImage/reverse-tcp-android.png) 

- Select the physical device from the top device menu.

   ![Select Device](/img/devSetupImage/select-device-android-studio.png) 

- Build the project. 

    ![Build Project](/img/devSetupImage/build-project-android.png) 
   
- Launch Virtual Device from Android studio.

     ![Launch Project](/img/devSetupImage/launch-virtual-app-android.png) 

- Verify Android Studios installs and opens the VAMobile app on the device.

## iPhone Setup 

### Simulator Setup

- Open Xcode and select to open project or file.

    ![Open Xcode Project](/img/devSetupImage/open-xcode-project.png) 

- On the popup window browse and select the `ios` folder on the `VAMobile` project.

    ![Select Project Xcode](/img/devSetupImage/select-ios-folder-xcode.png) 

- Go to Xcode -> Preference and under account verify you are signed in with the apple id which has the `US Department of Veterans Affairs (VA) developer account`.

    ![Apple Id Account](/img/devSetupImage/xcode-preference-path.png) 

    ![Apple Id Account](/img/devSetupImage/xcode-apple-id-account.png) 

- Select the project icon on the left hand explorer and verify you have the right signing. `Team should be US Department of Veterans Affairs (VA)`

    ![Signing Project Account](/img/devSetupImage/signing-xcode.png) 
 
- Select a simulator from the list in Xcode.

    ![Select Simulator Xcode](/img/devSetupImage/select-emulator-xcode.png) 

- Build project on Xcode.

     ![Build Project Xcode](/img/devSetupImage/build-project-xcode.png) 

- Launch simulator by pressing the play button.

     ![Launch Simulator Xcode](/img/devSetupImage/launch-app-xcode.png) 


### Physical Device

- Open Xcode and select to open project or file.

    ![Open Xcode Project](/img/devSetupImage/open-xcode-project.png) 

- On the popup window browse and select the `ios` folder on the `VAMobile` project.

    ![Select Project Xcode](/img/devSetupImage/select-ios-folder-xcode.png) 

- Go to Xcode -> Preference and under account verify you are signed in with the apple id which has the `US Department of Veterans Affairs (VA) developer account`.

    ![Apple Id Account](/img/devSetupImage/xcode-preference-path.png) 

    ![Apple Id Account](/img/devSetupImage/xcode-apple-id-account.png) 

- Select the project icon on the left hand explorer and verify you have the right signing. `Team should be US Department of Veterans Affairs (VA)`.

    ![Signing Project Account](/img/devSetupImage/signing-xcode.png) 

- Connect the iPhone via USB to the host machine. [See React Native Instructions](https://reactnative.dev/docs/running-on-device)

- Accept permissions on your iPhone from Xcode to allow the developers option.
 
- Select a device from the list in Xcode.

    ![Select Simulator Xcode](/img/devSetupImage/select-emulator-xcode.png) 

- Build project on Xcode. 

     ![Build Project Xcode](/img/devSetupImage/build-project-xcode.png) 

- Launch device by pressing the play button.

     ![Launch Simulator Xcode](/img/devSetupImage/launch-app-xcode.png) 


