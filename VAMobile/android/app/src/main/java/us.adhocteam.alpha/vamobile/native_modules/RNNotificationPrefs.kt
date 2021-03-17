package us.adhocteam.alpha.vamobile.native_modules

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.text.TextUtils
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class RNNotificationPrefs(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNNotifcationPrefs"

    /**
     * This method fetches the current system notification settings for the app
     * @return true if notifications are on, false if they are not
     */
    @ReactMethod
    fun notificationsOn(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!TextUtils.isEmpty("General")) {
                val manager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                val channel = manager.getNotificationChannel("General")
                return channel.importance != NotificationManager.IMPORTANCE_NONE
            }
            false
        } else {
            NotificationManagerCompat.from(reactApplicationContext).areNotificationsEnabled()
        }
    }

    @ReactMethod
    fun getChannels(): List<NotificationChannel> {
        val manager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        return manager.notificationChannels
    }
}