package com.example.rohithkumar.cameramapsapplication;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    public void onPhotoClick(@SuppressWarnings("unused") View v) {
        //This code redirects the from main page to the maps page.
        Intent redirect = new Intent(MainActivity.this, CameraActivity.class);
        startActivity(redirect);
    }

    public void onLocationClick(@SuppressWarnings("unused") View v) {
        //This code redirects to the photo activity.
        Intent redirect = new Intent(MainActivity.this, MyMapsActivity.class);
        startActivity(redirect);
    }
}
