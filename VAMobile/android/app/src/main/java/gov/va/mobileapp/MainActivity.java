package gov.va.mobileapp;

import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "VAMobile";
  }

  // react-native-screens package requires one additional configuration step to
  // properly work on Android devices. Edit MainActivity.java file which is
  // located in android/app/src/main/java/<your package name>/MainActivity.jav
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
