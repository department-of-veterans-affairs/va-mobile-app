---
name: QA Test Plan Template
about: This is a test plan template for document tests steps for a Feature or Epic
  ticket
title: ''
labels: ''
assignees: ''

---

## Description
_Add a brief description of what these test cases are covering._

## Reference tickets
_Add ticket references for any tickets these tests cases will cover._

## Acceptance Criteria
_Add a numbered list of acceptance criteria the test cases will cover._
_EXAMPLE:_

1. As a user, when I turn the Push Notification option ON from the Settings menu, I should see push notifications appear on my device.
2. When a user taps on a Push Notification, the VA app should open and the user should be directed to the appropriate page within the app.
3. If a user is not logged into the app when tapping on a Push Notification, the user can log into the app first, then be directed to the appropriate page.
4. If the user has the Push Notification turned OFF, the user should not see push notifications appear on their device.

## Test Steps
_For each Test Step, write a numbered list (with sub-numbers) associated with the respective Acceptance Criteria._
_EXAMPLE:_

**1 - User receives push notification and navigates to the Review Letters page**
1.1 - Log into the app as a Staging user, then go to the Preferences > Notifications page and turn the 'Benefits claims and decision reviews' option ON.
1.2  - Leave the app, but do not log out (switch to another app or the device Home screen).
1.2 - Send the push notification to the test user's account.
1.3 - Observe: The user should see the push notification appear on their device.

- [ ] PASS

## Screenshots and documentation
*Add any supporting screenshots, Figma links, and test user credentials needed for testing.

## Additional Notes
