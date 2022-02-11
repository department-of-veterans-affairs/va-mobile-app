package gov.va.mobileapp.native_modules

import android.provider.Settings
import android.provider.Settings.Global.DEVICE_NAME
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import gov.va.mobileapp.BuildConfig

/**
 * React Native NativeModule to expose system level information from the Android device
 */
class DeviceData(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "DeviceData"

    /**
     * Exposes the device name from the global settings.
     * @returns the user-assigned name of the device.
     *
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDeviceName(): String {
        return Settings.Global.getString(reactApplicationContext.contentResolver, DEVICE_NAME)
    }

    /**
     * Exposes the app version name.
     * @returns version name of the app (1.1.1).
     *
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getVersionName(): String {
        return BuildConfig.VERSION_NAME
    }

    /**
     * Exposes the app version name.
     * @returns version name of the app (ie).
     *
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getBuildNumber(): Int {
        return BuildConfig.VERSION_CODE
    }


}
