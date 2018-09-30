package com.example.rohithkumar.cameramapsapplication;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.appcompat.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

public class CameraActivity extends AppCompatActivity {

    private ImageView mImageView;
    private Button mCaptureButton;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera);
        mImageView = findViewById(R.id.view_photo);
        mCaptureButton = findViewById(R.id.btn_take_photo);

        //Button click event listener. Initializes the camera.
        Toast.makeText(this, "In camera activity", Toast.LENGTH_SHORT).show();
        setupCaptureButton(true);
    }

    private void setupCaptureButton(boolean shouldRequest) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            mCaptureButton.setEnabled(false);
            if (shouldRequest) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, RequestCode.CAMERA_PERMISSION);
            }
        } else {
            mCaptureButton.setEnabled(true);
        }
    }

    public void callCamera(@SuppressWarnings("unused") View v) {
        //Toast.makeText(getApplicationContext(),"on take photo click",Toast.LENGTH_SHORT).show();
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (cameraIntent.resolveActivity(getPackageManager()) != null) {
            startActivityForResult(cameraIntent, RequestCode.IMAGE_CAPTURE);
        }
    }

    //If the photo is captured then set the image view to the photo captured.
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Bundle extras = data.getExtras();
        if (requestCode == RequestCode.IMAGE_CAPTURE && resultCode == RESULT_OK && extras != null) {
            Bitmap photo = (Bitmap) extras.get("data");
            mImageView.setImageBitmap(photo);
            Log.d("CameraDemo", "Pic saved");
        }
    }

    @Override
    public void onRequestPermissionsResult(final int requestCode, @NonNull final String[] permissions, @NonNull final int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == RequestCode.CAMERA_PERMISSION) {
            setupCaptureButton(false);
        }
    }

    public void redirectToHome(@SuppressWarnings("unused") View v) {
        Intent redirect = new Intent(CameraActivity.this, MainActivity.class);
        startActivity(redirect);
    }

    static class RequestCode {
        private static final int CAMERA_PERMISSION = 100;
        private static final int IMAGE_CAPTURE = 0;
    }
}
