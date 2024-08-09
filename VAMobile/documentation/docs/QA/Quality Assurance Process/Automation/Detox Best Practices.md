---
title: Detox Best Practices
sidebar_position: 2
---

# Detox Best Practices

This is a set of best practices around creating and maintaining the detox tests.

### Creating/updating detox tests for a new feature

For any new feature work detox work needs to either be:
- Added to the acceptance criteria and done on a per ticket basis
- Done in a new ticket at the end of the feature that encompasses all the work completed (If a new ticket needs to be made please follow the Engineering best practices for ticket creation.)

The following must be done for all new feature detox work no matter whether you are updating an existing detox test or creating a new one. 

- Ensure that the test encompasses any new changes to the manual release candidate (RC) script and test steps where possible
	- Anything that happens outside of the app itself can't be automated with Detox.  In the past this has included stuff like opening and selecting an attachment in messages etc.
- Inform QA what has been automated.  This allows QA to:
	- Move the correct manual cases to the automated folder/split a case if needed in testRail
	- Confirm that all test runs for the new automated script can be recorded in TestRail (preferably automatically, but at least manually)
- Ensure the new/updating script provides artifacts (where necessary) for success and failure
- Ensure that the new test has been added to the array/dictionary in the Navigation.e2e and AvailabilityFramework.e2e tests (if needed). How to add new tests can be found [here](/docs/QA/Quality Assurance Process/Automation/AddingNewFeatures)
- Ensure that the test is named for the screen/feature its automating ('Prescriptions', 'HomeScreen', etc.) and that the test has been placed in the e2e folder.
- Ensure that e2e_detox_mapping.yml has been updated to account for any added/deleted files

### Updating Detox tests for non feature work

Detox is currently running on a per PR basis and is running any tests that might be affected with the code change.  The following must be done if any of the detox tests fail:

- Update any parts of the detox that were affected by the code change and repush the PR.  This will cause the test to rerun. 
	- If you want to check to see if the detox test works before pushing the PR you can either run the test locally or run the test in github actions using the workflow_dispatch trigger
- Ensure that e2e_detox_mapping.yml has been updated to account for any added/deleted files in the PR

### General Best Practices
- Tests usually follow the same initial format where you import the necessary variables, have a dictionary of any constants, and run a beforeAll statement that navigates to the specific feature in the app
- Any global functions/constants should be placed in utils.ts.  Utils.ts is also where all the navigation to a specific page functions live.
- Set your demo mode password to '' (null) before running the tests
- Use `by.id` in your tests (and add the associated testID to the code) where possible.  This makes the tests less flaky
