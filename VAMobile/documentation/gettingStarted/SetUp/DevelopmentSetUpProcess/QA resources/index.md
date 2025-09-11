# Resources

## QA-specific
### TestRail
TestRail is the web-based test management system used across the VA platform teams to document testing, including the [VA Health & Benefits mobile app](https://dsvavsp.testrail.io/index.php?/runs/overview/29). [Requesting access to TestRail](https://depo-platform-documentation.scrollhelp.site/getting-started/request-access-to-tools#Requestaccesstotools-Additionalaccessfordevelopers) is done via DSVA Slack.

If you're unfamiliar with TestRail overall, [their own guide](https://support.testrail.com/hc/en-us/articles/7076810203028-Introduction-to-TestRail) and [the basic how-to's laid out by the Platform team](https://depo-platform-documentation.scrollhelp.site/developer-docs/testrail-guide) are good starting resources to browse.

Within the VA Mobile project, our top-level test case folders to be familiar with are (_links are to parent folders, explore the subfolders to see all cases_):
- the [release candidate regression test cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=2160), which contains cases run during release testing
- the [active cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3347), which collectively describe the full testable behavior of the mobile app
- the [standard test cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=8944), which are generic test cases for functionality that spans features (such as error handling, accessibility, or feature flags) and can be pulled into test runs for new features without re-writing cases
- the [upcoming feature cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=5648), which contains cases written ahead of time for not-yet-implemented features, and
- the [archive](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3467), which contains cases for deprecated functionality in the app

### TestFlight & AppTester
We distribute testing builds through TestFlight for iOS, and Firebase's AppTester for Android. Key builds for manual testing include: release candidate builds for release testing, builds based on the develop branch that are updated daily (for visual QA or backend testing), and on-demand builds of branches not yet merged to develop for ticket testing.

To get access to either TestFlight or App Tester, follow the platform-specific instructions for your testing device on the [Tool Setup page](https://department-of-veterans-affairs.github.io/va-mobile-app/gettingStarted/SetUp/DevelopmentSetUpProcess/QA%20resources/tool%20setup/).

### Charles Proxy
We use Charles Proxy as a key tool for things like error state testing, mocking data we don't have access to, and downtime window testing.

### On demand build
We create [on-demand builds](https://github.com/department-of-veterans-affairs/va-mobile-app/actions/workflows/on_demand_build.yml) of the pre-production mobile app using a github workflow for testing new frontend code. You need to have write-access to the mobile app repo to kick off these builds.
- Visiting the page linked above, tap on "Run Workflow" near the top righthand corner. Then fill out the workflow prompts:
    - By default, the develop branch is selected in the "Use workflow from" field. Replace it with the branch you want to test.
    - By default, the staging environment is selected in the "Environment" field. Very occasionally (such as user testing), you'd change it to production instead.
    - Add a label to the "Notes" field that will help you identify your build in a list of all on-demand builds. Typically we'll include ticket ID, such as "9687 fix payment name"
    - Tap "run workflow"
- Typically it takes ~10-15 minutes for Android to build, and about 5 minutes longer than that for iOS to build.
- If any build fails, attempt to re-run the failed builds at least once (iOS in particular can be a little flaky).


### Github
Most commonly used: [writing a bug ticket with the new bug report template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?assignees=&labels=bug&template=bug-report.md&title=BUG+-+%5BSEVERITY%5D+-+%5BiOS%2FAndroid%2FAll%5D+-+%5BShort+description%5D).

## How do I
### Log into the mobile app in a staging environment?
- First, you need to get [TestFlight (iOS) or AppTester (Android)](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Tool%20Setup) set up on the device you'll use, which includes coordination with the mobile Engineering lead to get added to the list of approved testers.
- If you're testing backend changes, it's best to use a current version of the daily develop builds. If you're testing frontend changes, you'll need to follow the [on-demand build process](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Resources#on-demand-build), above.
- Any credentials that work to log into staging.va.gov will also work to log into the mobile app in the staging environment. The mobile team, by and large, does not have the ability to create staging users or specific staging data, so you will need to work with other VA teams to do any prep needed for testing.

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
