package us.adhocteam.alpha.vamobile.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import us.adhocteam.alpha.vamobile.native_modules.RNCalendar

/**
 * ReactPackage to export the RNCalendar class to our react-native instance.
 */
class RNCalendarPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) = arrayListOf(RNCalendar(reactContext))
    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*, *>>()
}