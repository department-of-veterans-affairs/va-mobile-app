# Flex: UI Automation Testing using Detox

## Prerequisites
Follow instructions for FE [Development Setup Instructions](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Engineering/FrontEnd/DevSetupProcess) 
> [!NOTE]
> For Android and iPhone Setup, _Physical Device_ setup is not required. Only complete Emulator and Simulator setup

## Detox Local Setup
1. Complete the [Detox Prerequisites](https://wix.github.io/Detox/docs/introduction/getting-started#detox-prerequisites) using the `yarn` package manager
2. Check that the emulators used by the script ([listed in .detoxrc.json](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/.detoxrc.json#L17)) are installed on your machine, and install them if not. [Helpful instructions from detox](https://wix.github.io/Detox/docs/introduction/project-setup#step-3-device-configs)
    - If you need to create a new Android emulator, make sure to bump up the internal storage (default is 800, bumping to 8000 definitely works). If you don't do this, you'll get an out of storage error. One path that works for this: Shift-Shift > search "Virtual Device Manager" > {create new device or edit existing device} > Show Advanced Settings > scroll down to the "Memory and Storage" section to find the "Internal Storage" field


## Build and Run App
1. Run `yarn install` to install the project dependencies
2. Start Metro with `yarn start` and leave it running in its own separate terminal
3. Run `yarn e2e:ios-build` to build the iOS app
4. Run `yarn e2e:android-build` to build the Android app

## Running Tests
1. Run `yarn e2e:ios-test` to run the iOS tests
   - If you want to see the iOS tests on the simulator, you need to have the Simulator app open or run `yarn ios` before starting the iOS tests (but, if you don't care about watching on the simulator, it'll still run fine without it.)
2. Run `yarn e2e:android-test` to run the Android tests
   - Android will open the emulator & show you the tests running, automatically.
   - If android tests hangs and you receive this error: *Exceeded timeout of 300000ms while handling jest-circus "setup" event*, you will need to downgrade API of AVD System Image to 28
     - Open *Android Studio*
     - Go to `Tools -> Device Manager -> (next to emulator used for tests) Edit this AVD -> (next to system image) Change` 
     - Change API Level to 28 (Release name: *Pie*)
   - Individual test runtime is ~30 seconds (we start all tests back from the login window). Total test runtime will change as we add more tests, but expect it to take a few minutes as well.

## UI Automation Testing Process
For information on testing process and how to write new cases visit QA's [Automated Testing Process](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/Automation#ui-automation-testing-process) section.
> **Note**
> - All detox scripts are located in the e2e folder.
> - For most tests, you should have the same initial format where you import the necessary variables, have a dictionary of any constants, and run a *beforeAll* statement that navigates to the specific place in the app before running your tests.
> - Utils.ts is where the global functions/constants live.  It is also is where all the navigation to a specific page functions live.
> - Detox help can be found here: https://wix.github.io/Detox/docs/19.x/api/matchers
> - Because our test case suite is so large, it may be best to exclusively run just the test you are working on by doing `yarn e2e:<android/ios>-test /e2e/tests/<yourName.e2e>`. 
> - If you change anything in the app code, you will need to run `yarn e2e:<android/ios>-build` beforehand