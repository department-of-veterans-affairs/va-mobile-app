# Release Testing

The purpose of release testing is to catch critical bugs before releasing new versions of the mobile app to the App and Play stores, by running the [Release Candidate (RC) regression script](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=1523) (and then, of course, deciding whether to fix bugs before release!). 

Even though we test all tickets included in a release individually, running the RC script is important to catch regressions in areas that were not covered by individual ticket testing (ex: a change made at a component level that was spot-checked and passed for several instances of that component, but breaks the UI in an area that wasn't tested, could be caught during RC regression testing.)

## The release testing process

### Release run and build are made
When it's time for a new release, automated scripts create iOS and Android release candidate builds that are distributed via TestFlight and AppTester, and also a release candidate regression testing run in TestRail. A member of the QA team will assign the cases of the test run evenly to the available testers, and pick [an assistive technology](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=3239) that will be used for all cases in the run.

### Testing the release candidate build
Members of the QA team run their assigned portions of the script, using the release candidate builds and 'actual' test users in the VA staging environment (not demo mode of the app). When issues that are found, the QA Engineer will write a bug ticket (per usual process), making sure to check if the issue is present in the most recent release that's live in App and Play stores, or if it's a new issue specific to this release.

_The release candidate script is split between manual testing and automated testing (see [description of automated release testing](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/Automation#release-candidate-automation)). For efficiency, we are working to automate as much RC testing as possible. However, due to limitations within the VA ecosystem around storing and accessing credentials to staging environments, as well as limitations by upstream teams on how often we can make PUT requests, many service calls that are critical to cover during release testing will remain manual testing, for now._

Occasionally, upstream service downtimes will prevent QA from running portions of the RC script (ex: appointment services are down during the RC testing window, which prevents us from testing appointment details display and appointment cancellation). When this occurs, the QA assigned to test those cases works with the Product release owner, typically in Slack, to figure out appropriate next steps (delaying release signoff in hopes of the services coming back up to allow testing; releasing without QA signoff, with the risk of not having tested that portion of the script; etc.)  

### QA release signoff
Once all cases in the release testing script have been run, a QA representative adds a comment to the release ticket which includes a list of bugs found (if any), and whether or not QA recommends releasing the candidate build based on our testing results. The Product release owner uses this information to decide whether to release as-is, or to fix bugs before release.

## Maintaining the RC regression testing script
As the functionality within the mobile app continues to grow, it's important to maintain a release testing script that both 1) covers the key workflows of critical features within the mobile app and 2) is a reasonable time investment to run each release. 

Continuing to automate what we can is a key element of getting good coverage of the mobile app each release, while not continually increasing QA testing time required to release the app.

Another key element to maintaining this balance is crafting RC test cases for new features at a good level of 'depth' (more intensive for highly-used features; less intensive for less-frequented activities). For further discussion, see the RC case responsibilities for feature testing _link will be added after that documentation is written_.