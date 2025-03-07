---
title: Creating a Firebase Project
postion: 3
---

## Introduction

This document will go through the steps of creating a firebase project.

:::info
You will need access to the `va-mobile-app` in Firebase before you can complete this task. Please reach out to your manager if you do not have access.
:::

Firebase is used for analytics as well as remote config options. With these options we are able to set feature flags for options within the app. We can also set this to only push to certain versions as well as a certain percentage of the userbase at one time.

## Create Project

**1.** After you are granted access to the Firebase project, click on the project at the top of your screen and then click `Create a project`.

![Create Firebase Project](/img/engineering/devops/firebase/fbCreateProject.png)

**2.** Name your project and click `Continue`.

![Name Firebase Project](/img/engineering/devops/firebase/fbNameProject.png)

**3.** On the AI assistance screen, click `Continue`.

![Gemini Enable](/img/engineering/devops/firebase/fbGeminiEnable.png)

**4.** Since this is not Production, we want to disable analytics to start with. We can enable this later if needed. click the Check mark next to `Enable Google Analytics for this project` and click `Create Project`.

![Disable Analytics](/img/engineering/devops/firebase/fbDisableAnalytics.png)

**5.** You will see a message that the project is creating. That will take a few minutes.

![Creating Project](/img/engineering/devops/firebase/fbCreatingProject.png)

**6.** Once the project is created, you can click `Continue`. You are ready to start using your project.

![Project Creation Complete](/img/engineering/devops/firebase/fbProjectCreationComplete.png)

## Adding Firebase to your apps

**1.** You will need to add firebase to your applications. (iOS and Android). To do this, Look for the `Get started by adding Firebase to your app` box.

### Android

**1.1.** Click on the android logo in the `Get stareted` box to add Firebase to your Android app.

![Add Firebase to Android](/img/engineering/devops/firebase/fbAddToAndroid.png)

**1.2.** To register your app, you will need the following information:

- Package name
- Nickname for app

**1.3.** Enter the Android package name

:::info
The package name for Android is `gov.va.mobileapp`
:::

**1.4.** Add a nickname. click `Register app`

![Register App](/img/engineering/devops/firebase/fbRegisterAppStart.png)

:::info
Since this is a not a production app, we don't need to setup the debug cert.
:::

**1.5.** Next you will need to download the `google-services.json`. This will need to be added to the default location of the [va-mobile-app](https://github.com/department-of-veterans-affairs/va-mobile-app) repo.

:::info
You will need the [va-mobile-app](https://github.com/department-of-veterans-affairs/va-mobile-app) cloned locally and a code editor installed.
:::

![Google Services.json](/img/engineering/devops/firebase/fbDownloadGServicesFile.png)

Click `Next` after you have downloaded the file.

**1.6.** The Firebase SDK has already been added to the project. You may click `Next` on this step.

**1.7.** You have successfully completed all of the steps to add Firebase. Click `Continue to console` to continue setup.

![Firebase App Add complete](/img/engineering/devops/firebase/fbAddFirebaseComplete.png)

### iOS

**1.1.** In the console, click on the `+ Add app` button in the top middle of the screen.

![Console Add App](/img/engineering/devops/firebase/fbConsoleAddApp.png)

**1.2.** Click the `iOS` icon.

[Select iOS App](/img/engineering/devops/firebase/fbConsoleAppAddIos.png)

**1.3.** To register your app, you will need the following information:

- Bundle ID
- Nickname for app

**1.4.** Enter the iOS Bundle ID

:::info
The package name for iOS is `gov.va.vamobileapp`
:::

**1.5.** Add a nickname. click `Register app`

![iOS App Register](/img/engineering/devops/firebase/fbiosRegisterApp.png)

**1.6.** You will need to download the `GoogleService-info.plist`. This will need to be added to the default location of the [va-mobile-app](https://github.com/department-of-veterans-affairs/va-mobile-app) repo. Click `Next` after you dwnload and place the file.

![iOS plist file](/img/engineering/devops/firebase/fbIosPlistFile.png)

:::info
You will need the [va-mobile-app](https://github.com/department-of-veterans-affairs/va-mobile-app) cloned locally and a code editor installed.
:::

**1.7.** The Firebase SDK has already been added to the project. You may click `Next` on this step.

**1.8.** The Inilialization code has already been added to the project. Click `Next` to continue.

**1.9.** You have successfully completed all of the steps to add Firebase. Click `Continue to console`

![iOS Firebase Registration Complete](/img/engineering/devops/firebase/fbIosAppRegComplete.png)
