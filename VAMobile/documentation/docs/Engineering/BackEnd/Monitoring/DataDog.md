---
title: Datadog
---

## Existing Mobile Dashboards

- [Service Page](https://vagov.ddog-gov.com/apm/services/mobile-app/operations/rack.request/resources?env=eks-prod&panels=qson%3A%28data%3A%28%29%2Cversion%3A%210%29&resources=qson%3A%28data%3A%28visible%3A%21t%2Chits%3A%28selected%3Atotal%29%2Cerrors%3A%28selected%3Atotal%29%2Clatency%3A%28selected%3Ap95%29%2CtopN%3A%215%29%2Cversion%3A%211%29&sort=error-rate%2Cdesc&summary=qson%3A%28data%3A%21f%2Cversion%3A%211%29&view=spans&start=1701356709938&end=1701360309938&paused=false), 
- [Alerts](https://vagov.ddog-gov.com/monitors/90011?view=spans)
-  and [Dashboard (Legacy)](https://vagov.ddog-gov.com/dashboard/j6m-3ws-x4c/mobile-api-dashboard-20?fromUser=false&refresh_mode=sliding&view=spans&from_ts=1715096667291&to_ts=1715100267291&live=true).

If you have issues accessing the dashboard or the VA Datadog site reach out in the [VA mobile slack channel](https://dsva.slack.com/archives/C018V2JCWRJ)

## Creating Alerts

Reference existing alerts linked above to define new alerts. To receive alert messages in slack the Datadog slack tool will need to be added to the channel where you want notifications then the channel also needs to be added via the slack integration within Datadog. Once this is complete the channel will be in a dropdown in the 'Notify your team' section shown above. [Slack integration docs](https://docs.datadoghq.com/integrations/slack/?tab=slackapplication)

![Using slack search to find existing monitors by searching for Datadog](../../../../static/img/backend/datadog-slack-integration-1.png)
![VA Digital Service slack integration dashboard with a list of available slack channels](../../../../static/img/backend/datadog-slack-integration-2.png)

[Read more about Datadog on the official documentation](https://docs.datadoghq.com/getting_started/)