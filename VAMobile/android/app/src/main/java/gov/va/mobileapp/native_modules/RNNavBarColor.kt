package gov.va.mobileapp.native_modules

import android.graphics.Color
import android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
import android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
import com.facebook.react.bridge.*
import java.lang.Exception

class RNNavBarColor(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNNavBarColor"

    @ReactMethod
    fun changeNavigationBarColor(color: String, promise: Promise) {
        currentActivity?.window?.apply {
            try {
                UiThreadUtil.runOnUiThread {
                    clearFlags(FLAG_LAYOUT_NO_LIMITS)
                    clearFlags(FLAG_TRANSLUCENT_NAVIGATION)
                    navigationBarColor = Color.parseColor(color)
                    promise.resolve(true)
                }
            } catch (e: Exception) {
                promise.reject("RNNavBarColor Set Color Error", e)
            }
        } ?: promise.reject(
            "RNNavBarColor No Activity Error",
            Throwable("No Activity attached while attempting to update Navigation Bar color")
        )
    }
}