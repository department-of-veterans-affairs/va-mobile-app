package gov.va.mobileapp.native_modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManagerFactory



class RNStoreVersion(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNStoreVersion"


    @ReactMethod
    fun requestStoreVersion(promise: Promise) {
        val appUpdateManager = AppUpdateManagerFactory.create(reactContext)
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            promise.resolve(appUpdateInfo.availableVersionCode())
        }
        appUpdateManager.appUpdateInfo.addOnFailureListener { err: Exception ->
            promise.resolve("checkAppUpdate failure: " + err.toString())
        }
    }

}