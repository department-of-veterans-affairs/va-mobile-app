package gov.va.mobileapp.native_modules

import android.animation.ArgbEvaluator
import android.animation.ValueAnimator
import android.graphics.Color
import android.app.Activity
import android.view.Window
import androidx.core.view.WindowCompat
import com.facebook.react.bridge.*
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.facebook.react.uimanager.IllegalViewOperationException

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
        if (currentActivity != null) {
            try {
                val window: Window = currentActivity!!.window
                runOnUiThread {
                    if (animated) {
                        val colorFrom: Int = window.getNavigationBarColor()
                        val colorTo: Int = Color.parseColor(color)
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
                    promise.resolve(true)
                }
            } catch (e: IllegalViewOperationException) {
                promise.resolve(false)
            }
        } else {
            promise.resolve(false)
        }
    }
}
