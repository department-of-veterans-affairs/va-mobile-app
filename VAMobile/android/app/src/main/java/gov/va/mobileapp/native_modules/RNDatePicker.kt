package gov.va.mobileapp.native_modules

import android.Manifest.permission.WRITE_CALENDAR
import android.app.DatePickerDialog
import android.content.Intent
import android.content.Intent.ACTION_INSERT
import android.content.Intent.FLAG_ACTIVITY_NEW_TASK
import android.content.pm.PackageManager.PERMISSION_GRANTED
import android.os.Bundle
import android.provider.CalendarContract.EXTRA_EVENT_BEGIN_TIME
import android.provider.CalendarContract.EXTRA_EVENT_END_TIME
import android.provider.CalendarContract.Events.*
import android.widget.DatePicker
import android.content.Context
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.Calendar

class RNDatePickerManager: SimpleViewManager<DatePicker>() {

  override fun getName() = "RNDatePicker"

  override fun createViewInstance(reactContext: ThemedReactContext): DatePicker {
    return DatePicker(reactContext)
  }

  // @ReactProp(name = "date")
  // fun setDate(view: DatePicker, timestamp: Double?) {
  //   if (timestamp != null) {
  //     val cal = java.util.Calendar.getInstance().apply { timeInMillis = timestamp.toLong() }
  //     view.updateDate(cal.get(java.util.Calendar.YEAR),cal.get(java.util.Calendar.MONTH),cal.get(java.util.Calendar.DAY_OF_MONTH))
  //   }
  // }
  // @ReactMethod
  // fun showDatePicker(promise: Promise) {
  //   val c = java.util.Calendar.getInstance()
  //   val activity = currentActivity
  //   if(activity != null) {
  //   val dpd = DatePickerDialog(
  //     activity,
  //     { _, year, month, day ->
  //       val date = "$year-${month + 1}-$day"
  //       promise.resolve(date)
  //     },
  //     c.get(Calendar.YEAR),
  //     c.get(Calendar.MONTH),
  //     c.get(Calendar.DAY_OF_MONTH)
  //   )
  //   dpd.show()
  //   } else {
  //       promise.reject("NO_ACTIVITY", "No current activity available")
  //   }
  // }
  
}