# Release Testing

The purpose of release testing is to catch critical bugs (and then fix them!) before releasing new versions of the mobile app to the App and Play stores, by running the [Release Candidate (RC) regression script](https://dsvavsp.testrail.io/index.php?/suites/view/92&group_by=cases:section_id&group_order=desc&display_deleted_cases=0&group_id=1523). We test all tickets included in the release individually, but running the RC script is important to catch regressions in areas that were not covered by individual ticket testing (ex: a change made at a component level that was spot-checked and passed for several instances of that component, but breaks the UI in an area that wasn't tested, could be caught during RC regression testing.)

## The release testing process

1. 

## Maintaining the RC regression testing script

