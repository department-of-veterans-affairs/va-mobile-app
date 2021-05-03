package gov.va.vamobileapp.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * ReactPackage to export the DeviceData class to our react-native instance.
 */
class DeviceDataPackage: ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) = arrayListOf(DeviceData(reactContext))
    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*,*>>()

}