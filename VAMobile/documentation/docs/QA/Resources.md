# Resources

## QA-specific 
### TestRail
TestRail is the web-based test management system used across the VA platform teams to document testing, including the [VA Health & Benefits mobile app](https://dsvavsp.testrail.io/index.php?/runs/overview/29). [Requesting access to TestRail](https://depo-platform-documentation.scrollhelp.site/getting-started/request-access-to-tools#Requestaccesstotools-Additionalaccessfordevelopers) is done via DSVA Slack.

If you're unfamiliar with TestRail overall, [their own guide](https://support.testrail.com/hc/en-us/articles/7076810203028-Introduction-to-TestRail) and [the basic how-to's laid out by the Platform team](https://depo-platform-documentation.scrollhelp.site/developer-docs/testrail-guide), are good starting resources to browse.

Within the VA Mobile project, our top-level test case folders to be familiar with are (_links are to parent folders, explore the subfolders to see all cases_):
- the [release candidate regression test cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=2160), which contains cases run during release testing
- the [active cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3347), which collectively describe the full testable behavior of the mobile app
- the [standard test cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=8944), which are generic test cases for functionality that spans features (such as error handling, accessibility, or feature flags) and can be pulled into test runs for new features without re-writing cases
- the [upcoming feature cases](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=5648), which contains cases written ahead of time for not-yet-implemented features, and
- the [archive](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3467), which contains cases for deprecated functionality in the app

### TestFlight & AppTester
We distribute builds through TestFlight for iOS, and AppTester for Android. If you weren't given access during the onboarding process, you'll need to your engineering lead to grant permissions; then you can download the relevant app on your testing device, sign in, and get started. (Heads up, the [App Tester setup](https://docs.google.com/document/d/1UFuUHgzAZIPQolR_ja3qv6MnAqWgXL8tEQAX7h7FjzE/edit?usp=sharing) is not necessarily intuitive.)

### Charles Proxy
We use Charles Proxy as a key tool for things like error state testing, mocking data we don't have access to, and downtime window testing. We've got guides for [setting up Charles Proxy](https://docs.google.com/document/d/1nUJCIfGTap6RJK_E6xqiKF0OQ4yH-gmi/edit?usp=sharing&ouid=116379542377954476916&rtpof=true&sd=true), and [how to mock response data](https://docs.google.com/document/d/10qeXwn55uGnx9wXj0FmKdLyh-dxwDNWj/edit?usp=sharing&ouid=116379542377954476916&rtpof=true&sd=true) or [set exclusions](https://docs.google.com/document/d/1_obvBLHnTTNZGb5N1Rezq8duZhy-rZ1g/edit).

## Mobile team tools (as they relate to QA)
### 1Password
The VAMobile and VA.gov vaults contain usernames and passwords for staging test users.

### Github
Most commonly used: [writing a bug ticket with the new bug report template](https://github.com/department-of-veterans-affairs/va-mobile-app/issues/new?assignees=&labels=bug&template=bug-report.md&title=BUG+-+%5BSEVERITY%5D+-+%5BiOS%2FAndroid%2FAll%5D+-+%5BShort+description%5D). 

### Zenhub
Most commonly used: [the shared team Zenhub board](https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/board?repos=292052392) and [the cumulative flow report to track ticket (or bug!) trends over several sprints](https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/reports/cumulative?df=05-02-2021&dr=12m&dt=05-02-2022&labels[]=bug&notLabels[]=&p[]=Closed&r=).

