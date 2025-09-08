---
title: Accessing Demo Mode
---

## Purpose

* The VA Health and Benefit App’s Demo Mode mode provides a safe and non-productionalized environment for users to interact and engage with the app’s navigation, functionality, features, and designs.
* Demo mode is set up with a single user that is not tied to any production test account and allow users to access all of the app’s latest offerings. Users can complete actions such as submitting a secure message or a prescription refill to experience the entire user journey without impacting other systems or teams.
* Demo users should use the latest version of the app in order to experience the latest version of demo mode. Work in progress items that the VA Health and Benefits App Team is working on will not appear in demo mode until it is released into production.
* Google Play store uses demo access to perform their testing; if unable to access they will decline the release

## Steps to Access Demo Mode

 1. Download or update existing app to the latest version (any device)
 2. [Apple App Store Link](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596)
 3. [Google Play Store Link](https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US)
 4. Open the app
 5. Tap the VA Logo 7 times
 6. Enter the Password (`Zhuzh-it`) and click demo button
 7. Screen is updated with a Demo Mode bar on the home screen
 8. Click the Sign In button
 9. Demo user is now at the home page of the mobile app and can explore

## Steps to Access Demo Mode with a Screenreader

 1. Download or update the VA: Health and Benefits app to the latest version (version 2.37.0 or later) and open the app.
     * [Apple App Store Link](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596)
     * [Google Play Store Link](https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US)
 2. Swipe past the Veterans Crisis Line link to the VA logo (it will come immediately after the Crisis Line link and before the "sign in" button).
     * With VoiceOver (iOS), it will announce as "Department of Veterans Affairs logo, image, VA U.S. Department of Veterans Affairs".
     * With Talkback (Android), it will announce as "Department of Veterans Affairs logo, image".
 3. Double-tap the VA logo image 7 times (14 times total).
 4. A modal window will appear to enter a password and focus will be on the input field.
     * With VoiceOver (iOS), it will announce "Text field is editing, word mode, insertion point at start".
     * With Talkback (Android), it will announce "Enter password, edit box".
 5. Enter the password (`Zhuzh-it`) into the text field.
 6. After entering the password, swipe to the "demo" button and double tap.
 7. After tapping the demo button, the login screen will update. The focus should shift back to the Veterans Crisis Line link, but depending on your phone's version, it might take you lower on the screen. If you have successfully activated demo mode, there will be an alert box that says "Demo mode, heading" directly below / after the Veterans Crisis Line link. Swipe past that and down to the "sign in" button.
 8. Double-tap the "sign in" button to login with demo mode.

## Changing Demo Mode user
The following are steps to change the demo mode user
1. Login to the application in Demo Mode
2. Navigate to the Developer Screen from Settings
3. Scroll down to the Select Demo User UI
4. Select the demo user and the app will automatically log out
5. Login to demo mode again and the selected user's data will be loaded in

## Creating a Demo Mode user
The following are steps to create a new demo mode user
1. Add a new directory in `src/store/api/demo/mocks` using the name of the new user in camelcase e.g. kimberlyWashington
2. Each user will require at least two files: index.ts and profile.json
    * index.ts will be used to create the import function for the user
    * profile.json contains the response json with the user's name.
3. Add the import function to the index file.
    * The import function name should follow the format: import*FirstLast*Data e.g. importKimberlyWashingtonData
    * The function returns an array of imported json files. Each json file contains response data for endpoints used throughout the application
4. Add data json files to the new users directory
    * Examples of these files can be found in `src/store/api/demo/mocks/default` which can also be used when you don't need to change the data.
    * Be sure to import any data files from the `default` directory that are not in the user directory to avoid empty api responses
    * Files needed for all requests:
      * allergies.json
      * appointments.json
      * appointmentsTestTime.json
      * claims.json
      * contactInformation.json
      * debts.json
      * decisionLetters.json
      * demographics.json
      * disabilityRating.json
      * getAuthorizedServices.json
      * getFacilitiesInfo.json
      * getFacilitiesInfoCerner.json
      * labsAndTests.json
      * letters.json
      * medicalCopays.json
      * notifications.json
      * payments.json
      * personalInformation.json
      * prescriptions.json
      * profile.json
      * secureMessaging.json
      * vaccine.json
5. In `src/store/api/demo/mocks/user.ts` add a user id to `DemoUserIds` and add a new entry to `DemoUsers` with the user's name and a short description of the user's data
    * The user id should be the same as the user directory name
6. In `src/store/api/demo/store.ts` add a new case to the switch statement to import the new user's data

## Troubleshooting

### Demo Mode’s password is not working

* Case sensitive and space sensitive - review password entered
* Mobile app may need to be updated - update the app
* Demo password has changed, contact the mobile team in slack ([#va-mobile-app](https://dsva.slack.com/archives/C018V2JCWRJ))

### A new feature does not appear in Demo Mode

* If the new feature has not yet been released to production, it will not appear in demo mode
* If the new feature is released to veterans in production, try the following:
  * Download the latest version of VA Health and Benefits App
    * Open the app and log into Demo
    * Hard close the app (app switcher then swipe to close it)
    * Open it again
      * If it's still not there, data may be cached
      * Log into demo mode
      * Go to Settings -> Developer Screen -> Click the Remote Config button
      * Scroll down to the Override Toggle section
      * Tap the relevant feature toggle to on
      * Click Apply Overrides
      * Log back into Demo Mode
