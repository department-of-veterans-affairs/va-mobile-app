---
name: QA Test Plan Template
about: This is a test plan template for document tests steps for a Feature or Epic
  ticket
title: ''
labels: ''
assignees: ''

---

## Description
<!-- Add a brief description of what ticket or epic the test cases are covering. -->

## Reference tickets
<!-- Add references to any tickest or epics these tests cases will cover. -->

## Test data
<!-- Add any notes about setting up the appropriate test scenarios for testing, including test user login credentials. -->


## Acceptance criteria
<!-- Add a numbered list of acceptance criteria the test cases will cover. -->
*EXAMPLE:*

1. As a user, when I turn the Push Notification option ON from the Settings menu, I should see push notifications appear on my device.
2. When a user taps on a Push Notification, the VA app should open and the user should be directed to the appropriate page within the app.
3. If a user is not logged into the app when tapping on a Push Notification, the user can log into the app first, then be directed to the appropriate page.
4. If the user has the Push Notification turned OFF, the user should not see push notifications appear on their device.

## Test steps
<!-- For each Test Step, write a numbered list associated with the respective Acceptance Criteria as shown in the example below. Sub-numbers can also be used for easier readability. Check the 'Pass' checkbox when test steps for each acceptance criterial are verified. -->
*EXAMPLE:*

**1 - User receives push notification and navigates to the Review Letters page**
Prerequisites: A staging user that can compatible with reveiving any type of update that would push a notification.
1. Log into the app as a Staging user, then go to the Preferences > Notifications page and turn the 'Benefits claims and decision reviews' option ON.
2. Leave the app, but do not log out (switch to another app or the device Home screen).
3. Send the push notification to the test user's account.
4. Observe: The user should see the push notification appear on their device.

- [ ] PASS

## Screenshots and documentation
<!-- Add any supporting screenshots, Figma links, and test user credentials needed for testing. -->

## Additional notes