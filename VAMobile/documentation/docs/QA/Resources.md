# Resources

## QA-specific 
### TestRail
A [single project in the shared VA account](https://dsvavsp.testrail.io/index.php?/runs/overview/29) contains the VA mobile app test cases and runs. Folks who need access should use the help workflow in the #vfs-platform-support channel in the DVSA Slack instance. Key subset of test cases to be familiar with: the [regression test suite run on each release candidate](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=2160).

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
Most commonly used: [the shared FE/QA Zenhub board](https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/board) and [the cumulative flow report to track ticket (or bug!) trends over several sprints](https://app.zenhub.com/workspaces/va-mobile-frontendqa-60f1a34998bc75000f2a489f/reports/cumulative?df=05-02-2021&dr=12m&dt=05-02-2022&labels[]=bug&notLabels[]=&p[]=Closed&r=).

