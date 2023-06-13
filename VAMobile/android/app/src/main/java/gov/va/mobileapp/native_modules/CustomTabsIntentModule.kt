package gov.va.mobileapp.native_modules
import android.content.Intent.*
import android.net.Uri
import android.util.Log
import androidx.browser.customtabs.CustomTabColorSchemeParams
import androidx.browser.customtabs.CustomTabsIntent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import gov.va.mobileapp.R


class CustomTabsIntentModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    @ReactMethod
    fun openGoogle(authEndPoint: String, clientId: String, redirectUrl: String, authScopes: String, codeChallenge: String, state: String, SISEnabled: Boolean) {
        val googleURI = Uri.parse(authEndPoint).buildUpon().also {
            with(it) {
                appendQueryParameter("code_challenge_method", "S256")
                appendQueryParameter("code_challenge", codeChallenge)

                if (SISEnabled) {
                  appendQueryParameter("application", "vamobile")
                  appendQueryParameter("oauth", "true")
                } else {
                  appendQueryParameter("client_id", clientId)
                  appendQueryParameter("redirect_uri", redirectUrl)
                  appendQueryParameter("scope", authScopes)
                  appendQueryParameter("response_type", "code")
                  appendQueryParameter("response_mode", "query")
                  appendQueryParameter("state", state)
                  // appendQueryParameter("login", "prompt")
                  // appendQueryParameter("forceAuthn", "true")
                }
            }
        }.build()
        Log.d(name, googleURI.toString())
        val colorScheme = CustomTabColorSchemeParams.Builder().also {
            it.setNavigationBarColor(context.resources.getColor(R.color.primaryDarker, context.theme))
        }.build()
        val customTabsIntent = CustomTabsIntent.Builder().apply {
            setDefaultColorSchemeParams(colorScheme)

        }.build().also {
            it.intent.addFlags(FLAG_ACTIVITY_NEW_TASK)
            it.intent.addFlags(FLAG_ACTIVITY_NO_HISTORY)
        }
        Log.d(name, "launching intent")
        context.currentActivity?.apply { customTabsIntent.launchUrl(this, googleURI)}
    }

    override fun getName() =  "CustomTabsIntentModule"
}
