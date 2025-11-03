# App Icon

App icons represent your app in places such as the App Store, the Home Screen, Settings, and search results.

## iOS Configuration

To display your app icon correctly across iOS devices, you must provide the required icon assets and configure them in your Xcode project. iOS uses different icon sizes for various contexts, such as the Home Screen, Spotlight search, Settings, and notifications.

### Context
In Xcode, under `VAMobile`, navigate to the `General` tab to view the app icons configured for each environment.
Within the `App Icons and Launch Screen` section, we can see that the following icon sets are currently in use: `AppIcon`, `AppIcon-QA`, and `AppIcon-RC`.

![App Icon List](/img/appIconImages/iconEnvList.png)


### Updating App Icons
1. To update app icons, open up XCode and navigate to the `VAMobile/Images` directory.
   ![App Icon Sizes](/img/appIconImages/appIconAllSizes.png)
2. Currently, `Any Appearance` and `Dark Mode` are supported. If modifications are needed, all the size variations of the updated icon would need to be met. To update or replace an icon, drag a `png` to the desired location in this layout.

### Testing
1. To begin testing changes, rebuild the application on Xcode.
2. Navigate outside the app to the home page of the simulator. 
3. Long press the screen until an `Edit` option appears on the top left of the screen.
  
![iOS Home Screen](/img/appIconImages/iosHomeScreen.png)

4. Click on `Customize`. Here you are able to see the different themes. 
5. Select among the different themes to view the results.

   | Light | Dark                                                                     |
   | --- |--------------------------------------------------------------------------|
   |![iOS Home Screen Customize](/img/appIconImages/iosHomeScreenCustom2.png)| ![iOS Home Screen Customize](/img/appIconImages/iosHomeScreenCustom.png) |
   

