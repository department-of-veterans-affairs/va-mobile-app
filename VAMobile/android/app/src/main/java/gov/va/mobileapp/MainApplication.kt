package gov.va.mobileapp


import android.app.Application
import android.content.Context
import android.os.Bundle
import android.webkit.WebView
import com.airbnb.android.react.lottie.LottiePackage
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.wix.reactnativenotifications.core.AppLaunchHelper
import com.wix.reactnativenotifications.core.AppLifecycleFacade
import com.wix.reactnativenotifications.core.JsIOHelper
import com.wix.reactnativenotifications.core.notification.INotificationsApplication
import com.wix.reactnativenotifications.core.notification.IPushNotification
import gov.va.mobileapp.native_modules.CustomTabsIntentManager
import gov.va.mobileapp.native_modules.DeviceDataPackage
import gov.va.mobileapp.native_modules.RNCalendarPackage
import gov.va.mobileapp.native_modules.RNCheckVoiceOverPackage
import gov.va.mobileapp.native_modules.RNInAppUpdatePackage
import gov.va.mobileapp.native_modules.RNNativeUIUtilitiesPackage
import gov.va.mobileapp.native_modules.RNNotificationPrefsPackage
import gov.va.mobileapp.native_modules.RNReviewPackage
import gov.va.mobileapp.native_modules.RNSecureRandomPackage
import gov.va.mobileapp.notifications.VAPushNotifications

class MainApplication : Application(), ReactApplication, INotificationsApplication {
    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    add(DeviceDataPackage())
                    add(RNCalendarPackage())
                    add(RNCheckVoiceOverPackage())
                    add(RNNotificationPrefsPackage())
                    add(RNSecureRandomPackage())
                    add(RNReviewPackage())
                    add(RNInAppUpdatePackage())
                    add(RNNativeUIUtilitiesPackage())
                    add(LottiePackage())
                    add(CustomTabsIntentManager())
                }
            override fun getJSMainModuleName(): String = "index"
            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }
    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)
    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, OpenSourceMergedSoMapping)
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }
    }

    override fun getPushNotification(context: Context, bundle: Bundle, facade: AppLifecycleFacade, defaultAppLaunchHelper: AppLaunchHelper): IPushNotification {
        return VAPushNotifications(context, bundle, facade, defaultAppLaunchHelper, JsIOHelper())
    }
}

