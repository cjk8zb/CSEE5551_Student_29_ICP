package tutorial.cs5551.com.translateapp;

import android.app.ActivityOptions;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.AppBarLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class TranslateActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {

    @SuppressWarnings("SpellCheckingInspection")
    private final String[] languageNames = {"Ukrainian", "Norwegian", "Belarusian", "Tamil", "Finnish", "Bulgarian", "Gujarati", "Malagasy", "Indonesian", "Kyrgyz", "Russian", "Punjabi", "Xhosa", "Czech", "Telugu", "Maori", "Tajik", "Macedonian", "Urdu", "Latin", "Thai", "Malayalam", "Luxembourgish", "Bengali", "Mongolian", "Welsh", "French", "Hill Mari", "Javanese", "Tagalog", "Afrikaans", "Marathi", "Danish", "Bosnian", "Greek", "Hebrew", "Malay", "Polish", "Uzbek", "Maltese", "English", "Turkish", "Esperanto", "Georgian", "German", "Icelandic", "Papiamento", "Hindi", "Sinhalese", "Amharic", "Italian", "Tatar", "Burmese", "Irish", "Lao", "Mari", "Spanish", "Slovak", "Slovenian", "Chinese", "Estonian", "Portuguese", "Basque", "Arabic", "Scottish Gaelic", "Catalan", "Vietnamese", "Lithuanian", "Albanian", "Croatian", "Kazakh", "Japanese", "Latvian", "Serbian", "Nepali", "Haitian", "Khmer", "Hungarian", "Kannada", "Sundanese", "Persian", "Korean", "Swedish", "Azerbaijani", "Galician", "Swahili", "Yiddish", "Cebuano", "Bashkir", "Armenian", "Romanian", "Dutch", "Udmurt"};
    @SuppressWarnings("SpellCheckingInspection")
    private final String[] languageCodes = {"uk", "no", "be", "ta", "fi", "bg", "gu", "mg", "id", "ky", "ru", "pa", "xh", "cs", "te", "mi", "tg", "mk", "ur", "la", "th", "ml", "lb", "bn", "mn", "cy", "fr", "mrj", "jv", "tl", "af", "mr", "da", "bs", "el", "he", "ms", "pl", "uz", "mt", "en", "tr", "eo", "ka", "de", "is", "pap", "hi", "si", "am", "it", "tt", "my", "ga", "lo", "mhr", "es", "sk", "sl", "zh", "et", "pt", "eu", "ar", "gd", "ca", "vi", "lt", "sq", "hr", "kk", "ja", "lv", "sr", "ne", "ht", "km", "hu", "kn", "su", "fa", "ko", "sv", "az", "gl", "sw", "yi", "ceb", "ba", "hy", "ro", "nl", "udm"};

    private Integer spinnerPosition;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_translate);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(this, R.layout.support_simple_spinner_dropdown_item, languageNames);

        Spinner languageSpinner = findViewById(R.id.spn_Language);
        languageSpinner.setOnItemSelectedListener(this);
        languageSpinner.setAdapter(arrayAdapter);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_translate, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_logout) {
            AppBarLayout appBar = findViewById(R.id.appBar);
            Intent intent = new Intent(TranslateActivity.this, LoginActivity.class);
            ActivityOptions options = ActivityOptions.makeSceneTransitionAnimation(TranslateActivity.this, appBar, "appBar");

            startActivity(intent, options.toBundle());

            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void translateText(@SuppressWarnings("unused") View v) {
        hideKeyboard(v);

        final EditText sourceTextView = findViewById(R.id.txt_Email);
        final TextView outputTextView = findViewById(R.id.txt_Result);


        @SuppressWarnings("SpellCheckingInspection")
        String key = "trnsl.1.1.20151023T145251Z.bf1ca7097253ff7e.c0b0a88bea31ba51f72504cc0cc42cf891ed90d2";
        String text = sourceTextView.getText().toString();
        String lang = "en-" + languageCodes[spinnerPosition];

        @SuppressWarnings("SpellCheckingInspection")
        String getURL = new Uri.Builder()
                .scheme("https")
                .path("translate.yandex.net")
                .appendPath("api")
                .appendPath("v1.5")
                .appendPath("tr.json")
                .appendPath("translate")
                .appendQueryParameter("key", key)
                .appendQueryParameter("text", text)
                .appendQueryParameter("lang", lang)
                .appendQueryParameter("format", "plain")
                .appendQueryParameter("options", "1").toString();

        OkHttpClient client = new OkHttpClient();
        try {
            Request request = new Request.Builder().url(getURL).build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    Log.e("okHttp", "Request Failure", e);
                    System.out.println(e.getMessage());
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    final JSONObject jsonResult;
                    final String result = response.body().string();
                    try {
                        jsonResult = new JSONObject(result);
                        JSONArray convertedTextArray = jsonResult.getJSONArray("text");
                        final String convertedText = convertedTextArray.get(0).toString();
                        Log.d("okHttp", jsonResult.toString());
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                outputTextView.setText(convertedText);
                            }
                        });
                    } catch (JSONException e) {
                        Log.e("okHttp", "Response Error", e);
                        e.printStackTrace();
                    }
                }
            });


        } catch (Exception ex) {
            outputTextView.setText(ex.getMessage());

        }

    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        spinnerPosition = position;
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }

    public void hideKeyboard(View view) {
        InputMethodManager inputMethodManager = (InputMethodManager) getSystemService(AppCompatActivity.INPUT_METHOD_SERVICE);
        if (inputMethodManager != null) {
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

}
