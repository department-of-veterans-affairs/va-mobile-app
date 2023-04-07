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
2. Build the app. iOS is `yarn e2e:ios-build` and Android is `yarn e2e:android-build`
3. Run tests. iOS is `yarn e2e:ios-test` and Android is `yarn e2e:android-test`.  
