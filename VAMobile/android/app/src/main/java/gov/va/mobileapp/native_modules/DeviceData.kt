package gov.va.mobileapp.native_modules

import android.provider.Settings
import android.provider.Settings.Global.DEVICE_NAME
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

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

}
