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
