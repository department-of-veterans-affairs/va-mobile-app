package gov.va.mobileapp.native_modules

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log

class InstallReferrer(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InstallReferrer"
    }

    @ReactMethod
    fun getReferrerInfo(promise: Promise) {
        val installReferrer = getInstallReferrer()
        promise.resolve(installReferrer)
    }

    private fun getInstallReferrer(): String {
        val context: Context = reactApplicationContext.applicationContext
        val installReferrerClient = InstallReferrerClient.newBuilder(context).build()
        installReferrerClient.startConnection(object : InstallReferrerStateListener {
            override fun onInstallReferrerSetupFinished(responseCode: Int) {
                when (responseCode) {
                    InstallReferrerResponse.OK -> {
                        // Connection established.
                        val response: ReferrerDetails = installReferrerClient.installReferrer
                        val referrerUrl: String = response.installReferrer
                        val clickTimestamp: Long = response.referrerClickTimestampSeconds
                                                
                        Log.d("ReferrerInfo", "Referrer URL: $referrerUrl, Click Timestamp: $clickTimestamp")
                        return referrerUrl
                    }
                    InstallReferrerResponse.FEATURE_NOT_SUPPORTED -> {
                        // API not available on the current Play Store app.
                        Log.e("ReferrerInfo", "InstallReferrer API is not available on this Play Store app.")
                    }
                    InstallReferrerResponse.SERVICE_UNAVAILABLE -> {
                        // Play Store service is not available now.
                        Log.e("ReferrerInfo", "Play Store service is not available.")
                    }
                }
            }

            override fun onInstallReferrerServiceDisconnected() {
                // Try to restart the connection on the next request to
                // Google Play by calling the startConnection() method.
                Log.d("ReferrerInfo", "InstallReferrerService disconnected.")
            }
        })
    }
}
