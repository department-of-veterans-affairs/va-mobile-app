package gov.va.mobileapp.native_modules

import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.lang.Exception
import java.security.SecureRandom

/**
 * React Native NativeModule to expose SecureRandom/Cryptographic functionality to a React Native instance
 */
class RNSecureRandom (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNSecureRandom"

    /**
     * Generates a random array of size equal to count parameter and returns the
     * random array as a base64 string
     * @param count size in bytes of the array to generate
     * @param promise Promise to resolve the base64 string that is generated
     */
    @ReactMethod
    fun generateBase64(count: Int, promise: Promise) {
        try {
            Log.d(name, "count is $count")
            val random = SecureRandom()
            val values = ByteArray(count)
            random.nextBytes(values)
            promise.resolve(Base64.encodeToString(values, 0))
        }catch (e: Exception) {
            promise.reject(e)
        }
    }
}