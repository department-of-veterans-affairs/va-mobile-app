package gov.va.mobileapp.native_modules

import android.app.DatePickerDialog
import android.widget.DatePicker
import com.facebook.react.bridge.*

import java.util.*

class RNDatePicker(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), DatePickerDialog.OnDateSetListener {

  private var promise: Promise? = null

  override fun getName(): String = "DatePickerModule"

  @ReactMethod
  fun show(promise: Promise) {
    val activity = currentActivity ?: run {
      promise.reject("NO_ACTIVITY", "No activity attached")
      return
    }

    this.promise = promise
    val c = Calendar.getInstance()
    val year = c.get(Calendar.YEAR)
    val month = c.get(Calendar.MONTH)
    val day = c.get(Calendar.DAY_OF_MONTH)

    val dialog = DatePickerDialog(activity, this, year, month, day)
    dialog.show()
  }

  override fun onDateSet(view: DatePicker, year: Int, month: Int, day: Int) {
    promise?.resolve(mapOf("year" to year, "month" to month, "day" to day))
  }
}