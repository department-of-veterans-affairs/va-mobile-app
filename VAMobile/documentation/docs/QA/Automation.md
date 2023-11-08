# UI Automation Testing

## Background
_For folks looking for a basic primer on "what is UI automation testing", reading one of the [many articles available via quick google search](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing) is the recommended method. This section instead covers the background of automated UI testing for the mobile team._

Implementing robust UI automation for the mobile team supports several team goals - more efficiently using QA Engineer time, finding bugs sooner/reducing regressions, and improving FE efficiency (reducing the number of flaky unit tests that are written to accomplish what UI automation is better positioned to test). 

Phases include:
- **Tool assessment & initial implementation**: Completed Q3 2022
- **Release candidate script automation**: Slated for Q4 2023
- **Key end-to-end test automation**: _Future_

## Detox: our UI automation tool
Our automated UI testing is done with [Detox](https://wix.github.io/Detox/), which we picked over other tools because it slotted in nicely with existing tools/tech for the team (react native, javascript, jest) while also having more robust functionality with lighter lift than some other tools (write a single script that executes cross-platform; active development, support & documentation updates from the detox team; etc).

### Prerequisites
Follow instructions for FE [Development Setup Instructions](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/FrontEnd/DevSetupProcess)

### Local setup for detox
1. Check for the [detox pre-reqs](https://wix.github.io/Detox/docs/introduction/getting-started#detox-prerequisites) on your local machine and install if needed using the `yarn` package manager.
2. Check that the emulators used by the script ([listed in .detoxrc.json](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/.detoxrc.json#L17)) are installed on your machine, and install them if not. [Helpful instructions from detox](https://wix.github.io/Detox/docs/introduction/project-setup#step-3-device-configs)
    - If you need to create a new Android emulator, make sure to bump up the internal storage (default is 800, bumping to 8000 definitely works). If you don't do this, you'll get an out of storage error. One path that works for this: Shift-Shift > search "Virtual Device Manager" > {create new device or edit existing device} > Show Advanced Settings > scroll down to the "Memory and Storage" section to find the "Internal Storage" field
3. Build and Run App
   1. Run `yarn install` to install the project dependencies
   2. Start Metro with `yarn start` and leave it running in its own separate terminal
   3. Run `yarn e2e:ios-build` to build the iOS app
   4. Run `yarn e2e:android-build` to build the Android app
4. Run Tests
   1. Run `yarn e2e:ios-test` to run the iOS tests
      - If you want to see the iOS tests on the simulator, you need to have the Simulator app open or run `yarn ios` before starting the iOS tests (but, if you don't care about watching on the simulator, it'll still run fine without it.)
   2. Run `yarn e2e:android-test` to run the Android tests
      - Android will open the emulator & show you the tests running, automatically.
      - If android tests hangs and you receive this error: _`Exceeded timeout of 300000ms while handling jest-circus "setup" event`_, you will need to downgrade API of AVD System Image to 28
         - Open _Android Studio_
         - Go to `Tools -> Device Manager -> (next to emulator used for tests) Edit this AVD -> (next to system image) Change`
         - Change API Level to 28 (Release name: _Pie_)
      - Individual test runtime is ~30 seconds (we start all tests back from the login window). Total test runtime will change as we add more tests, but expect it to take a few minutes as well.

## UI Automation Testing Process

### Release Candidate Automation
The RC regression script is split into two sections: testing covered manually, and [testing covered with automation.](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=9683).

Each release, someone from the QA team is responsible for 'babysitting' the automated tests for the release candidate build. This person is responsible for confirming all automated cases have run against the correct build, and then signing off on automated testing by leaving a comment in the release sign-off ticket. There are three potential outcomes for this signoff, here's an example of what the comment would look like for each:
1. All automated cases pass, signing off on that section
2. Some automated cases failed: (list of which cases & why). These failures do not indicate a breaking change with the app, and I have written up automation maintenance ticket(s) for the necessary changes: (links to relevant tickets)
3. Some automated cases failed: (list of which cases & why). These failures are breaking changes in the app, and I have written up bug ticket(s): (links to relevant tickets). These bugs SHOULD / SHOULD NOT prevent release of the app.

We create additional tickets, even for test script maintenance issues, to avoid pushing changes onto the RC branch during the release process.

### Writing new cases
Creating new cases for UI automation is ticketed work, as atomic as possible, & well-documented (as per [our engineering philosophy](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/Philosphy)).

In addition to making sure that the automated tests are functioning well, an engineer writing new tests is also responsible for:

**All new automated tests**
- Creating TestRail cases & steps for automated tests (if needed/not currently written)
- Confirming all test runs for the new automated script can be recorded in TestRail (preferably automatically, but at least manually)
- Ensuring the new cases provide artifacts (where necessary) for success or failure

**Additional work for RC automated tests**
- Confirming that the new script follows the manual RC script test steps
- Moving all manual cases replaced by automation to the "Automated" section of the RC script (could involve moving the full case, or splitting an existing case into manual and automated portions)

> [!NOTE]
> - All detox scripts are located in the e2e folder.
> - For most tests, you should have the same initial format where you import the necessary variables, have a dictionary of any constants, and run a _beforeAll_ statement that navigates to the specific place in the app before running your tests.
> - Utils.ts is where the global functions/constants live.  It is also is where all the navigation to a specific page functions live.
> - Detox help can be found here: https://wix.github.io/Detox/docs/19.x/api/matchers
> - Because our test case suite is so large, it may be best to exclusively run just the test you are working on by doing `yarn e2e:<android/ios>-test /e2e/tests/<yourName.e2e.ts>`.
> - If you change anything in the app code, you will need to run `yarn e2e:<android/ios>-build` beforehand
> - Your demo mode password locally must be set to '' (null) in order to successfully run detox cases.
