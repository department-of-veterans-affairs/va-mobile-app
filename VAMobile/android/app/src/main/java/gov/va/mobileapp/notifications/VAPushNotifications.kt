package gov.va.mobileapp.notifications

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.graphics.BitmapFactory
import android.os.Build
import android.os.Bundle
import androidx.core.app.NotificationCompat
import com.wix.reactnativenotifications.Defs.NOTIFICATION_RECEIVED_BACKGROUND_EVENT_NAME
import com.wix.reactnativenotifications.Defs.NOTIFICATION_RECEIVED_EVENT_NAME
import com.wix.reactnativenotifications.core.AppLaunchHelper
import com.wix.reactnativenotifications.core.AppLifecycleFacade
import com.wix.reactnativenotifications.core.JsIOHelper
import com.wix.reactnativenotifications.core.notification.PushNotification
import com.wix.reactnativenotifications.core.notification.PushNotificationProps
import gov.va.mobileapp.R


class VAPushNotifications(
    context: Context?, bundle: Bundle?,
    appLifecycleFacade: AppLifecycleFacade?, appLaunchHelper: AppLaunchHelper?,
    JsIOHelper: JsIOHelper?
) : PushNotification(context, bundle, appLifecycleFacade, appLaunchHelper, JsIOHelper) {
    private val defaultChannelId = "general"
    private val defaultChannelName = "General"

    init {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val defaultChannel = NotificationChannel(
                defaultChannelId,
                defaultChannelName,
                NotificationManager.IMPORTANCE_HIGH
            )
            val notificationManager =
                context!!.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(defaultChannel)
        }
        mNotificationProps
    }

    override fun onReceived() {
        postNotification(0)
        val eventName = if (mAppLifecycleFacade.isAppVisible) NOTIFICATION_RECEIVED_EVENT_NAME
        else NOTIFICATION_RECEIVED_BACKGROUND_EVENT_NAME
        mJsIOHelper.sendEventToJS(
            eventName,
            mNotificationProps.asBundle().also { it.putInt("importance", 5) },
            mAppLifecycleFacade.runningReactContext
        )
    }

    private fun getCompatNotifcationBuilder(intent: PendingIntent?): NotificationCompat.Builder {
        return NotificationCompat.Builder(mContext, defaultChannelId).also {
            it.priority = NotificationCompat.PRIORITY_HIGH
            it.setContentIntent(intent)
            it.setContentTitle(mNotificationProps.title)
            it.setContentText(mNotificationProps.body)
            it.setSmallIcon(R.drawable.ic_va_logo)
            it.setLargeIcon(BitmapFactory.decodeResource(mContext.resources, R.drawable.notification_icon))
        }
    }

    override fun buildNotification(intent: PendingIntent?): Notification {
        return getCompatNotifcationBuilder(intent).build()
    }

    override fun getNotificationBuilder(intent: PendingIntent?): Notification.Builder {
        return super.getNotificationBuilder(intent).also {
            it.setChannelId(defaultChannelId)
            it.setSmallIcon(R.drawable.notification_icon)
        }
    }
}