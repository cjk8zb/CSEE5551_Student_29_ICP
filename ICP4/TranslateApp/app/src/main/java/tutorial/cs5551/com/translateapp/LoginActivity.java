package tutorial.cs5551.com.translateapp;

import android.app.ActivityOptions;
import android.content.Intent;
import android.os.Bundle;
import com.google.android.material.appbar.AppBarLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

//AppCompatActivity:
public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
    }

    public void checkCredentials(@SuppressWarnings("unused") View v) {
        hideKeyboard(v);
        EditText usernameCtrl = findViewById(R.id.txt_username);
        EditText passwordCtrl = findViewById(R.id.txt_Pwd);
        TextView errorText = findViewById(R.id.lbl_Error);
        String userName = usernameCtrl.getText().toString();
        String password = passwordCtrl.getText().toString();

        boolean validationFlag = false;
        //Verify if the username and password are not empty.
        if (!userName.isEmpty() && !password.isEmpty()) {
            if (userName.equals("foo") && password.equals("bar")) {
                validationFlag = true;
            }
        }
        if (!validationFlag) {
            errorText.setVisibility(View.VISIBLE);
        } else {
            //This code redirects the from login page to the home page.
            AppBarLayout appBar = findViewById(R.id.appBar);
            Intent intent = new Intent(LoginActivity.this, TranslateActivity.class);
            ActivityOptions options = ActivityOptions
                    .makeSceneTransitionAnimation(LoginActivity.this, appBar, "appBar");

            startActivity(intent, options.toBundle());
        }

    }

    private void hideKeyboard(View view) {
        InputMethodManager inputMethodManager = (InputMethodManager) getSystemService(AppCompatActivity.INPUT_METHOD_SERVICE);
        if (inputMethodManager != null) {
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

}
