package gov.va.mobileapp.native_modules
import android.graphics.Color
import android.os.Build.VERSION.SDK_INT
import android.os.Build.VERSION_CODES.*
import android.view.View
import android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
import android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
import android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
import com.facebook.react.bridge.*
class RNNavBarColor(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNNavBarColor"
    @ReactMethod
    fun changeNavigationBarColor(color: String, promise: Promise) {
        println("-----IN THE KT CODE")
        currentActivity?.window?.apply {
            try {
                UiThreadUtil.runOnUiThread {
                    clearFlags(FLAG_LAYOUT_NO_LIMITS)
                    clearFlags(FLAG_TRANSLUCENT_NAVIGATION)
                    navigationBarColor = Color.parseColor(color)
                    when {
                        SDK_INT == O -> {
                            currentActivity?.also {
                                findViewById<View>(android.R.id.content)?.systemUiVisibility = SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                            }
                        }
                        SDK_INT >= P -> {
                            decorView.systemUiVisibility = decorView.systemUiVisibility or SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                        }
                        else -> {
                            promise.reject("RNNavBarColor Set Color Error", Throwable("Invalid Android Version"))
                        }
                    }
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