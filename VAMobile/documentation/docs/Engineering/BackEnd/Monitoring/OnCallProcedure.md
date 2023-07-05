# On-Call Procedure

This section outlines the steps to take should an alert occur while it's your turn to be on call. There are two sources of alerts: AlertManager and Firebase. Firebase alerts originate from the app. AlertManager alerts originating from Datadog, these alerts are caused by errors or latency from the back-end API.

## On-Call Rotation
Each week a backend engineer will be on-call. Their on-call hours are the same as their business hours and a slack reminder will show up in [va-mobile-app-alerts](https://dsva.slack.com/archives/C021WCL114J) each Monday tagging whoever is on for that week.

## Handling Backend Alerts

1. First use tools described above to track down the source of an issue.
    1. Look up the error in [Sentry](http://sentry.vfs.va.gov/vets-gov/). You can find expanded error details, stack traces, and parameters in Sentry. A good query to start with is searching for the 'Mobile' namespace sorted by 'Last Seen'. Add more filters by toggling open the search builder sidebar on the right of the search field.
    2. [Logs in Datadog](https://vagov.ddog-gov.com/logs) can help you find more data or trace the requests before the error occurred.
    3. Our [Datadog dashboard](https://vagov.ddog-gov.com/dashboard/pzz-7x2-4cs/mobile-api-dashboard?from_ts=1686762242482&to_ts=1686765842482&live=true) offers a wider metric based view of how often the issue has been occurring. It's also the first place to look for latency issues and to check if an upstream service is down.
    4. [Datadog's Application Performance Management tool](https://vagov.ddog-gov.com/apm/services/vets-api/operations/rack.request/resources?env=production) is also configured for vets-api. It breaks down the ruby, database, and upstream calls down so you can determine the source latency. The APM also provides p50 and p99 latency data to let us know how slow the worst 50% and 1% of calls are doing.
2. If you've determined that the source of the issue is an upstream service contact the [relevant party](../Architecture/Services.md#service_contacts).
3. If you believe a forward proxy is down or having trouble connecting to the service. Then contact the Operations team via DSVA Slack's [#vfs-platform-support](https://dsva.slack.com/archives/CBU0KDSB1) channel. To open a support ticket type `/support`. This will open a modal window with a form rather than posting a Slack message. For the 'I need help from' field select 'Operations Team'. Then add the details in the 'Summary of request' field. Additionally, if you are unsure of who to contact you can make a support request. 
4. Finally if the error is not from the API, a forward proxy connection to an upstream service, or an upstream service itself but rather an issue with infrastructure that we (and VSP/VFS) control then a SNOW ticket should be opened. Only a DSVA team member can do this. Reach out to a stakeholder and have them open a SNOW ticket for you.


