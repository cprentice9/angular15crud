import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  public genders: string[] = ["Male", "Female"];
  public importantList: string[] = [
    "Fat reduction",
    "Energy and endurance",
    "Building lean muscle",
    "Better digestion",
    "Sugar reduction",
    "Fitness"
  ];

  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService){

  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      beenToGym: [''],
      enquiryDate: [''],
  });

  this.registerForm.controls['height'].valueChanges.subscribe(res => {
    this.calculateBmi(res);
  })
}
submit(){
  this.api.postRegistration(this.registerForm.value)
  .subscribe(res => {
    this.toastService.success({detail: 'Success', summary: 'Registration Successful', duration: 3000});
    this.registerForm.reset();
  });
}

calculateBmi(heightValue: number){
  const weight = this.registerForm.value.weight;
  const height = heightValue;
  const bmi = weight / (height * height);
  this.registerForm.controls['bmi'].patchValue(bmi);
  switch (true) {
    case bmi < 18.5:
      this.registerForm.controls['bmiResult'].patchValue("Underweight");
      break;
    case (bmi >= 18.5 && bmi < 25):
      this.registerForm.controls['bmiResult'].patchValue("Normal Weight");
      break;
    case (bmi >= 25 && bmi < 30):
      this.registerForm.controls['bmiResult'].patchValue("Overweight");
      break;

      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");
        break;
}
}
}
