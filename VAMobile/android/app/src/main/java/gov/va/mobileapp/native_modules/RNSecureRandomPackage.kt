package gov.va.mobileapp.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class RNSecureRandomPackage: ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) = arrayListOf(RNSecureRandom(reactContext))
    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*, *>>()
}