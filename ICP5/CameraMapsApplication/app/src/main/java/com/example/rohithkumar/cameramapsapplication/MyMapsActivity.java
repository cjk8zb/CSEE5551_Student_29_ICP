package com.example.rohithkumar.cameramapsapplication;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnSuccessListener;

public class MyMapsActivity extends AppCompatActivity {
    private static final int MY_LOCATION_REQUEST_CODE = 101;

    private FusedLocationProviderClient mLocationProviderClient;
    private GoogleMap mMap;
    private LatLng mCurrentLocation;
    private OnSuccessListener<Location> mSuccessListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_maps);
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);

        mapFragment.getMapAsync(googleMap -> {
            mMap = googleMap;
            updateMap();
        });

        mSuccessListener = location -> {
            mCurrentLocation = new LatLng(location.getLatitude(), location.getLongitude());
            updateMap();
        };

        mLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
        getLastLocation(true);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MY_LOCATION_REQUEST_CODE) {
            getLastLocation(false);
        }
    }

    private void getLastLocation(boolean requestPermission) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            mLocationProviderClient.getLastLocation().addOnSuccessListener(this, mSuccessListener);
        } else if (requestPermission) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, MY_LOCATION_REQUEST_CODE);
        }
    }

    private void updateMap() {
        // Add a marker at current location and move the camera
        if (mCurrentLocation != null && mMap != null) {
            MarkerOptions options = new MarkerOptions()
                    .position(mCurrentLocation)
                    .title("You Are Here");
            mMap.addMarker(options);

            CameraPosition position = new CameraPosition.Builder()
                    .target(mCurrentLocation)
                    .zoom(10)
                    .build();
            CameraUpdate update = CameraUpdateFactory.newCameraPosition(position);
            mMap.animateCamera(update);
        }
    }

}
