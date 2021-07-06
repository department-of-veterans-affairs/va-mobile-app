package gov.va.mobileapp.native_modules

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * ReactPackage to export the RNCheckVoiceOver class to our React-Native instance.
 */
class RNCheckVoiceOverPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) = arrayListOf(RNCheckVoiceOver(reactContext))
    override fun createViewManagers(reactContext: ReactApplicationContext) = listOf<ViewManager<*, *>>()
}
