package gov.va.mobileapp.native_modules

import android.view.ViewGroup.LayoutParams
import androidx.compose.ui.platform.ComposeView
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.DatePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SelectableDates
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.snapshotFlow
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.common.MapBuilder
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.collectLatest


/// A React Native module that wraps a Jetpack Compose `DatePicker`
/// This allows React Native to interact with the native Android date picker
class RNDatePickerViewManager : SimpleViewManager<ComposeView>() {
    override fun getName() = "RNDatePicker"

    /// Flows to hold the latest date, minimum date, and maximum date values
    private val dateFlow = MutableStateFlow<Long?>(null)
    private val minimumDateFlow = MutableStateFlow<Long?>(null)
    private val maximumDateFlow = MutableStateFlow<Long?>(null)

    /// Sets the currently selected date from React Native
    /// - `date` is expected to be a string in "YYYY-MM-DD" format
    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "date")
    fun setDate(view: ComposeView, date: String?) {
        dateFlow.value = parseDate(date)
    }

    /// Sets the minimum selectable date from React Native
    /// - `minimumDate` is expected to be a string in "YYYY-MM-DD" format
    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "minimumDate")
    fun setMinimumDate(view: ComposeView, minimumDate: String?) {
        minimumDateFlow.value = parseDate(minimumDate)
    }

    /// Sets the maximum selectable date from React Native
    /// - `maximumDate` is expected to be a string in "YYYY-MM-DD" format
    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "maximumDate")
    fun setMaximumDate(view: ComposeView, maximumDate: String?) {
        maximumDateFlow.value = parseDate(maximumDate)
    }

    /// Exports the `onDateChange` event to React Native
    /// Maps the DateChangeEvent.EVENT_NAME to the onDateChange prop, which
    /// React Native will call when the event is fired.
    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> = mutableMapOf(
        DateChangeEvent.EVENT_NAME to MapBuilder.of("registrationName", "onDateChange")
    )

    /// Creates and returns a `ComposeView` instance that contains the `DatePicker`
    @OptIn(ExperimentalMaterial3Api::class)
    override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
        return ComposeView(reactContext).apply {
            // Make sure it respects the parent size
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)

            setContent {
                // 1. Observe Observe date, minimumDate, and maximumDate updates from React Native
                val date by dateFlow.collectAsState()
                val minimumDate by minimumDateFlow.collectAsState()
                val maximumDate by maximumDateFlow.collectAsState()

                // 2. Hook into Compose’s DatePicker state
                val datePickerState = rememberDatePickerState(
                    initialSelectedDateMillis = date,
                    selectableDates = object : SelectableDates {
                        override fun isSelectableDate(utcTimeMillis: Long): Boolean {
                            return (minimumDate == null || utcTimeMillis >= minimumDate!!)
                                    && (maximumDate == null || utcTimeMillis <= maximumDate!!)
                        }

                        override fun isSelectableYear(year: Int): Boolean {
                            return (minimumDate == null ||  year >= getYearFromMillis(minimumDate!!))
                                    && (maximumDate == null || year <= getYearFromMillis(maximumDate!!))
                        }
                    }
                )

                // 3. Observe the datePickerState and send the selected date back to React Native whenever it changes
                LaunchedEffect(datePickerState) {
                    snapshotFlow { datePickerState.selectedDateMillis } //
                        .collectLatest { selectedDate ->
                            selectedDate?.let { sendDateChangeEvent(reactContext, id, it) }
                        }
                }

                // Apply the appropriate color scheme based on the system theme
                val colorScheme = if (isSystemInDarkTheme()) darkColorScheme() else lightColorScheme()

                // Render the `DatePicker` with the selected theme
                MaterialTheme(
                    colorScheme = colorScheme,
                    typography = Typography()
                ) {
                    DatePicker(state = datePickerState)
                }
            }
        }
    }

    /// Sends a DateChangeEvent with the selected date represented as a string in ISO format.
    private fun sendDateChangeEvent(context: ThemedReactContext, viewId: Int, millis: Long) {
        val isoDate = getDateFromMillis(millis).toString()
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, viewId)
        eventDispatcher?.dispatchEvent(DateChangeEvent(viewId, isoDate))
    }

    /// Parses a date string in "YYYY-MM-DD" format into milliseconds since epoch
    private fun parseDate(dateString: String?): Long? {
        val dateInMillis = dateString?.let {
            try {
                LocalDate.parse(it) // parse "YYYY-MM-DD"
                    .atStartOfDay(ZoneOffset.UTC)
                    .toInstant()
                    .toEpochMilli()
            } catch (e: Exception) {
                null
            }
        }
       return dateInMillis
    }

    private fun getDateFromMillis(dateInMillis: Long): LocalDate =
        Instant.ofEpochMilli(dateInMillis).atZone(ZoneOffset.UTC).toLocalDate()

    private fun getYearFromMillis(dateInMillis: Long): Int =
        getDateFromMillis(dateInMillis).year

}

/// Represents the date change event sent to React Native
class DateChangeEvent(viewId: Int, private val date: String) :
    Event<DateChangeEvent>(viewId) {
    override fun getEventName() = EVENT_NAME

    /// Returns the event data containing the newly selected date as a `WritableMap`
    override fun getEventData(): WritableMap {
        return Arguments.createMap().apply {
            putString("date", date)
        }
    }

    companion object {
        const val EVENT_NAME = "onDateChange"
    }
}