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

To get access to either TestFlight or App Tester, follow the platform-specific instructions for your testing device on the [Tool Setup page](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/Tool%20Setup).

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

## Mobile team tools (as they relate to QA)
### 1Password
The VAMobile and VA.gov vaults contain usernames and passwords for staging test users.

### Github
Most commonly used: [writing a bug ticket with the new bug report template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?assignees=&labels=bug&template=bug-report.md&title=BUG+-+%5BSEVERITY%5D+-+%5BiOS%2FAndroid%2FAll%5D+-+%5BShort+description%5D). 

## How do I
### Log into the mobile app in a staging environment?
- First, you need to get [TestFlight (iOS) or AppTester (Android)](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Tool%20Setup) set up on the device you'll use, which includes coordination with the mobile Engineering lead to get added to the list of approved testers.
- If you're testing backend changes, it's best to use a current version of the daily develop builds. If you're testing frontend changes, you'll need to follow the [on-demand build process](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Resources#on-demand-build), above.
- Any credentials that work to log into staging.va.gov will also work to log into the mobile app in the staging environment. The mobile team, by and large, does not have the ability to create staging users or specific staging data, so you will need to work with other VA teams to do any prep needed for testing.
