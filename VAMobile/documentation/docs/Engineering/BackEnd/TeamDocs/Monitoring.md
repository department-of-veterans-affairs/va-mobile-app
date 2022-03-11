# Monitoring

Many of the investigation tools below need the [SOCKS proxy](https://depo-platform-documentation.scrollhelp.site/getting-started/Internal-tools-access-via-SOCKS-proxy.1821081710.html) or the requisite [AWS permissions](https://github.com/department-of-veterans-affairs/devops#setup) setup.

## Sentry
[Sentry](http://sentry10.vfs.va.gov/auth/login/vsp/v/auth/login/vsp/) is our automated error tracking tool. New exceptions in the API will cause Sentry to send us an email alert. We also audit the existing errors when fixing tech debt or silencing errors that are expected, i.e. unexceptional, such as when sub-systems return validation or not-found errors as 500s rather than 422s or 404s.

All our classes are namespaced with a 'Mobile' Ruby module. When auditing errors a custom search of 'Mobile' filters out other vets-api errors.

![](../../../../static/img/backend/sentry-custom-search.png)

To further refine the search to only 'error', rather than 'warn' or 'info' level errors you can toggle open the search builder bar.

![](../../../../static/img/backend/sentry-toggle-search-builder.png)

And then select 'error' from the list.

![](../../../../static/img/backend/sentry-log-level-toggle.png)

Once you've found an error, or have been linked to one directly from an alert email, you'll be taken to the error details page.

![](../../../../static/img/backend/sentry-exception.png)

The majority of our errors occur during HTTP responses. Often the errors first present themselves deep within the API framework's base classes.

![](../../../../static/img/backend/sentry-exception-app-only.png)

Selecting the 'Full' tab reveals the full call stack and as seen below the true source of the error.

![](../../../../static/img/backend/sentry-exception-full-details.png)

Once the location of the error has been determined the next step is determining the cause. Errors from bugs we have introduced (500s in our API responses) will have clear Ruby errors such as 'NoMethodError'. For errors from sub-systems you'll need to check the 'ADDITIONAL DATA' section of the error details page.

As seen below this section includes the errors from the upstream service as well as any custom tags added for that specific service. In this case 'ICN' and 'MHV Correlation ID' can be used to cross-reference Loki based logs to get an idea of the full request flow and any user actions that lead up to the error.

![](../../../../static/img/backend/sentry-exception-additional-data.png)

## Logs

This section goes over the process of how to access, search, and parse logs on Grafana

### How to Access and Search Logs

The Grafana UI is used as the visualization interface for logs aggregated by Loki.

To view logs, Log in to the [VFS Grafana instance](http://grafana.vfs.va.gov/?orgId=1) 🧦 (SOCKS needed; use GitHub account for auth; see image below)

![](../../../../static/img/backend/grafana-login.png)

Go to Explore (the little compass icon on the left-hand navigation; see image below)

![](../../../../static/img/backend/grafana-explore.png)

Select the Loki environment that you’re interested in (from the drop-down near the top-left of the page; see image below)

![](../../../../static/img/backend/grafana-loki.png)

You’ll now see a query interface for searching and analyzing log files:

![](../../../../static/img/backend/grafana-loki-query.png)

In the Log browser, enter a query  starting with an app label to view all logs for a given app.

Many developers will be interested in vets-api logs:
  a. To use this use case as an example, click “Log browser”
  b. Make sure “app” is highlighted
  c. Scroll down and highlight “vets-api-server” or “vets-api-worker” depending on your need
  d. Click “Show logs”

![](../../../../static/img/backend/grafana-loki-query-steps.png)

Note: The query can be updated to include two labels such as the app and specific log file.
```
{app="vets-api-server", filename=~".+json.log"}
```

After selecting the labels for the data you are looking for, modify the query in the browser to include the text or the regex of the data you are looking for and then run the query. 

A basic query example that searches for errors within the logs:
```
{ app=~"vets-api-server", filename=~".+json.log" } |~ "error"`
```

![](../../../../static/img/backend/grafana-query-example.png)

If searching for data that has a specific key and value, the data can be searched using regex. In the example below, The query is looking for log lines that contain a key of “message” with a value of “Mobile Request”.

###  How to Parse Logs

LogQL can be used to parse data out of certain log formats such as JSON or traditional Apache log formats. To parse logs, you need to enter a query of the data that you are looking for, then include the regex expression to remove the prefixed timestamp, container name, and pipe symbol. Once you use regex to extract the JSON blob to an object, you can then parse it with the built-in JSON parser.

The regex expression that needs to be included in the to extract JSON to an object is:
```
| regexp "(?P<time>\\d\\d:\\d\\d:\\d\\d) (?P<process_name>\\w+.\\d) \\s+ (\\|) (?P<json>.+)"
```

To parse JSON blob, also include in the query:
```
| line_format "{{.json}}" | json
```

The query end-result will look like:
```
{app="vets-api-server", filename=~".+json.log"} |~ "error" | regexp "(?P<time>\\d\\d:\\d\\d:\\d\\d) (?P<process_name>\\w+.\\d) \\s+ (\\|) (?P<json>.+)" | line_format "{{.json}}" | json
```

Where “error” can be replaced with any data that you are searching for within the logs.

![](../../../../static/img/backend/grafana-loki-complex-example.png)

In the resulting logs, click on one of the logs to see additional details, including extracted fields and other labels that are tagged onto that specific message. Within the list of labels will be the json label that contains the json blob.

The contents of the json are then listed under “detected fields”.

![](../../../../static/img/backend/grafana-loki-detected-fields.png)

## Statsd Metrics

You can create custom Mobile metrics within Vets API by adding new statsd entries to `modules/mobile/config/initializers/statsd.rb`.

![](../../../../static/img/backend/statsd.png)

More information about Statsd can be found at: https://github.com/Shopify/statsd-instrument . In order for metics to be picked up an entry for the associated endpoint must also be in `ansible/deployment/config/revproxy-vagov/vars/nginx_components.yml` in the [DevOps repo](https://github.com/department-of-veterans-affairs/devops)

![](../../../../static/img/backend/mobile-api-components.png)

## Datadog

This section will share a short overview of how to use Datadog to analyze, and alert on VA metrics

### Integrations

One of the major Pros of Datadog is a plethora of already created integration steps.[Datadog integration documentation](https://docs.datadoghq.com/getting_started/integrations/)

![](../../../../static/img/backend/datadog-aws-integration.png)

### Exploring Metrics

You can search for existing metrics using Datadog’s explore page. Within Datadog navigate to Metrics -> Explore from the sidebar. Selecting a metric from here will automatically create a graph that can be modified and exported to new or existing dashboards. [Explore documentation](https://docs.datadoghq.com/metrics/explorer/)

![](../../../../static/img/backend/datadog-metrics-explorer.png)

### Creating Graphs

1. Navigate to Dashboards -> Quick Graphs or edit a graph from an existing dashboard
2. Choose the metric to graph by searching or selecting it from the dropdown next to ‘Metric’

![](../../../../static/img/backend/datadog-create-graphs-1.png)

3. Select filters for the metric

![](../../../../static/img/backend/datadog-create-graphs-2.png)

4. Decide how to aggregate the metric (Max, Min, Avg, Sum)

![](../../../../static/img/backend/datadog-create-graphs-3.png)

5. Apply functions to the metric. [Functions documentation](https://docs.datadoghq.com/dashboards/functions/)

![](../../../../static/img/backend/datadog-create-graphs-4.png)

Example: Total requests per second to any mobile endpoint averaged over 5 minutes

![](../../../../static/img/backend/datadog-example-graph-query.png)
![](../../../../static/img/backend/datadog-example-graph.png)

### Formulas

You can compare multiple metrics by using formulas.
Example: Request error rate averaged over 5 minutes

![](../../../../static/img/backend/datadog-formula-graph.png)

### Dashboards

Dashboards allow you to display many different widgets. Select the ‘Add widgets’ button then select the desired widget. [Widgets documentation](https://docs.datadoghq.com/dashboards/widgets/)

![](../../../../static/img/backend/datadog-add-widgets.png)

Additionally you can add variables for use across all widgets within a single dashboard. At the top of a dashboard select the pencil icon then fill in the details of your variable. These variables can be accessed from within a widget using `$[variable name]`. [Template variables documentation](https://docs.datadoghq.com/dashboards/template_variables/)

![](../../../../static/img/backend/datadog-mobile-api-dashboard.png)

### Creating Alerts

1. Define a metric to alert on. This works the same as discussed in the graphs section above

![](../../../../static/img/backend/datadog-alert-metric.png)

2. Define alert thresholds. These will dictate when the alert triggers

![](../../../../static/img/backend/datadog-alert-threshold.png)

3. Decide how you would like to be notified when the alert triggers

![](../../../../static/img/backend/datadog-alert-notify.png)

4. Define message you want to appear when alert triggers

![](../../../../static/img/backend/datadog-mobile-api-dashboard.png)

To receive alert messages in slack the Datadog slack tool will need to be added to the channel where you want notifications then the channel also needs to be added via the slack integration within Datadog. Once this is complete the channel will be in a dropdown in the ‘Notify your team’ section shown above. [Slack integration docs](https://docs.datadoghq.com/integrations/slack/?tab=slackapplication)

![](../../../../static/img/backend/datadog-slack-integration-1.png)
![](../../../../static/img/backend/datadog-slack-integration-2.png)

### Good Places to Get Started

[Datadog 101 videos](https://www.youtube.com/playlist?list=PLdh-RwQzDsaOoFo0D8xSEHO0XXOKi1-5J) and [Datadog documentation home page](https://docs.datadoghq.com/getting_started/)

### Existing Mobile Dashboards

[Dashboard](https://app.datadoghq.com/dashboard/9nz-cn7-ws6/mobile-api-dashboard) and [Alerts](https://app.datadoghq.com/monitors/manage?q=mobile). If you have issues accessing the dashboard or the VA Datadog site reach out in the shared mobile slack channel

## On-Call Procedure

This section outlines the steps to take should an alert occur while it’s [your turn](https://docs.google.com/spreadsheets/d/1JGoVHeor2NR5xGDNdpgB0GO8_IZ244nS-L5jisrfzMk/edit?usp=sharing) to be on call. There are two sources of alerts: AlertManager and Firebase. Firebase alerts originate from the app. AlertManager alerts originating from Datadog, these alerts are caused by errors or latency from the back-end API.

### Handling Backend Alerts

1. First use tools described above to track down the source of an issue.
    a. Look up the error in [Sentry](http://sentry.vfs.va.gov/vets-gov/). You can find expanded error details, stack traces, and parameters in Sentry. A good query to start with is searching for the ‘Mobile’ namespace sorted by ‘Last Seen’. Add more filters by toggling open the search builder sidebar on the right of the search field.
    b. [Loki logs via Grafana](http://grafana.vfs.va.gov/) can help you find more data or trace the requests before the error occurred.
    c. Our [Datadog dashboard](https://app.datadoghq.com/dashboard/9nz-cn7-ws6/mobile-api-dashboard?from_ts=1637771308851&to_ts=1637774908851&live=true) offers a wider metric based view of how often the issue has been occurring. It’s also the first place to look for latency issues and to check if an upstream service is down.
    d. [Datadog’s Application Performance Management tool](https://app.datadoghq.com/apm/service/vets-api/rack.request?env=production&topGraphs=latency%3Alatency%2CbreakdownAs%3Apercentage%2Cerrors%3Acount%2Chits%3Acount&start=1642522116800&end=1642525716800&paused=false) is also configured for vets-api. It breaks down the ruby, database, and upstream calls down so you can determine the source latency. The APM also provides p50 and p99 latency data to let us know how slow the worst 50% and 1% of calls are doing.
2. If you’ve determined that the source of the issue is an upstream service contact the [relevant party](https://docs.google.com/document/d/11-AzvvQsiPD47AQebcYeZML-NDHWDhz5-RTn0RnvlX4/edit#heading=h.hz3tr392i4no).
3. If you believe a forward proxy is down or having trouble connecting to the service. Then contact the Operations team via DSVA Slack's [#vfs-platform-support](https://dsva.slack.com/archives/CBU0KDSB1) channel. To open a support ticket type `/support`. This will open a modal window with a form rather than posting a Slack message. For the 'I need help from' field select 'Operations Team'. Then add the details in the 'Summary of request' field.
4. Finally if the error is not from the API, a forward proxy connection to an upstream service, or an upstream service itself but rather an issue with infrastructure that we (and VSP/VFS) control then a SNOW ticket should be opened. Only a DSVA team member can do this. Reach out to a stakeholder and have them open a SNOW ticket for you (currently [Travis Newby](https://dsva.slack.com/team/U020ZP3JK63) or [Leanna Miller](https://dsva.slack.com/team/U019Q7S7B7X)).
