import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent {

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  empId: string = '';
  fullName:string = '';
  gender: string = 'male';
  dateOfBirth: string = '';
  email: string = '';
  phoneNumber: string = '';
  salary!: number;
  designation: string = '';
  department: string = '';
  bankAccountNumber: string = '';
  dateOfJoining: string = '';
  dateOfLeaving: string = '';
  isPasswordVisible: boolean = false;
  currentDate = new Date().toISOString();


  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar){}
  
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidNumber(num: string): boolean {
    const numRegex = /^\d{10}$/;
    return numRegex.test(num);
  }

  isValidAccountNumber(num: string): boolean {
    const numRegex = /^\d{11}$/;
    return numRegex.test(num);
  }

  notContainWhiteSpace(str: string): boolean{
    const resultString = str.replace(/\s/g, '');
    return resultString === ''
  }

  register() {

    // Validate password and confirm password
    if (this.password !== this.confirmPassword) {
      this.snackbar.open('Passwords do not match. Please enter the same password in both fields.','Close');
      return;
    }

    if(this.empId === '' || this.notContainWhiteSpace(this.empId)){
      this.snackbar.open('Please enter Employee Id'),'Close';
    }

    if (this.email === '' || this.isValidEmail(this.email)===false) {
      this.snackbar.open('Invalid email address.','Close');
      return;
    }

    if(this.fullName === '' || this.notContainWhiteSpace(this.fullName)){
      this.snackbar.open('Please enter your name'),'Close';
    }

    if(this.dateOfBirth === '' || this.notContainWhiteSpace(this.dateOfBirth)){
      this.snackbar.open('Please enter correct D.O.B.'),'Close';
    }

    if(this.designation === '' || this.notContainWhiteSpace(this.designation)){
      this.snackbar.open('Please enter your designation'),'Close';
    }

    if(this.department === '' || this.notContainWhiteSpace(this.department)){
      this.snackbar.open('Please enter your department'),'Close';
    }

    if(this.isValidAccountNumber(this.bankAccountNumber)){
      this.snackbar.open('Invalid bank account number'),'Close';
    }

    if (this.phoneNumber === '' || this.isValidNumber(this.phoneNumber)===false) {
      this.snackbar.open('Invalid number.','Close');
      return;
    }

    if (this.salary < 5000 || this.salary === 0){
      this.snackbar.open('Enter salary more than 5000.','Close');
      return;
    }


    if (this.dateOfJoining < this.dateOfLeaving){
      this.snackbar.open('Invalid date of joining','Close');
      return;
    }

    

    console.log(this.dateOfBirth);
    const currentDate = new Date();
    const selectedDate = new Date(this.dateOfBirth);
    const selectedDate1 = new Date(this.dateOfJoining);
    const selectedDate2 = new Date(this.dateOfLeaving);

    if(selectedDate1 > currentDate){
      this.snackbar.open("Invalid date of joining",'Close');
      return;
    }

    if(selectedDate2 > currentDate){
      this.snackbar.open("Invalid date of leaving",'Close');
      return;
    }

    if(selectedDate1 > selectedDate2){
      this.snackbar.open("Invalid date of joining",'Close');
      return;
    }

    if(selectedDate > currentDate){
      this.snackbar.open('Invalid date of birth.','Close');
      return;
    }

    this.authService.register(this.username, this.password, this.empId, this.fullName, this.gender, this.dateOfBirth, this.email, this.phoneNumber, this.salary, this.designation, this.department, this.bankAccountNumber, this.dateOfJoining, this.dateOfLeaving)
      .subscribe((response: any) => {
        if (response.success) {
          console.log("Register page Token", response.token);
          this.authService.saveToken(response.token);
          this.snackbar.open("Successfully registered!!",'Close');

          this.router.navigate(['/protected-page']);

        } else {
          this.snackbar.open('Already in database. Please choose a different username.', 'Close');
        }
      }, (error) => {
        this.snackbar.open(error.error.message,'Close');
      });
  }



  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
