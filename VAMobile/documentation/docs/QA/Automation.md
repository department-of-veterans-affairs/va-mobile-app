# UI Automation Testing

## Background
_For folks looking for a basic primer on "what is UI automation testing", reading one of the [many articles available via quick google search](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing) is the recommended method. This section instead covers the background of automated UI testing for the mobile team._

Implementing robust UI automation for the mobile team supports several team goals - more efficiently using QA Engineer time, finding bugs sooner/reducing regressions, and improving FE efficiency (reducing the number of flaky unit tests that are written to accomplish what UI automation is better positioned to test). 

Phases include:
- **Tool assessment & initial implementation**: Completed Q3 2022
- **Release candidate script automation**: Slated for Q2 2023
- **Key end-to-end test automation**: _Future_

## Detox: our UI automation tool
Our automated UI testing is done with [Detox](https://wix.github.io/Detox/), which we picked over other tools because it slotted in nicely with existing tools/tech for the team (react native, javascript, jest) while also having more robust functionality with lighter lift than some other tools (write a single script that executes cross-platform; active development, support & documentation updates from the detox team; etc).

### Local setup for detox
1. Check for the [detox pre-reqs](https://wix.github.io/Detox/docs/introduction/getting-started#detox-prerequisites) on your local machine and install if needed.
2. Check that the emulators used by the script (listed in .detoxrc.json) are installed on your machine, and install them if not. [Helpful instructions from detox](https://wix.github.io/Detox/docs/introduction/project-setup#step-3-device-configs)
    - If you need to create a new Android emulator, make sure to bump up the internal storage (default is 800, bumping to 8000 definitely works). If you don't do this, you'll get an out of storage error.
4. Build the app. iOS is `yarn e2e:ios-build` and Android is `yarn e2e:android-build`
5. Run tests. iOS is `yarn e2e:ios-test` and Android is `yarn e2e:android-test`. 
     - Android will open the emulator & show you the tests running, automatically. If you want to see the iOS tests on the simulator, you need to have the Simulator app open before starting the iOS tests (but, if you don't care about watching on the simulator, it'll still run fine without it.

## UI Automation Testing Process

### Release Candidate Automation
The RC regression script is split into two sections, one of which is the [folder for automated tests](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=9683).

Each sprint, someone from the QA automation team is responsible for 'babysitting' the automated tests for the release candidate build. This person is responsible for confirming all automated cases have run against the correct build, and then signing off on automated testing by leaving a comment in the release sign-off ticket. There are three potential outcomes for this signoff, here's an example of what the comment would look like for each:
1. All automated cases pass, signing off on that section
2. Some automated cases failed: (list of which cases & why). These failures do not indicate a breaking change with the app, and I have written up automation maintenance ticket(s) for the necessary changes: (links to relevant tickets)
3. Some automated cases failed: (list of which cases & why). These failures are breaking changes in the app, and I have written up bug ticket(s): (links to relevant tickets). These bugs SHOULD / SHOULD NOT prevent release of the app.

We create additional tickets, even for test script maintenance issues, to avoid pushing changes onto the RC branch during the release process.

### Writing new cases
Creating new cases for UI automation is ticketed work, as atomic as possible, & well-documented (as per [our engineering philosophy](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/Philosphy)).

In addition to making sure that the automated tests are functioning well, an engineer writing new tests is also responsible for:

**All new automated tests**
- Are recordable in TestRail (preferably automatically, but at least manually)
- Provide artifacts (where necessary per case) for success or failure

**Additional work for RC automated tests**
- Confirming that the new script follows the manual RC script test steps
- Moving all manual cases replaced by automation to the "Automated" section of the RC script (could involve moving the full case, or splitting an existing case into manual and automated portions)
