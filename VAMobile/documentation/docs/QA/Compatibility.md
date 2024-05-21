# Compatibility and Support

## Mobile OS Support  
When building a mobile app, minimum OS compatibility must be selected. Supporting older operating systems allows more potential users to be able to run the app, but also may cause support issues as older hardware and unsupported operating systems need to be maintained.
Supporting only newer operating systems reduces the maintenance complexity of the app, but also reduces the number of people who may install the app. 

Our goal is to have allow veterans to access the mobile app in as many versions as possible, while keeping the work necessary to support those versions scalable and sustainable.

### Support Levels
Major OS versions for iOS and Android will fall into one of three support levels:
- **Active**: tested each release; will fix bugs
- **Passive**: not tested each release; will fix bugs (when practical)
- **Unsupported**: not tested; won't fix bugs

These levels are defined by:
- **Active**: Used by 80% of veterans for the VA Health and Benefits mobile app in the last quarter
    - iOS: Last 2 major OS versions
    - Android: Last 3 major OS versions
- **Passive**: Any major versions older than Active, not yet Unsupported
- **Unsupported**: Version for which OS vendor or major dependency (ex: login, react native) has dropped support.
    - Dropping support includes end of development tool support and/or end of security updates
    - As of May 2024, there are no unsupported OS versions for the app



