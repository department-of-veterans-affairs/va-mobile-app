package gov.va.mobileapp.native_modules

import androidx.compose.ui.platform.ComposeView
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import android.view.ViewGroup.LayoutParams
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.DatePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SelectableDates
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.collectLatest
import java.time.Instant
import com.facebook.react.uimanager.events.Event
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.common.MapBuilder
import java.time.LocalDate
import java.time.ZoneOffset

class DatePickerViewManager : SimpleViewManager<ComposeView>() {
    override fun getName() = "RNDatePicker"

    // Flow that always holds the latest date from JS
    private val dateFlow = MutableStateFlow<Long?>(null)
    private val minimumDateFlow = MutableStateFlow<Long?>(null)
    private val maximumDateFlow = MutableStateFlow<Long?>(null)

    @OptIn(ExperimentalMaterial3Api::class)
    override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
        return ComposeView(reactContext).apply {
            // Make sure it respects the parent size
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)

            setContent {
                // 1. Observe date prop updates
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

                        fun getYear(dateInMillis: Long): Int =
                            getDateFromMillis(dateInMillis).year

                        override fun isSelectableYear(year: Int): Boolean {
                            return (minimumDate == null ||  year >= getYear(minimumDate!!))
                                    && (maximumDate == null || year <= getYear(maximumDate!!))
                        }
                    }
                )

                // 3. Whenever user changes date, send event back to JS
                LaunchedEffect(datePickerState) {
                    snapshotFlow { datePickerState.selectedDateMillis }
                        .collectLatest { selectedDate ->
                            selectedDate?.let { sendDateChangeEvent(reactContext, id, it) }
                        }
                }

                val colorScheme = if (isSystemInDarkTheme()) darkColorScheme() else lightColorScheme()

                MaterialTheme(
                    colorScheme = colorScheme,
                    typography = Typography()
                ) {
                    DatePicker(state = datePickerState)
                }
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "date")
    fun setDate(view: ComposeView, date: String?) {
        dateFlow.value = parseDate(date)
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "minimumDate")
    fun setMinimumDate(view: ComposeView, minimumDate: String?) {
        minimumDateFlow.value = parseDate(minimumDate)
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "maximumDate")
    fun setMaximumDate(view: ComposeView, maximumDate: String?) {
        maximumDateFlow.value = parseDate(maximumDate)
    }

    private fun sendDateChangeEvent(context: ThemedReactContext, viewId: Int, millis: Long) {
        val isoDate = getDateFromMillis(millis).toString()
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, viewId)
        eventDispatcher?.dispatchEvent(DateChangeEvent(viewId, isoDate))
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> = mutableMapOf(
        DateChangeEvent.EVENT_NAME to MapBuilder.of("registrationName", "onDateChange")
    )

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

}

class DateChangeEvent(viewId: Int, private val date: String) :
    Event<DateChangeEvent>(viewId) {

    override fun getEventName() = EVENT_NAME

    override fun getEventData(): WritableMap {
        return Arguments.createMap().apply {
            putString("date", date)
        }
    }

    companion object {
        const val EVENT_NAME = "onDateChange"
    }
}