package gov.va.mobileapp.native_modules

import android.app.Activity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.InstallStatus

/*
Potential changes could be to check for the downloading status in the listener while the update is going
This would give people the ability to see the download progress
We could also change it so that when the download is done that we prompt them to update instead of automatically doing it for them
The other thing we could do is in the requestStorePopup method we could update it to include staleness and immediate updates for when we want to force an update on people or give them the flexibility to update after so many number of days with staleness
 */
class RNInAppUpdate(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNInAppUpdate"
    private val appUpdateManager = AppUpdateManagerFactory.create(reactContext)

    private val listener = InstallStateUpdatedListener { state ->
        if (state.installStatus() == InstallStatus.DOWNLOADED) {
            appUpdateManager.completeUpdate()
        }
    }

    @ReactMethod
    fun requestStoreVersion(promise: Promise) {
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            promise.resolve(appUpdateInfo.availableVersionCode())
        }.addOnFailureListener { err: Exception ->
            promise.resolve("checkAppUpdate failure: $err")
        }
    }

    @ReactMethod
    fun requestStorePopup(promise: Promise) {
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                appUpdateManager.registerListener(listener)
                val options = AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
                currentActivity?.apply {
                    val startUpdateFlow = appUpdateManager.startUpdateFlow(
                        appUpdateInfo,
                        this,
                        options
                    )

                    startUpdateFlow.addOnSuccessListener { result ->
                        if (result.equals(Activity.RESULT_CANCELED)) { //Canceled
                            promise.resolve(false)
                        }else{ //Success
                            promise.resolve(true)
                        }
                    }.addOnFailureListener { failure ->
                        promise.reject(
                            "reject",
                            "startUpdateFlow failure$failure"
                        )
                    }
                } ?: promise.resolve(false)
            }
        }.addOnFailureListener { err: Exception ->
            promise.resolve("checkAppUpdate failure: $err")
        }
    }
}