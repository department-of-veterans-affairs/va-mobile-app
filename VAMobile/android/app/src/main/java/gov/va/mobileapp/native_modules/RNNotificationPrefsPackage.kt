package us.adhocteam.alpha.vamobile.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import us.adhocteam.alpha.vamobile.native_modules.RNNotificationPrefs

class RNNotificationPrefsPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) = arrayListOf(RNNotificationPrefs(reactContext))
    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*, *>>()
}