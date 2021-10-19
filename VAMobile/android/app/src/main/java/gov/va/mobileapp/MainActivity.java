package gov.va.mobileapp;

import android.content.res.Configuration;

import com.facebook.react.ReactActivity;
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
