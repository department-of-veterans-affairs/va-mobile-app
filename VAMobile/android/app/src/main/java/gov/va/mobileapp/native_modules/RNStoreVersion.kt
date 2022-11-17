package gov.va.mobileapp.native_modules

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability


class RNStoreVersion(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNStoreVersion"
    val appUpdateManager = AppUpdateManagerFactory.create(reactContext)

    @ReactMethod
    fun requestStoreVersion(promise: Promise) {
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            promise.resolve(appUpdateInfo.availableVersionCode())
        }
        appUpdateManager.appUpdateInfo.addOnFailureListener { err: Exception ->
            promise.resolve("checkAppUpdate failure: " + err.toString())
        }
    }

    @ReactMethod
    fun requestStorePopup(promise: Promise) {
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                val options = AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
                val activity = currentActivity
                val startUpdateFlow = appUpdateManager.startUpdateFlow(
                    appUpdateInfo,
                    activity!!, options
                )

                startUpdateFlow.addOnFailureListener { failure ->
                    promise.reject(
                        "reject",
                        "startUpdateFlow failure" + failure.toString()
                    )
                }

                startUpdateFlow.addOnSuccessListener { result ->
                    if (result === 0) { //Canceled
                        promise.resolve(false)
                    }else{ //Success
                        promise.resolve(true)
                    }
                }
            }
        }
        appUpdateManager.appUpdateInfo.addOnFailureListener { err: Exception ->
            promise.resolve("checkAppUpdate failure: " + err.toString())
        }
    }
}