import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterForm = new FormGroup({
    minimumLatitude: new FormControl('38.6702494923', [Validators.required, Validators.min(-90), Validators.max(90)]),
    minimumLongitude: new FormControl('-95.063983202', [Validators.required, Validators.min(-180), Validators.max(180)]),
    maximumLatitude: new FormControl('39.5525174538', [Validators.required, Validators.min(-90), Validators.max(90)]),
    maximumLongitude: new FormControl('-94.1960632801', [Validators.required, Validators.min(-180), Validators.max(180)]),
  });

  submitted = false;
  success = false;

  airplanes;

  constructor(private api: ApiService) {
  }

  get minimumLatitude() {
    return this.filterForm.get('minimumLatitude');
  }

  get minimumLongitude() {
    return this.filterForm.get('minimumLongitude');
  }

  get maximumLatitude() {
    return this.filterForm.get('maximumLatitude');
  }

  get maximumLongitude() {
    return this.filterForm.get('maximumLongitude');
  }

  onSubmit() {
    this.submitted = true;

    if (this.filterForm.invalid) {
      return;
    }

    this.success = true;
  }

  ngOnInit() {
  }

  getAirplanes() {
    const minimum = {longitude: this.minimumLongitude.value, latitude: this.minimumLatitude.value};
    const maximum = {longitude: this.maximumLongitude.value, latitude: this.maximumLatitude.value};
    this.api.getAirplanes(minimum, maximum).subscribe(airplanes => {
      this.airplanes = airplanes;
      console.log(this.airplanes);
    });
  }

  getAirplane(index: number) {
    const current = this.airplanes[index];
    this.api.getAirplane(current.identifier).subscribe(([airplane]) => {
      console.log(airplane);
      this.airplanes[index] = airplane;
    });
  }

}
