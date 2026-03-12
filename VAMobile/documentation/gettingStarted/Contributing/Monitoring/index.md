---
title: Monitoring and alerting requirements
sidebar_position: 2
---

# Monitoring and alerting requirements

This page outlines the requirements and best practices for feature teams integrating with the VA Mobile App. It covers two integration paths:

- **Feature team builds their own feature(s)**
- **Feature team tasks the Mobile App team to build feature(s)**

Guidance below is organized by topic. Each section starts with expectations that apply to all teams, followed by any path-specific expectations.

For backend implementation details (StatsD, Datadog APM, structured logging), see the [Back end monitoring docs](/development/BackEnd/Monitoring/DataDog).

---

## Dashboards

New features are expected to have a dashboard in place before releasing to production. The dashboard should include response monitoring, latency, and throughput for all endpoints introduced. This centralizes data in one location and gives better visibility into new features, especially during the initial rollout period where this is most critical.

Many of these metrics are gathered automatically by Datadog and visible via the [APM](/development/BackEnd/Monitoring/DataDog). However, adding [structured logging](/development/BackEnd/Monitoring/Logs) provides greater insight into branching logic paths and errors, and [StatsD metrics](/development/BackEnd/Monitoring/Statsd) allow for easy, powerful stats aggregation.

**Feature teams building their own features**

Teams who build their own features are expected to create dashboards for those features and will be responsible for ongoing monitoring. Reach out to the Mobile team for guidance if needed.

**Feature teams having features built on their behalf**

Teams having features built on their behalf should work with the Mobile team to identify appropriate metrics for monitoring error thresholds and traffic. The Mobile team will implement Datadog monitors, dashboards, and reporting as part of the feature work. The feature team will own ongoing monitoring after release.

---

## Application Performance Monitoring (APM)

The Datadog APM includes a service section for `mobile-app`, which contains all resources the Mobile team is responsible for. By default, all controllers introduced within `modules/mobile/app/controllers/` in vets-api will have the `service_tag` set to `mobile-app`.

**All feature teams**

Regardless of which team is introducing new features, the `mobile-app` service tag should remain the default. This keeps all mobile resources visible in a single APM service, making it easier to find and evaluate any resource in the mobile codebase during an incident without the extra step of locating the responsible team's own APM service tag.

---

## Alerting

Alerts can be built using [Datadog's monitoring tools](/development/BackEnd/Monitoring/DataDog) to monitor metrics like error thresholds and traffic. See [Creating alerts](/development/BackEnd/Monitoring/DataDog#creating-alerts) for setup instructions.

:::note
The Mobile team's alerting currently parses on all resources with the mobile prefix, which means the Mobile App team will be paged for any alerts triggered within the mobile code space by default.
:::

**Feature teams building their own features**

Feature teams building their own features are expected to introduce their own alerting for the resources they are responsible for. When tagging monitors, use your team's own tag if you have one (e.g., `team:your-team-name`), or `vfs-mobile` if not. The monitor can alert to whatever Slack channel the feature team sees fit.

**Feature teams having features built on their behalf**

Feature teams are still required to introduce their own alerting for the resources they are responsible for. If this is not possible, the Mobile team will assume responsibility for alerting on the feature team's behalf.

**Aligning with the Watchtower team**

All alerting should be built in alignment with the [Watchtower SRE Monitoring and Health Playbook](https://github.com/department-of-veterans-affairs/octo_watchofficer/tree/main/docs/playbook/monitoring-and-health). Key guidance from their playbook:

- [Creating Monitors](https://github.com/department-of-veterans-affairs/octo_watchofficer/blob/main/docs/playbook/monitoring-and-health/05-creating-monitors.md) — best practices for building monitors that work and stay working, including threshold tuning, required tags, evaluation windows, and alert message templates
- [Monitor Anti-Patterns](https://github.com/department-of-veterans-affairs/octo_watchofficer/blob/main/docs/playbook/monitoring-and-health/06-anti-patterns.md) — common mistakes to avoid such as hair-trigger thresholds, mute-and-forget, and alerting on every individual error
- [Quick Reference](https://github.com/department-of-veterans-affairs/octo_watchofficer/blob/main/docs/playbook/monitoring-and-health/quick-reference.md) — checklists, decision trees, and the monitor creation checklist on one page

:::note
Access to the Watchtower playbook requires access to the private `octo_watchofficer` repository. Contact the Watchtower team in [#watchtower-sre](https://dsva.slack.com/archives/watchtower-sre) if you need access.
:::

---

## Incident response

**Feature teams building their own features**

Feature teams are responsible for taking the lead on any incident that arises in their feature area and are responsible for the overall resolution of the issue. Because the Mobile App team is paged for all alerts triggered within the mobile code space, we will be notified alongside your team and will provide assistance as needed to help speed up resolution.

For details on how the Mobile team handles backend alerts, see [On-call procedure](/development/BackEnd/Monitoring/OnCallProcedure).

**Feature teams having features built on their behalf**

Feature teams are responsible for taking the lead on any incident that may occur with their feature, regardless of who built it. If this is not possible, the Mobile team will take the lead and be responsible for the overall resolution of the issue.

---

## Logging

Proper logging is one of the most effective tools for diagnosing issues during and after an incident. See the [Logs](/development/BackEnd/Monitoring/Logs) page for how to access and search logs in Datadog.

When writing log statements, follow the Watchtower guidance on structured logging:

- [Prefer Structured Logs](https://github.com/department-of-veterans-affairs/octo_watchofficer/blob/main/docs/playbook/error-handling/17-prefer-structured-logs.md) — log with structured fields rather than string interpolation so logs are queryable and backtraces are preserved
- [Expected vs Unexpected Errors](https://github.com/department-of-veterans-affairs/octo_watchofficer/blob/main/docs/playbook/error-handling/09-expected-vs-unexpected-errors.md) — use `warn` for expected errors (4xx) and `error` for unexpected failures (5xx) to keep APM dashboards and alerts meaningful

---

## Metrics (StatsD)

StatsD metrics enable powerful aggregation and can be used to track counts, latency, and other signals that inform your dashboards and alerts.

See [StatsD metrics](/development/BackEnd/Monitoring/Statsd) for how to add custom metrics in vets-api.

When adding StatsD metrics, follow the Watchtower guidance on cardinality:

- [Metrics vs Logs Cardinality](https://github.com/department-of-veterans-affairs/octo_watchofficer/blob/main/docs/playbook/error-handling/18-metrics-vs-logs-cardinality.md) — use metrics for low-cardinality aggregations and logs for high-cardinality details like `claim_id` or `user_id`; tagging metrics with unique identifiers will cause dashboards to become unusable
