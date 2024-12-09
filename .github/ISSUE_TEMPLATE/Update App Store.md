---
name: testing Update App Store
about: Template for work needed to update Google, Apple or Va.Gov app store content and images 
title: Update App Store
labels: app store
assignees:
---


## Description 
As the Veteran, I want all the app stores/pages to accurately reflect the most recent changes in the app so that I know what to expect before going into the app. 

As part of this story we want to: 

<!-- List the desired outcome(s) for this ticket -->  
Determine what, if any, changes are needed to Apple, Google and VA.gov App Store pages
-  App Store Whats New content(not applicable for VA.gov App Store)
-  App Store images
-  App Store app description needs updated 

## Acceptance Criteria
<!-- Add a checkbox for each item required to fulfill the user story/issue. -->  
- [ ]  Create image for [Apple Store](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596?platform=ipad) for iPad
- [ ]  Create image for [Apple Store](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596?platform=iphone) for iPhone
- [ ]  Create image for [Google Play Store](https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US) for Android phone
- [ ]  Create image for [VA.gov app page ](https://mobile.va.gov/app/va-health-and-benefits) using iPhone images
- [ ]  Create new app description for [Google Play Store](https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US)
- [ ]  Create new app description for [Apple Store](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596?platform=iphone)
- [ ]  Create new app description for [VA.gov app page](https://mobile.va.gov/app/va-health-and-benefits)
- [ ]  Create new App Store Whats New description for [Google Play Store](https://play.google.com/store/apps/details?id=gov.va.mobileapp&hl=en_US&gl=US)
- [ ]  Create new App Store Whats New description for [Apple Store](https://apps.apple.com/us/app/va-health-and-benefits/id1559609596?platform=iphone)
- [ ]  Sent Mobile.Va.Gov an email and Microsoft Teams communication with Mobile's update request
- [ ]  Flagship PM to validate any app store (image, content) changes 
- [ ]  Update [alt text for Va.gov app page](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/Teams/QA%20and%20Release/Release%20Management/Go%20to%20Market/VA.Gov%20App%20Store%20Page/Images%20In%20Use/Alt%20Text%20Image.md)

## Notes 
- All work to be done before the end of the sprint that the feature is going out
- Some parts have a longer lead time (Va.gov App Marketing Page) so please prepare accordingly
- Whats New In-App Alert box content is not included here as its not part of the app store - see separate ticket template "In-App Whats New Content - Feature Name - Release" ex [8833](https://app.zenhub.com/workspaces/va-mobile-60f1a34998bc75000f2a489f/issues/gh/department-of-veterans-affairs/va-mobile-app/8833) 
- Any questions please reach out to Release Manager 

### Images
- Includes: iPad, iPhone and Android Phone (and a description image) 
- Process for [Updating the App Stores](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/va-mobile-app/Teams/QA%20and%20Release/Release%20Management/Go%20to%20Market/App%20Store%20Updates.md)
- Historically - UX creates the images backed on this [process](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Operations/Updating%20the%20App%20Stores/#designer-update-the-app-store-images) then Flagship PM validates the images and then works with their FE to submit the PR to update the images
- Images should be the same across Google, Apple and Va.Gov
- UX to create a new folder with YYYY Mon and Feature in this [Google Drive](https://drive.google.com/drive/folders/1t_WOjaZkJKNR9oXEMczjtIePAFef2ym6)
- Note if new feature is added then may need to consider how we list them in the first image which contains a list of features "Use this app to:"
- Work is done outside of the Release Ticket process
- As of June 2024 - new images need to be compressed through something like ImageOptim per Tim before being added into the repo to remove any metadata that might be bloating the files
- [Process doc for Update Va.Gov App Store ](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/Teams/QA%20and%20Release/Release%20Management/Go%20to%20Market/VA.Gov%20App%20Store%20Page)

### Content
- Inclues: App Store Whats New and App Description 
- Content will create the test for Whats New App Store (if we do not want to use "We added general improvements and fixed a few bugs.")
- This change is required for the Release process - notify Release Manager change is coming and when its done 
 

### Va.Gov Marketing Page
- Its a VA Marketing Page that will need to be updated by Flagship PM and has its own [process](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/Teams/QA%20and%20Release/Release%20Management/Go%20to%20Market/VA.Gov%20App%20Store%20Page)
- Images need to be stored in [Images in Use Github folder](hhttps://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/va-mobile-app/Teams/QA%20and%20Release/Release%20Management/Go%20to%20Market/VA.Gov%20App%20Store%20Page/Images%20In%20Use) as VA pulls images from here


 


## Ticket Checklist

- [ ] Acceptance criteria defined
- [ ] Labels added (front-end, back-end, feature)
- [ ] Linked to an Epic
- [ ] Notify Mobile Release Manager at least 1 sprint ahead of implementation date 

