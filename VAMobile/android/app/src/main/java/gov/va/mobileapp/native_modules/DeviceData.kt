package gov.va.mobileapp.native_modules

import android.provider.Settings
import android.provider.Settings.Global.DEVICE_NAME
import com.facebook.react.bridge.Promise
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
    @ReactMethod
    fun getDeviceName(promise:Promise) {
        val deviceName =  Settings.Global.getString(reactApplicationContext.contentResolver, DEVICE_NAME)
        promise.resolve(deviceName)
    }

    /**
     * Exposes the app version name.
     * @returns version name of the app (1.1.1).
     *
     */
    @ReactMethod
    fun getVersionName(promise:Promise) {
        val versionName = BuildConfig.VERSION_NAME
         promise.resolve(versionName)
    }

    /**
     * Exposes the app build number.
     * @returns build number of the app (0).
     *
     */
    @ReactMethod
    fun getBuildNumber(promise:Promise) {
        val buildNumber =  BuildConfig.VERSION_CODE
        promise.resolve(buildNumber)
    }


}
