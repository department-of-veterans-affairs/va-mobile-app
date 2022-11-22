package gov.va.mobileapp.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class RNInAppUpdatePackage: ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext)= arrayListOf(RNInAppUpdate(reactContext))
    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*, *>>()
}
