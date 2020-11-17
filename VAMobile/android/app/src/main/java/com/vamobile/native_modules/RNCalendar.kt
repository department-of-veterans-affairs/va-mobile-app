package com.vamobile.native_modules

import android.Manifest.permission.WRITE_CALENDAR
import android.content.Intent
import android.content.Intent.ACTION_INSERT
import android.content.Intent.FLAG_ACTIVITY_NEW_TASK
import android.content.pm.PackageManager.PERMISSION_GRANTED
import android.os.Bundle
import android.provider.CalendarContract.*
import android.provider.CalendarContract.Events.EVENT_LOCATION
import android.provider.CalendarContract.Events.TITLE
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.Permission

const val INSERT_EVENT_CODE = 1001

class RNCalendar(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RNCalendar"

    @ReactMethod
    fun checkHasCalendarPermission(): Boolean {
        return reactApplicationContext.checkSelfPermission(WRITE_CALENDAR) == PERMISSION_GRANTED
    }

    @ReactMethod
    fun addToCalendar(title: String, beginTime: Int, endTime: Int, location: String) {
        val i = Intent(ACTION_INSERT).apply {
            data = CONTENT_URI
            type = "vnd.android.cursor.item/event"
            putExtra(TITLE, title)
            putExtra(EVENT_LOCATION, location)
            putExtra(EXTRA_EVENT_BEGIN_TIME, beginTime)
            putExtra(EXTRA_EVENT_END_TIME, endTime)
            addFlags(FLAG_ACTIVITY_NEW_TASK)
        }

        reactApplicationContext.startActivityForResult(i, INSERT_EVENT_CODE, Bundle.EMPTY)
    }

}