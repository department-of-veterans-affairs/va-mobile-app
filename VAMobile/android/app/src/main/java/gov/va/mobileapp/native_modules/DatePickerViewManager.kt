package gov.va.mobileapp.native_modules

import android.content.Context
import android.util.Log
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import android.view.ViewGroup.LayoutParams
import androidx.compose.material3.DatePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.StateFlow
import java.time.Instant
import com.facebook.react.uimanager.events.Event
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.common.MapBuilder

class DatePickerViewManager : SimpleViewManager<ComposeView>() {
    override fun getName() = "RNDatePicker"

    // Flow that always holds the latest date from JS
    private val dateFlow = MutableStateFlow<Long?>(null)

    @OptIn(ExperimentalMaterial3Api::class)
    override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
        Log.i("Look here", "hiiiiiiiiiiiii")
        return ComposeView(reactContext).apply {
            // Make sure it respects the parent size
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)

            setContent {
                val date by dateFlow.collectAsState() // observe JS updates

                val datePickerState = rememberDatePickerState(
                    initialSelectedDateMillis = date
                )

                // 3. Whenever user changes date, send event back to JS
                LaunchedEffect(datePickerState) {
                    snapshotFlow { datePickerState.selectedDateMillis }
                        .collectLatest { selectedDate ->
                            selectedDate?.let { sendDateChangeEvent(reactContext, id, it) }
                        }
                }

                DatePicker(state = datePickerState)
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @ReactProp(name = "date")
    fun setDate(view: ComposeView, date: String?) {
        Log.i("RNDatePicker", "Default is $date")
        val dateInMillis = date?.let {
            try {
                Instant.parse(it).toEpochMilli()
            } catch (e: Exception) {
                null
            }
        }
        dateFlow.value = dateInMillis
    }

    private fun sendDateChangeEvent(context: ThemedReactContext, viewId: Int, millis: Long) {
        Log.d("RNDatePicker", "User picked $millis")
        val isoDate = java.time.Instant.ofEpochMilli(millis).toString()
        val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, viewId)

        Log.d("test", eventDispatcher.toString())

        eventDispatcher?.dispatchEvent(DateChangeEvent(viewId, isoDate))
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> = mutableMapOf(
        DateChangeEvent.EVENT_NAME to MapBuilder.of("registrationName", "onDateChange")
    )


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