# Datadog

This section will share a short overview of how to use Datadog to analyze, and alert on VA metrics

## Integrations

One of the major Pros of Datadog is a plethora of already created integration steps. [Datadog integration documentation](https://docs.datadoghq.com/getting_started/integrations/)

![](../../../../static/img/backend/datadog-aws-integration.png)

## Exploring Metrics

You can search for existing metrics using Datadog's explore page. Within Datadog navigate to Metrics -> Explore from the sidebar. Selecting a metric from here will automatically create a graph that can be modified and exported to new or existing dashboards. [Explore documentation](https://docs.datadoghq.com/metrics/explorer/)

![](../../../../static/img/backend/datadog-metrics-explorer.png)

## Creating Graphs

1. Navigate to Dashboards -> Quick Graphs or edit a graph from an existing dashboard
2. Choose the metric to graph by searching or selecting it from the dropdown next to 'Metric'

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

## Formulas

You can compare multiple metrics by using formulas.
Example: Request error rate averaged over 5 minutes

![](../../../../static/img/backend/datadog-formula-graph.png)

## Dashboards

Dashboards allow you to display many different widgets. Select the 'Add widgets' button then select the desired widget. [Widgets documentation](https://docs.datadoghq.com/dashboards/widgets/)

![](../../../../static/img/backend/datadog-add-widgets.png)

Additionally you can add variables for use across all widgets within a single dashboard. At the top of a dashboard select the pencil icon then fill in the details of your variable. These variables can be accessed from within a widget using `$[variable name]`. [Template variables documentation](https://docs.datadoghq.com/dashboards/template_variables/)

![](../../../../static/img/backend/datadog-mobile-api-dashboard.png)

## Creating Alerts

1. Define a metric to alert on. This works the same as discussed in the graphs section above

![](../../../../static/img/backend/datadog-alert-metric.png)

2. Define alert thresholds. These will dictate when the alert triggers

![](../../../../static/img/backend/datadog-alert-threshold.png)

3. Decide how you would like to be notified when the alert triggers

![](../../../../static/img/backend/datadog-alert-notify.png)

4. Define message you want to appear when alert triggers

![](../../../../static/img/backend/datadog-alert-message.png)

To receive alert messages in slack the Datadog slack tool will need to be added to the channel where you want notifications then the channel also needs to be added via the slack integration within Datadog. Once this is complete the channel will be in a dropdown in the 'Notify your team' section shown above. [Slack integration docs](https://docs.datadoghq.com/integrations/slack/?tab=slackapplication)

![](../../../../static/img/backend/datadog-slack-integration-1.png)
![](../../../../static/img/backend/datadog-slack-integration-2.png)

## Good Places to Get Started

[Datadog 101 videos](https://www.youtube.com/playlist?list=PLdh-RwQzDsaOoFo0D8xSEHO0XXOKi1-5J) and [Datadog documentation home page](https://docs.datadoghq.com/getting_started/)

## Existing Mobile Dashboards

[Dashboard](https://app.datadoghq.com/dashboard/9nz-cn7-ws6/mobile-api-dashboard) and [Alerts](https://app.datadoghq.com/monitors/manage?q=mobile). If you have issues accessing the dashboard or the VA Datadog site reach out in the shared mobile slack channel
