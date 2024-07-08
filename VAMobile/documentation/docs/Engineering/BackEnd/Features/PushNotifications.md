---
title: Push Notifications
---

## Architectural Overview

![FLow diagram for how push notification get to the app from the Vetext service](../../../../static/img/backend/MobilePush.jpg)

## Getting Your Push In The App

1. Contact VANotify and VEText to get onboarded to their API and get a push template created. Reach out in slack: [#va-notify-public](https://dsva.slack.com/archives/C01CSM3EZGT) or by emailing <oitoctovanotify@va.gov>
2. Get your push template content approved by the mobile team

### Example push template content

```js
{
  "default": "Appointment Reminder Default",
  "APNS": {"aps":{"alert": {"title":"VA Appointment Reminder","body":"You have an upcoming VA appointment."}},  "appt":"%APPOINTMENT%"},
    "APNS_SANDBOX": {"aps":{"alert": {"title":"VA Appointment Reminder","body":"You have an upcoming VA appointment."}},"appt":"%APPOINTMENT%"},
  "GCM": {"notification": {"title": "VA Appointment Reminder","body":"You have an upcoming VA appointment."},"data": {"appt": "%APPOINTMENT%"}}
}
```

:::tip
The "data" field should include any variable data for the alert title or body, and the necessary metadata from the app to deeplink to the correct location.
:::

1. Connect your system to VANotify API to trigger push and test pre-app triggering in staging. [General VANotify Docs](https://notifications.va.gov/)
2. Get access to testflight app from mobile team to test notifications and notification preferences in staging. [Testflight & App Tester](../../../QA/Resources.md#testflight--apptester)
3. Do a Prod test if possible
4. Mobile will update store info to acknowledge new notifications if necessary
5. Go live
