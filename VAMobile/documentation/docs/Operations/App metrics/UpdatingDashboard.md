---
title: Updating the dashboard
sidebar_position: 2
---

# Updating the monthly dashboard
*Last updated July 21, 2023*

The [monthly dashboard](Dashboard.md) uses two types data sources: 
* **Google Analytics**: This data automatically updates every 12 hours directly from GA
* **App stores reviews & downloads data**: This data is gathered manually once a month and put into a Google Sheet that the dashboard pulls from. We are not using APIs to gather this data.

This documentation explains how to update the later data.

App store data is very volatile and can take up to 7 days to settle. **We currently update the data every month on or after the 7th of the month** for consistency and to avoid any discrepancies that happen due to Apple and Google's collection processes. 

## Overview of steps
1. Complete the steps in the [Steps to gather and record app store data section](#Steps-to-gather-and-record-app-store-data)
2. Review the [monthly dashboard](Dashboard.md) and confirm the board is operating properly post-data updates. Make adjustments if needed.
3. Posted in DSVA Slack channel #va-mobile-app-analytics that the updates are complete for the prior month and tag the following stakeholders:
    * Mobile app POs: Rachel Han and Ryan Twell 
    * Mobile app Project Manager: Jennifer Brown 
    * VA Communication stakeholders: Michelle Correll and Ty Brettnacher

Typically, the Slack update should also include a post that details:
* A reminder that all data except for the app stores’ data points automatically update and that the message is only announcing that the manual addition of the app store data is complete.
* Any changes to definitions/analytics made in the last month that impact what users will see on the board.
* High-level trends/insights over time given the last month's data.

## Links you will need
### Google Sheet repository for the data
- [Analytics Google Sheet](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=193762787)

### Links for iOS data
Apple/iOS data is gathered from the App Store Connect in two places:
- For iOS downloads: [Downloads Report](https://appstoreconnect.apple.com/analytics/app/d30/1559609596/metrics?annotationsVisible=true&chartType=singleaxis&measureKey=units&zoomType=day)
- For overall rating: [App Store Rating](https://appstoreconnect.apple.com/apps/1559609596/appstore/activity/ios/ratingsResponses?m=)
    - **Note**: currently we bring in daily rating distribution data for Android but we do not for iOS.

### Links for Android data
Android data is gathered from the Google Play Console in two places:
- For Android downloads: [Statistics: Saved report - New users](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/statistics?metrics=USER_ACQUISITION-NEW-EVENTS-PER_INTERVAL-DAY&dimension=COUNTRY&dimensionValues=OVERALL&dateRange=2023_6_7-2023_7_6&tab=APP_STATISTICS&ctpMetric=DAU_MAU-ACQUISITION_UNSPECIFIED-COUNT_UNSPECIFIED-CALCULATION_UNSPECIFIED-DAY&ctpDateRange=2023_6_7-2023_7_6&ctpDimension=COUNTRY&ctpDimensionValue=OVERALL&ctpPeersetKey=3%3A7098e2ceb59ccf42)
- For overall and daily distribution of app store rating: [Ratings](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/user-feedback/ratings)

## Steps to gather and record app store data
Update the Mobile Analytics sheet tabs as follows:
### Google Installs tab
1. Go to the Google Play Console [Statistics saved report for New users](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/statistics?metrics=USER_ACQUISITION-NEW-EVENTS-PER_INTERVAL-DAY&dimension=COUNTRY&dimensionValues=OVERALL&dateRange=2023_6_7-2023_7_6&tab=APP_STATISTICS&ctpMetric=DAU_MAU-ACQUISITION_UNSPECIFIED-COUNT_UNSPECIFIED-CALCULATION_UNSPECIFIED-DAY&ctpDateRange=2023_6_7-2023_7_6&ctpDimension=COUNTRY&ctpDimensionValue=OVERALL&ctpPeersetKey=3%3A7098e2ceb59ccf42) (If the link does not automatically take you to the save report, it can be found under the dropdown menu for "Saved reports" in the upper right-hand corner.)
2. Adjust the date filter to the last month.
3. Then, click "Export report" next to the date filter. Choose "Export time series (CSV)" option
4. Add the data to the bottom of the [Google Installs Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=136850874) in the Analytics Google Sheet

### Play Store Rating & Google Daily rating distribution tabs
1. Go to the [Play Store Ratings](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/user-feedback/ratings) page
2. Next to `Performance over time`, change the report time series to `Last 90 Days`
3. Scroll down to the `Ratings Distribution` section
4. Click the `Download CSV` option 
5. Copy the data from just the reporting month you need and add it to the [Google Daily rating distribution tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=974990099)
6. Take the value at the top of the [Play Store Ratings](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/user-feedback/ratings) page, under Overview, for `Default Google Play rating` and copy it to the [Play Store Rating Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=458611038)

### iOS installs tab
1. Go to the [App Store First-Time Downloads](https://appstoreconnect.apple.com/analytics/app/d30/1559609596/metrics?annotationsVisible=true&chartType=singleaxis&measureKey=units&zoomType=day) report in the Metrics section Analytics  page
2. Change the time period in the upper right-hand corner to be just the reporting month you want
3. Click the `...` overflow menu on the right of the chart and select `Export as CSV`
4. Copy the data into the [ios installs Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=193762787)

### Apple App Store Rating
1. Go to the [App Store Rating](https://appstoreconnect.apple.com/apps/1559609596/appstore/activity/ios/ratingsResponses) page
2. Get the rating value at the top and copy it to the [ios store rating Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=774069486)
