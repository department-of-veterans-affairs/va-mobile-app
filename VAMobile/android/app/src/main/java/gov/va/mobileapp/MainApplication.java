package gov.va.mobileapp;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.webkit.WebView;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.INotificationsApplication;
import com.wix.reactnativenotifications.core.notification.IPushNotification;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import gov.va.mobileapp.native_modules.CustomTabsIntentManager;
import gov.va.mobileapp.native_modules.DeviceDataPackage;
import gov.va.mobileapp.native_modules.RNCalendarPackage;
import gov.va.mobileapp.native_modules.RNCheckVoiceOverPackage;
import gov.va.mobileapp.native_modules.RNNotificationPrefsPackage;
import gov.va.mobileapp.native_modules.RNReviewPackage;
import gov.va.mobileapp.native_modules.RNSecureRandomPackage;
import gov.va.mobileapp.native_modules.RNInAppUpdatePackage;
import gov.va.mobileapp.native_modules.RNNativeUIUtilitiesPackage;
import gov.va.mobileapp.notifications.VAPushNotifications;
import com.facebook.react.bridge.JSIModulePackage;
import com.airbnb.android.react.lottie.LottiePackage;

public class MainApplication extends Application implements ReactApplication, INotificationsApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for
            // example:
            // Add the DeviceData bridge
            packages.add(new DeviceDataPackage());
            packages.add(new RNCalendarPackage());
            packages.add(new RNCheckVoiceOverPackage());
            packages.add(new RNNotificationPrefsPackage());
            packages.add(new RNSecureRandomPackage());
            packages.add(new RNReviewPackage());
            packages.add(new RNInAppUpdatePackage());
            packages.add(new RNNativeUIUtilitiesPackage());
            packages.add(new LottiePackage());
            packages.add(new CustomTabsIntentManager());

            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method
     * with something like initializeFlipper(this,
     * getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
                /*
                 * We use reflection here to pick up the class that initializes Flipper, since
                 * Flipper library is not available in release mode
                 */
                Class<?> aClass = Class.forName("com.vamobile.ReactNativeFlipper");
                aClass.getMethod("initializeFlipper", Context.class, ReactInstanceManager.class).invoke(null, context,
                        reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Sets the overridden notifications class for the react-native-notifications lib
     *
     */

    @Override
    public IPushNotification getPushNotification(Context context, Bundle bundle, AppLifecycleFacade facade, AppLaunchHelper defaultAppLaunchHelper) {
        return new VAPushNotifications(context, bundle, facade, defaultAppLaunchHelper, new JsIOHelper());
    }
}
