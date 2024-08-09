# Tool Setup

## TestFlight (iOS testing app distribution)
1. Ask your engineering lead to grant permission for you to use the TestFlight app (they will need your company work email address, to add it to the list of allowed users).
2. Download the [TestFlight](https://apps.apple.com/us/app/testflight/id899247664) app on your testing device.
3. Wait until you receive an email invitation to test the VA app via TestFlight (from the Engineering lead, via the work in step 1), then open the email and tap “View in TestFlight” or “Start testing”, then tap “Install” or “Update” for the app you want to test.

By default, TestFlight only shows the most recent testing build that was built. If you are looking for a specific build, make sure that the comments describing what's in the build or the build ID number match what you are looking for. You can find earlier builds by scrolling down and tapping "View Previous Builds", then picking a version (they are listed chronologically, with the most recent previous builds in the first version listed).

_As a general resource, here's [Apple's documentation on testing with TestFlight](https://testflight.apple.com/)._

## AppTester (Android testing app distribution)
1. Ask your engineering lead to grant permission for you to use the AppTester app (they will need your company work email address, to add it to the list of allowed users).
2. Wait until you receive an email invitation to test the VA app via AppTester, then open the email and and tap either “Download the latest build” or “Install Firebase App Tester”
3. Tap "Download App Tester" on the banner across the bottom of the next page
4. Tap "OK" on the warning popup (this type of file can harm your device)
5. After the .apk has fully downloaded, tap "open"
6. If you get a warning that you can't install unknown apps from the internet, tap "Settings" to go update those settings. This should open the “Install unknown apps” settings page, or the “App info” settings page for Chrome. If it doesn’t, you can navigate to it via “Settings > Apps > Chrome”. Then, find the “Install Unknown Apps” and section, tap it, and toggle “Allow from this Source” to the “ON” position.
7. At this point, you should be prompted to install "App Tester" - tap "Install". If you're not prompted automatically, you can use the back button to go back to re-download and install from the screen in step 3.
8. After the app has installed tap "Open". You should see the VA Health and Benefits mobile app in the list of test apps - tap on it.
9. On the next screen, there should be a banner that says you need to enable additional permissions. Tap "Get Started" on that banner. 
10. In the instructions sheet that appears (and you're welcome to read those instructions, or just follow along here) tap "Open Google Play store"
11. Once the play store opens, tap your profile icon in the top righthand corner of the screen (will have your picture, or a generic profile-esque icon)
12. Select "Settings"
13. Tap the "About" section to expand it, locate the "Play Store Version" row and tap it 7 times.
14. A snackbar will appear that says "You are now a developer". Scroll up and tap on the "General" area in Play Store settings.
15. Toggle "Internal App Sharing" to ON
16. Tap "turn on" in the popup window that appears
17. Navigate back to App Tester. The instruction sheet should still be present - scroll down to the bottom and tap "done"
18. Tap "Download" on the build you want to install. Depending on your device, you will either be taken to an "about this app" page while the app downloads and installs, or you will be taken to the Google Play Store where you will need to tap "install" to actualy start installing the app.

If you are looking for a specific testing build, make sure that the comments describing what's in the build or the build ID number match what you are looking for. You can find earlier builds by scrolling down (they are listed in reverse chronological order).


_As a general resource, here's [Google's documentation on troubleshooting/FAQs for testing with Firebase AppTester](https://firebase.google.com/docs/app-distribution/troubleshooting?platform=android)._

## Charles Proxy (SSL proxying tool)

1. Get approval for a Charles Proxy license from mobile Engineering lead, then work with internal IT team to get Charles Proxy on your work computer.
2. [Configure Charles and your iOS devices](https://charlesdocsy.com/2020/05/05/view-ios-traffic-with-charles-proxy/) for plain text viewing of traffic.
3. [Configure Charles and your Android devices](https://charlesdocsy.com/2020/05/07/android-devices-and-charles/) for plain text viewing of traffic.
4. If you've never used a tool like this to intercept and mock data, you can use the articles on [map local](https://charlesdocsy.com/2020/05/14/map-local/) and [breakpoints](https://charlesdocsy.com/2020/05/11/breakpoints-modify-request-headers/) as a starting point.

The Charles certificate installed on your devices will expire after a bit less than a year. When that happens, you'll need to [reset your certificate and reinstall it on your devices](https://charlesdocsy.com/2021/12/29/expired-charles-proxy-root-certificate/).

_The Charles Docsy site is great, but not necessarily easily searched, so here are quick links to the [iOS troubleshooting](https://charlesdocsy.com/2020/05/14/common-problems-ios/) and [Android troubleshooting](https://charlesdocsy.com/2020/07/08/common-problems-android/) pages._
