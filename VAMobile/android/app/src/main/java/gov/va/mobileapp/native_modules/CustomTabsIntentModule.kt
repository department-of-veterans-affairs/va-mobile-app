package gov.va.mobileapp.native_modules

import android.content.Intent
import android.content.Intent.*
import android.content.pm.PackageManager
import android.net.Uri
import androidx.browser.customtabs.CustomTabColorSchemeParams
import androidx.browser.customtabs.CustomTabsIntent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import gov.va.mobileapp.R

class CustomTabsIntentModule(private val context: ReactApplicationContext) :
        ReactContextBaseJavaModule(context) {

    @ReactMethod
    fun beginAuthSession(
            authEndPoint: String,
            clientId: String,
            redirectUrl: String,
            authScopes: String,
            codeChallenge: String,
            state: String,
            SISEnabled: Boolean,
            promise: Promise
    ) {
        try {
            val authURI =
                    Uri.parse(authEndPoint)
                            .buildUpon()
                            .also {
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
                                    }
                                }
                            }
                            .build()

            val defaultScheme =
                    CustomTabColorSchemeParams.Builder()
                            .also {
                                it.setToolbarColor(
                                        context.resources.getColor(
                                                R.color.grayLightest,
                                                context.theme
                                        )
                                )
                            }
                            .build()

            val darkScheme =
                    CustomTabColorSchemeParams.Builder()
                            .also {
                                it.setToolbarColor(
                                        context.resources.getColor(
                                                R.color.darkmodeGrayDark,
                                                context.theme
                                        )
                                )
                            }
                            .build()

            val customTabsIntent =
                    CustomTabsIntent.Builder()
                            .apply {
                                setDefaultColorSchemeParams(defaultScheme)
                                setColorSchemeParams(CustomTabsIntent.COLOR_SCHEME_DARK, darkScheme)
                                setShareState(CustomTabsIntent.SHARE_STATE_OFF)
                                setShowTitle(true)
                            }
                            .build()

            // Check default browser to prevent Firefox login issue (Android only)
            val browserIntent = Intent("android.intent.action.VIEW", Uri.parse("https://"));
            val resolveInfo = context.packageManager.resolveActivity(browserIntent, PackageManager.MATCH_DEFAULT_ONLY);
            val packageName = resolveInfo?.activityInfo?.packageName;
            if (packageName != null && packageName.contains("firefox")) {
                // Default browser is Firefox. Need flag for login to succeed
                customTabsIntent.intent.addFlags(FLAG_ACTIVITY_NEW_TASK)
            }

            context.currentActivity?.apply { customTabsIntent.launchUrl(this, authURI) }
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("Custom Tabs Error", e)
        }
    }

    override fun getName() = "CustomTabsIntentModule"
}
