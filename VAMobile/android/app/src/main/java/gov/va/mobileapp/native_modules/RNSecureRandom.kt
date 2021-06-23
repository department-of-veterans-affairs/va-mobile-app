package gov.va.mobileapp.native_modules

import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.lang.Exception
import java.security.MessageDigest
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
            promise.resolve(Base64.encodeToString(values, Base64.DEFAULT))
        }catch (e: Exception) {
            promise.reject(e)
        }
    }

    /**
     * Takes a string, hashes it with SHA256 and returns a base64 string of that hash
     * random array as a base64 string
     * @param string string to hash to SHA256
     * @param promise Promise to resolve the base64 string that is generated
     */
    @ReactMethod
    fun generateSHA256String(string: String, promise: Promise) {
        try{
            MessageDigest.getInstance("SHA-256").apply {
                update(string.toByteArray())
                promise.resolve(Base64.encodeToString(digest(), Base64.DEFAULT))
            }
        } catch (e: Exception) {
            promise.reject(e)
        }
    }
}