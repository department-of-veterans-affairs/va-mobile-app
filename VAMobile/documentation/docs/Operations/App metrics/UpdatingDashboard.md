---
title: Updating the dashboard
sidebar_position: 2
---

# Updating the dashboard

Currently, the [monthly dashboard](Dashboard.md) needs to by updated with a fairly manual process. There are no APIs for some store data we use to derive the current dashboard, which makes automating the entire process difficult. Beyond that, some store data is very volatile and can take up to 7 days to settle. We currently update the reports every month after the 7th of the month for consistency and to avoid any discrepancies that happen due to Apple and Google's collection processes. 

## Overview
Links you will need:
- [Dashboard in GA](https://datastudio.google.com/u/0/reporting/92cadc84-b31f-4a7a-9be9-6a0c3fe7d572/page/p_hyb9cmea1c/edit)
- [Analytics Google Sheet](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=193762787)
- [Play Store Downloads Report](https://play.google.com/console/u/0/developers/7507611851470273082/download-reports/statistics?appId=4974294731909201030)
- [Play Store Ratings](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/user-feedback/ratings/)
- [App Store Downloads Report](https://appstoreconnect.apple.com/analytics/app/d30/1559609596/metrics?annotationsVisible=true&chartType=singleaxis&measureKey=units&zoomType=day)
- [App Store Rating](https://appstoreconnect.apple.com/apps/1559609596/appstore/activity/ios/ratingsResponses)

## Manual data gathering steps

### Google Downloads
1. Go to the [Play Store Downloads Report](https://play.google.com/console/u/0/developers/7507611851470273082/download-reports/statistics?appId=4974294731909201030)
2. Download the previous month's csv file for the `Overview` report
3. Add the data to the bottom of the [Google Installs Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=0) in the [Analytics Google Sheet](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=193762787)

### Google Ratings Break Down and Play Store Rating
1. Go to the [Play Store Ratings](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/user-feedback/ratings/) page
2. Next to `Performance over time`, change the report time series to `Last 90 Days`
3. Scroll down to the `Ratings Distribution` section
4. Click the `Download CSV` option 
5. Copy the data from just the reporting month you need and add it to the [Google Daily rating distribution Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=974990099)
6. Take the value at the top of the [Play Store Ratings](https://play.google.com/console/u/0/developers/7507611851470273082/app/4974294731909201030/user-feedback/ratings/) page, under Overview, for `Default Google Play rating` and copy it to the [Play Store Rating Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=458611038)

### Apple Downloads
1. Go to the [App Store Downloads Report](https://appstoreconnect.apple.com/analytics/app/d30/1559609596/metrics?annotationsVisible=true&chartType=singleaxis&measureKey=units&zoomType=day) page
2. Change the time period to be just the reporting month you want
3. Click the `...` overflow menu on the right and select `Export as CSV`
4. Copy the data into the [ios installs Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=193762787)

### Apple App Store Rating
1. Go to the [App Store Rating](https://appstoreconnect.apple.com/apps/1559609596/appstore/activity/ios/ratingsResponses) page
2. Get the rating value at the top and copy it to the [ios store rating Tab](https://docs.google.com/spreadsheets/d/1TlhGlT8ker4nvhoOhjxHw5aKwv4kjS_Ucd8KOd1y3tA/edit#gid=774069486)

## Adding and updating a new month
1. Go to the [Dashboard in GA](https://datastudio.google.com/u/0/reporting/92cadc84-b31f-4a7a-9be9-6a0c3fe7d572/page/p_hyb9cmea1c/edit)
2. Select the overflow menu in the top right and click the Refresh data option
3. Select Page-> Manage Pages
4. in the Report Pages sidebar, click the overflow menu on the latest monthly report and select Duplicate
5. Rename the new page to the reporting month
6. Update the page header to the reporting month
7. Select all the charts except the Installs chart. Update the default date range to the reporting month start/end dates
8. Select all the report card charts except the Installs chart and update the comparison dates to the previous month start/end dates
9. Select the Installs chart and change the default ending date to the last date of the reporting month

