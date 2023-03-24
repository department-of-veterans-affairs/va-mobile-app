package gov.va.mobileapp.native_modules

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.graphics.Color
import android.app.Activity
import android.view.Window
import android.view.WindowManager
import androidx.core.view.WindowCompat
import com.facebook.react.bridge.*
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.facebook.react.uimanager.IllegalViewOperationException

private const val ERROR_NO_ACTIVITY = "E_NO_ACTIVITY"
private const val ERROR_NO_ACTIVITY_MESSAGE = "Tried to change the navigation bar while not attached to an Activity"

class RNNativeUIUtilities(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNNativeUIUtilities"

    private fun setNavigationBarTheme(activity: Activity?, light: Boolean) {
        if (activity != null) {
            val window: Window = activity.window
            WindowCompat.getInsetsController(window, window.decorView)?.apply {
                isAppearanceLightStatusBars = light
            }
        }
    }

    @ReactMethod
    fun changeNavigationBarColor(color: String, light: Boolean, animated: Boolean, promise: Promise) {
        val map: WritableMap = Arguments.createMap()
        if (currentActivity != null) {
            try {
                val window: Window = currentActivity!!.window
                runOnUiThread(Runnable {
                    if (color == "transparent" || color == "translucent") {
                        window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
                        if (color == "transparent") {
                            window.setFlags(
                                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                            )
                        } else {
                            window.setFlags(
                                WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
                                WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
                            )
                        }
                        setNavigationBarTheme(currentActivity, light)
                        map.putBoolean("success", true)
                        promise.resolve(map)
                        return@Runnable
                    } else {
                        window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
                        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
                    }
                    if (animated) {
                        val colorFrom: Int = window.getNavigationBarColor()
                        val colorTo: Int = Color.parseColor(color)
                        //window.setNavigationBarColor(colorTo);
                        val colorAnimation =
                            ValueAnimator.ofObject(ArgbEvaluator(), colorFrom, colorTo)
                        colorAnimation.addUpdateListener { animator ->
                            window.setNavigationBarColor(
                                animator.animatedValue as Int
                            )
                        }
                        colorAnimation.start()
                    } else {
                        window.setNavigationBarColor(Color.parseColor(color))
                    }
                    setNavigationBarTheme(currentActivity, light)
                    val map: WritableMap = Arguments.createMap()
                    map.putBoolean("success", true)
                    promise.resolve(map)
                })
            } catch (e: IllegalViewOperationException) {
                map.putBoolean("success", false)
                promise.reject("error", e)
            }
        } else {
            promise.reject(ERROR_NO_ACTIVITY, Throwable(ERROR_NO_ACTIVITY_MESSAGE))
        }
    }
}
