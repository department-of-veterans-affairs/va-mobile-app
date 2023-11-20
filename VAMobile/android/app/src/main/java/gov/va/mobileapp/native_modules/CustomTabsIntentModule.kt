package gov.va.mobileapp.native_modules

import android.content.Intent
import android.content.Intent.ACTION_VIEW
import android.content.Intent.FLAG_ACTIVITY_NEW_TASK
import android.content.pm.PackageManager
import android.net.Uri
import androidx.browser.customtabs.CustomTabColorSchemeParams
import androidx.browser.customtabs.CustomTabsClient
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
            codeChallenge: String,
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
                                    appendQueryParameter("application", "vamobile")
                                    appendQueryParameter("oauth", "true")
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

            // Get full list of installed packages that handle https URLs
            // https://developer.chrome.com/docs/android/custom-tabs/howto-custom-tab-check/
            val intent = Intent(ACTION_VIEW, Uri.parse("https://www.example.com"))
            val intentHandlers = context.packageManager.queryIntentActivities(intent, PackageManager.MATCH_ALL)
            val intentHandlerPackages = intentHandlers.map {
                it.activityInfo.packageName
            }.toTypedArray().asList()

            // From the above list, find a package that supports Custom Tabs. If no installed
            // packages support Custom Tabs, packageName will be set to null here
            val packageName = CustomTabsClient.getPackageName(context, intentHandlerPackages)

            // If packageName is present, that package supports Custom Tabs, so use it
            // TODO: Inform user when no installed packages support Custom Tabs
            if (!packageName.isNullOrEmpty()) {
                customTabsIntent.intent.setPackage(packageName)

                // Firefox needs a new task for login to succeed
                if (packageName.contains("firefox")) {
                    customTabsIntent.intent.addFlags(FLAG_ACTIVITY_NEW_TASK)
                }
            }

            context.currentActivity?.apply { customTabsIntent.launchUrl(this, authURI) }
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject("Custom Tabs Error", e)
        }
    }

    override fun getName() = "CustomTabsIntentModule"
}
