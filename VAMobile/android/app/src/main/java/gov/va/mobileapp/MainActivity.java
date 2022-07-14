package gov.va.mobileapp;

import android.content.res.Configuration;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.os.Bundle;

import org.jetbrains.annotations.NotNull;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "VAMobile";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      return reactRootView;
    }
//    @Override
//    protected boolean isConcurrentRootEnabled() {
//      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
//      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
//      return false;
//    }
  }

  @Override
  public void onConfigurationChanged(@NotNull Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    getReactInstanceManager().onConfigurationChanged(this, newConfig);
  }

  // react-native-screens package requires one additional configuration step to
  // properly work on Android devices. Edit MainActivity.java file which is
  // located in android/app/src/main/java/<your package name>/MainActivity.jav
  // This change is required to avoid crashes related to View state being not
  // persisted consistently across Activity restarts.
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
