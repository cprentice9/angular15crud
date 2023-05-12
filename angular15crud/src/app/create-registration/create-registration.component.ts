import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

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
  public userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private api: ApiService, private router: Router, private toastService: NgToastService){

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
  });

  this.activatedRoute.params.subscribe(val => {
    this.userIdToUpdate = val['id'];
    this.api.getRegisteredUserId(this.userIdToUpdate)
    .subscribe(res => {
      this.isUpdateActive = true;
      this.fillFormToUpdate(res);
    })
  })
}
submit(){
  this.api.postRegistration(this.registerForm.value)
  .subscribe(res => {
    this.toastService.success({detail: 'Success', summary: 'Enquiry Successful', duration: 3000});
    this.registerForm.reset();
  });
}
update(){
  this.api.updateRegisteredUser(this.registerForm.value, this.userIdToUpdate)
  .subscribe(res => {
    this.toastService.success({detail: 'Updated', summary: 'Enquiry Updated', duration: 3000});
    this.registerForm.reset();
    this.router.navigate(['list']);
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

fillFormToUpdate(user: User) {
  this.registerForm.setValue({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    weight: user.weight,
    height: user.height,
    bmi: user.bmi,
    bmiResult: user.bmiResult,
    gender: user.gender,
    requireTrainer: user.requireTrainer,
    package: user.package,
    important: user.important,
    beenToGym: user.beenToGym,
    enquiryDate: user.enquiryDate
  })
}}
