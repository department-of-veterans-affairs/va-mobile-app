package gov.va.mobileapp.native_modules

import android.content.Context
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import android.view.ViewGroup.LayoutParams
import androidx.compose.material3.DatePicker
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.*

class DatePickerViewManager : SimpleViewManager<ComposeView>() {
    override fun getName() = "MaterialDatePicker"

    @OptIn(ExperimentalMaterial3Api::class)
    override fun createViewInstance(reactContext: ThemedReactContext): ComposeView {
        return ComposeView(reactContext).apply {
            // Make sure it respects the parent size
            layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)

            setContent {
                val state = rememberDatePickerState()
                DatePicker(state = state)
            }
        }
    }
}
