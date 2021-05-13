package gov.va.mobileapp.native_modules

import android.Manifest.permission.WRITE_CALENDAR
import android.content.Intent
import android.content.Intent.ACTION_INSERT
import android.content.Intent.FLAG_ACTIVITY_NEW_TASK
import android.content.pm.PackageManager.PERMISSION_GRANTED
import android.os.Bundle
import android.provider.CalendarContract.EXTRA_EVENT_BEGIN_TIME
import android.provider.CalendarContract.EXTRA_EVENT_END_TIME
import android.provider.CalendarContract.Events.*
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

const val INSERT_EVENT_CODE = 1001

/**
 * React Native NativeModule to expose Calendar functionality to a React Native instance
 */
class RNCalendar(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNCalendar"

    /**
     * This method is used to check to see if the user has granted the WRITE_CALENDAR permission to the app
     *
     * @return true if the app has write permissions and false if it has not asked or if the user has
     * permanently denied the app.
     */
    @ReactMethod
    fun checkHasCalendarPermission(): Boolean {
        return reactApplicationContext.checkSelfPermission(WRITE_CALENDAR) == PERMISSION_GRANTED
    }

    /**
     * This method receives a title, start, end, and location for an event to send to the calendar
     *
     * @param title The title to display for the new event.
     * @param beginTime number of seconds UTC since 1970 when the event will start
     * @param endTime number of seconds UTC since 1970 when the event will end.
     * @param location The address or name of place where the event will be taking place
     */
    @ReactMethod
    fun addToCalendar(title: String, beginTime: Int, endTime: Int, location: String) {
        Log.d("RNCal", "${beginTime * 1000}, $endTime")
        val i = Intent(ACTION_INSERT).apply {
            data = CONTENT_URI
            type = "vnd.android.cursor.item/event"
            putExtra(TITLE, title)
            putExtra(EVENT_LOCATION, location)
            putExtra(EXTRA_EVENT_BEGIN_TIME, beginTime.toLong() * 1000L)
            putExtra(EXTRA_EVENT_END_TIME, endTime .toLong() * 1000L)
            addFlags(FLAG_ACTIVITY_NEW_TASK)
        }

        reactApplicationContext.startActivityForResult(i, INSERT_EVENT_CODE, Bundle.EMPTY)
    }

}