---
title: Front end
---

Below is a list of questions a front end engineer contributing to the VA: Health and Benefits mobile app should be asking themselves about a feature or issue they are developing. This list is not all encompassing but should be a good jumping off point for contributing meaningful code updates to the app.

* Should my feature be using a feature flag? 
    * Does the feature flag need to be referenced via featureEnabled in multiple places? If too many, should we consider a 'screen flipper' paradigm? 
    * If a feature flag is used, am I correctly encompassing the features work in an epic for go-live considerations?
* Have I considered analytic options for my feature? 
    * If analytics are included, do they use the q1, q2, q3... functionality as custom defined properties for google analytics to easily isolate my data? 
* Are my screens appropriately defined as screens and not components in another screen so that they are logged as page views?
* Have I setup waygate defaults for any new screens to enable testing via developer menu?
* Have I correctly identified authorized services and gated calls to any api's behind maintenance windows, authorization, and feature flags?
* Have I included feature documentation for the mobile app platform docs page?
* How does this feature work offline?
* Should my feature interact with any other places in the mobile app? (Home Screen activity button? Push Notification?)
* Should I be considering the new feature element as an in app review/in app feedback trigger?
* Does my feature look as expected in dark mode?
* Are there any special accessibility considerations for this feature?
* Can any of my logic be converted into a util / component?
* Are there any specific testing users or specific data needed?
* Would Veterans benefit from a Smart banner promoting the app/feature on VA.gov?

If any of these questions leave you scratching your head asking 'what's that?' please reach out in the [#va-mobile-app](https://dsva.slack.com/archives/C018V2JCWRJ) channel so we can help and expedite further documentation.