---
title: What's new
---

## Feature Summary

What's new displays to the veteran what is new in the version that they upgraded to. This alert is only shown if the version of the app the user is on is the most recent in the store and if there is asignificant change to announce with the provided notes to display to the user. The user can dismiss this alert from reappearing for the current version.

## Use Cases

* Use Case 1: The user is on the most recent version available in the store, and there are notes for the alert to display, resulting in the alert being shown (see screenshot)
* Use Case 2: The user is on the most recent version with notes to display, but the user has dismissed the alert, causing it to no longer be displayed
* Use Case 3: The user has dismissed the alert, but a feature flag or authorized service has been turned on causing 
  just that feature's information to display
* Use Case 4: The user is on a older version of the app and instead sees [Encouraged Update](..
  /EncouragedUpdate/EncouragedUpdate.md)
* Use Case 5: The user is on the most recent version, but there are no notes to be displayed, so there is no alert

## How to display What's New

What's new is displayed based on the WhatsNewConfig, which contains an array of feature names and optional flags and authorized services.

* `featureName` will be mapped to the translation file by convention to display body content, bullet points, 
and links 
* `featureFlag` will prevent this feature from being displayed unless that flag is on for the user
* `authorizedService` will prevent this feature from being displayed the user has that authorized service

If the user dismisses the What's New alert and a flag or service later enables that feature, it will appear again 
with that feature's content.

## Example Screenshots of the What's New feature

### Expanded

![The expanded state of the what's new component](../../../static/img/whatsNew/WhatsNewExpanded.png)

### Not Expanded

![The collapsed state of the what's new component](../../../static/img/whatsNew/WhatsNewNotExpanded.png)
