package gov.va.mobileapp.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.*


class CustomTabsIntentManager : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
    override fun createNativeModules(reactContext: ReactApplicationContext) = arrayListOf(CustomTabsIntentModule(reactContext))
}
