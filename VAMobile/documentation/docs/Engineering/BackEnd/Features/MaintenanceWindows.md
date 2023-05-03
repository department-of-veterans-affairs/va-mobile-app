# Maintenance Windows

## Overview

Maintenance windows are periods of time during which specific vets-api functionality are expected to be down for maintenance. The mobile app requests this information after login and stores the data locally. If the user navigates to a page that relies on the service during the window, they will be shown a banner informing them that the data is temporarily unavailable and the app will not attempt to fetch the data.

## Backend

Unlike most of the data used in the vets-api engine, MaintenanceWindows come from the database and not from upstream servers. They contain the external service name, start time, and end time.

The mobile app requests maintenance windows via the maintenance windows controller. , which creates a ServiceGraph object that searches the database for MaintenanceWindow records that end in the future. The ServiceGraph