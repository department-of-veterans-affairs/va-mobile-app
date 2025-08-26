package gov.va.mobileapp.native_modules

import android.widget.DatePicker
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import java.text.SimpleDateFormat
import java.util.*

class DatePickerViewManager : SimpleViewManager<DatePicker>() {
    override fun getName() = "RNDatePicker"

    override fun createViewInstance(reactContext: ThemedReactContext): DatePicker {
        val datePicker = DatePicker(reactContext)
        val calendar = Calendar.getInstance()
        datePicker.init(
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH),
        ) { _, year, month, day ->
            // You could send events to JS here if needed
        }
        return datePicker
    }

    @ReactProp(name = "date")
    fun setDate(view: DatePicker, dateString: String?) {
        if (dateString == null) return

        try {
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
            val date = sdf.parse(dateString)
            val calendar = Calendar.getInstance()
            calendar.time = date!!

            view.updateDate(
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}