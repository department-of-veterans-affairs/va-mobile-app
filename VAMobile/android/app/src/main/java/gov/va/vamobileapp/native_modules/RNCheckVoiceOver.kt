package gov.va.vamobileapp.native_modules

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

    /**
     * This method resolves true if VoiceOver/TalkBack is currently on, otherwise it resolves to false
     *
     * @return promise with boolean result indicating if VoiceOver/TalkBack is on
     */
    @ReactMethod
    fun isVoiceOverRunning(promise: Promise) {
        try {
            val accessibilityManager = reactContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            if (!accessibilityManager.isEnabled || !accessibilityManager.isTouchExplorationEnabled) {
                promise.resolve(false)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("IS_VOICE_OVER_RUNNING_ERROR", e)
        }
    }
}
