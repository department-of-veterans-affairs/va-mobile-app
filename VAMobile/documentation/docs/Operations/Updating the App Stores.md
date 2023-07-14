---
title: Updating the app stores
sidebar_position: 3
---

### Update content

#### Prepare content
1. Product provides list of updates in ticket
2. Engineering takes screenshots at 3 sizes
    * **iPhone**: 360 x 760 px (iOS Simulator or device using a 6.5” device such as iPhone 13 or 14)
    * **iPad**: 1040 x 1504 px (iOS Simulator or device using iPad Pro 12.9”)
    * **Android**: 180 x 380 px (Android Emulator or device using Pixel 4)
        * Make sure corners aren’t rounded
        * Taking a screenshot using the camera icon in Android Emulator will result in rounded corners. To bypass this:
            * Go to View > Tool Windows > Logcat
            * In the panel that pops up, click the camera icon in the left toolbar to take a screenshot without rounded corners

            ![Screenshot of Android emulator](/img/app-store/android-emulator.png)
3. Engineering shares screenshots with designer through [Google Drive](https://drive.google.com/drive/folders/1RdW9zwKs6savg8Eg96M556unwV_9fz8y)

#### Update images
1. Design creates branch in [Figma file](https://www.figma.com/file/UOTRHWoB1eNZE0M3P16Su2/%F0%9F%A7%B0-App-Store-Images---Resource---VAMobile%F0%9F%A7%B0?node-id=68%3A62&t=NFKdcdXC3Q52ZkTu-1)
2. Design updates screenshots in “Step 1: Update screenshots” page
3. Design updates images in “Step 2: Update images” page according to image requirements:

<table>
  <tr>
   <td>
<strong>App Store</strong>
   </td>
   <td><strong>Quantity</strong>
   </td>
   <td><strong>Category</strong>
   </td>
   <td><strong>Image Size</strong>
   </td>
   <td><strong>Naming convention</strong>
   </td>
  </tr>
  <tr>
   <td rowspan="4" ><a href="https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications">iOS</a>
   </td>
   <td rowspan="4" >10
   </td>
   <td>iPhone 5.5
   </td>
   <td>1242 x 2208 px
   </td>
   <td>iphone55-screen-1.png
   </td>
  </tr>
  <tr>
   <td>iPhone 6.7
   </td>
   <td>1290 x 2796 px
   </td>
   <td>iphone65-screen-1.png
   </td>
  </tr>
  <tr>
   <td>iPad 12.9
   </td>
   <td>2048 x 2732 px
   </td>
   <td>ipadPro129-screen-1.png
   </td>
  </tr>
  <tr>
   <td>iPad 2nd gen
   </td>
   <td>2048 x 2732 px
   </td>
   <td>ipadPro2ndGen-screen-1.png
   </td>
  </tr>
  <tr>
   <td rowspan="2" ><a href="https://support.google.com/googleplay/android-developer/answer/9866151?hl=en#zippy=%2Cscreenshots">Android</a>
   </td>
   <td>8
   </td>
   <td>Images
   </td>
   <td>320 x 569 px
   </td>
   <td>1_en-US.png
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>Feature graphic
   </td>
   <td>1024 x 500 px
   </td>
   <td>featureGraphic.png
   </td>
  </tr>
</table>

4. Design exports images to [Google Drive](https://drive.google.com/drive/folders/1t_WOjaZkJKNR9oXEMczjtIePAFef2ym6)
    * For all images, make sure “ignore overlapping layers” and “include bounding box” are checked before exporting.
    
    ![Screenshot of Figma export options](/img/app-store/figma-export.png)
    * For iOS, images must not include a transparency/alpha layer. Figma does not have a way to remove this from your PNG export, but the [Export Opaque PNG plugin](https://www.figma.com/community/plugin/1052463252412045420/Export-Opaque-PNG) can be installed. Alternatively, you can [follow these steps](https://stackoverflow.com/questions/26171739/remove-alpha-channel-in-an-image) using the Preview app on a Mac.
	* For Android, images should be exported at 4x and can be up to 8 MB per screen. Feature graphic should be exported at 1x and can be up to 1 MB.
	* Frames in Figma are currently named according to the app store requirements
5. Product reviews images in [Google Drive](https://drive.google.com/drive/folders/1t_WOjaZkJKNR9oXEMczjtIePAFef2ym6)
6. After images are updated in app stores, design merges branch in [Figma file](https://www.figma.com/file/UOTRHWoB1eNZE0M3P16Su2/%F0%9F%A7%B0-App-Store-Images---Resource---VAMobile%F0%9F%A7%B0?node-id=68%3A62&t=NFKdcdXC3Q52ZkTu-1)


### Publish content
All changes should be made to the files in the repo and not directly to the stores. Android files should be in the folders inside the images filter – not in the images directory itself. 
* [iOS](https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/VAMobile/ios/fastlane/screenshots/en-US)
* [Android](https://github.com/department-of-veterans-affairs/va-mobile-app/tree/develop/VAMobile/android/fastlane/metadata/android/en-US/images)


#### VA App Store
1. Product sends updated copy and images to VA App Store team via email.
    * Current contacts:
        * Treva Lutes – [treva.lutes@va.gov](mailto:treva.lutes@va.gov) 
        * Donna Rodriguez – [donna.rodriguez@va.gov](mailto:donna.rodriguez@va.gov) 
        * Gwen McMillian – [gwendolyn.mcmillian@va.gov](mailto:gwendolyn.mcmillian@va.gov)

#### What’s New Content

##### Android (Play Store)
1. Go to GitHub web browser
2. Under the &lt;>Code tab go to develop branch and search for the latest release version release/v1.X.0 (it’s probably at the bottom)
3. Go to VAMobile folder and then select the ‘android’ folder
4. Select the ‘fastlane’ folder
5. Go to metadata/android/en-US folder
6. Go to changelogs folder and then select the default.txt file
7. Select the edit icon to edit the What’s New content
8. Remove the old text and update with the new What’s New Content changes
9. Go down to Commit Changes 
    * Add a brief description highlighting what has been changed (i.e. Update android what’s new content) under Commit Changes title
10. If this is your first change for the release branch continue with step 12- 15
11. If this is not your first change being added to the branch then follow steps 16-17
12. Select option ‘Create a new branch for this commit and start a pull request’  
    * Update branch name ( try to be as descriptive as possible i.e update-store-for-release-1.X.0) 
13. Select Propose Changes and you will be taken to the Pull Request screen
14. Update Title with what change has been made (i.e. Update What’s New Content)
15. Update description to include details of what changes are being made (i.e updating what’s new content)  
16. Select ‘Create pull request’ button, now the pull request is tied to the release branch

##### iOS (App Store)
1. Go to GitHub web browser
2. Under &lt;>Code go to develop branch and search for the branch previously created above in step 12 (Will have the release #)
3. Go to VAMobile folder and then select the ‘ios’ folder
4. Select the ‘fastlane’ folder
5. Select the ‘metadata’ folder
6. Select ‘en-US’ folder and then select the release_notes.txt file
7. Select the edit icon to edit the What’s New content
8. Remove the old and update with the new What’s new content 
9. Go down to Commit Changes and update the title 
    * Add a brief description highlighting what has been changed (i.e. Update ios store what’s new content) 
    * Select Commit change directly to the branch button.  The branch that you previously created in step 12 above should be displayed (update-store-for-release 1.x.0)
10.  Select Commit Changes and the change should be completed

##### Validating your work
1. Go to ‘Pull request’ on top navigation bar
2. You should see the pull request that was created (i.e. Update store content) and select
3. Select &lt;> Commits and a list of the 2 commits made 
4. Select ‘File changed’ on the nav bar to verify the changes.  You will see old text highlighted in red and new changes highlighted in green

#### Feature Description

##### iOS (App Store)
1. Go to GitHub web browser
2. Under &lt;>Code go to develop branch and search for the branch previously created above in step 12
3. Go to VAMobile folder and then select the ‘ios’ folder
4. Select the ‘fastlane’ folder
5. Select the ‘metadata’ folder
6. Select ‘en-US’ folder and then select description.txt
7. Select the edit icon to edit the description.txt
8. Add or modify description text
9. Go down to Commit Changes and update the title 
    * Add a brief description highlighting what has been changed (i.e. Update description text).  You can add additional details in the optional extended description as well) 
    * Select Commit change directly to the branch button.  The branch that you previously created in step 12 above should be displayed (update-store-for-release 1.x.0)
10.  Select Commit Changes and the change should be completed

##### Android (Play Store)
1. Go to GitHub web browser
2. Under &lt;>Code go to develop branch and search for the branch previously created above in step 12
3. Go to VAMobile folder and then select the ‘android’ folder
4. Select the ‘fastlane’ folder
5. Select the ‘metadata/android/en-US’ folder
6. Select ‘full_description.txt ’ 
7. Select the edit icon to edit the description.txt
8. Add or modify description text
9. Go down to Commit Changes and update the title 
    * Add a brief description highlighting what has been changed (i.e. Update description text).  You can add additional details in the optional extended description as well) 
    * Select Commit change directly to the branch button.  The branch that you previously created in step 12 above should be displayed (update-store-for-release 1.x.0)