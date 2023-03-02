package {ANDROID_APP_IDENTIFIER};

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Added by jared @see https://github.com/crazycodeboy/react-native-splash-screen
 */
import org.devio.rn.splashscreen.SplashScreen;

public class SplashActivity extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {

    /**
     * Added by jared @see https://github.com/crazycodeboy/react-native-splash-screen
     */
    SplashScreen.show(this);

    super.onCreate(savedInstanceState);

    Intent intent = new Intent(this, MainActivity.class);
    startActivity(intent);
    finish();
  }
}
