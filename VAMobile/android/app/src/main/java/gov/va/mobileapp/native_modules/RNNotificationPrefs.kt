package gov.va.mobileapp.native_modules

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class RNNotificationPrefs(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNNotificationPrefs"

    /**
     * This method fetches the current system notification settings for the app
     * @return true if notifications are on, false if they are not
     */
    @ReactMethod
    fun notificationsOn(promise: Promise) {
        val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        promise.resolve(notificationManager.areNotificationsEnabled())
    }

}
