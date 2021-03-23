package us.adhocteam.alpha.vamobile.native_modules

import android.content.Context
import android.view.accessibility.AccessibilityManager
import com.facebook.react.bridge.*

/**
 * React Native NativeModule to expose whether VoiceOver/TalkBack is running to a React Native instance
 */
class RNCheckVoiceOver(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RNCheckVoiceOver"
    }

    @ReactMethod
    fun isVoiceOverRunning(promise: Promise) {
        try {
            val accessibilityManager = reactContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            if (accessibilityManager == null || !accessibilityManager.isEnabled || !accessibilityManager.isTouchExplorationEnabled) {
                promise.resolve(false)
                return
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("IS_VOICE_OVER_RUNNING_ERROR", e)
        }
    }
}
