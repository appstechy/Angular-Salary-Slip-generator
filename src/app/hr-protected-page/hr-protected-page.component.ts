import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-hr-protected-page',
  templateUrl: './hr-protected-page.component.html',
  styleUrls: ['./hr-protected-page.component.css']
})


export class HrProtectedPageComponent implements OnInit {
  fullName2 = '';
  username2 = '';
  fullName = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  empId: string = '';
  designation: string = '';
  department: string = '';
  bankAccountNumber: string = ''; 
  gender: string = 'male';
  dateOfBirth: string = '';
  email: string = '';
  phoneNumber: string = '';
  salary!: number;
  dateOfJoining: string = '';
  dateOfLeaving: string = '';
  employeeId: string = '';
  payPeriod: string = '';
  paidDays: number | undefined;
  lossOfPaidDays: number | undefined;
  basic: number | undefined;
  da: number | undefined;
  hra: number | undefined;
  ca: number | undefined;
  medical: number | undefined;
  special: number | undefined;
  tax: number | undefined;
  tds: number | undefined;
  epf: number | undefined;

  currentMonth: string = '';
  currentYear!: number;
  currentDateAndTime = new Date();
  currentDate1 = new Date();
  myCurrentYear = this.currentDate1.getFullYear();
  myCurrentMonth = this.currentDate1.getMonth();


  isPasswordVisibleforRegisterPassword: boolean = false;
  isPasswordVisibleforRegisterConfirmPassword: boolean = false;
  isPasswordVisibleforUpdatePassword: boolean = false;
  isPasswordVisibleforUpdateConfirmPassword: boolean = false;
  isOptedForUpdateDetails:boolean = false;
  isOptedForAddNewEmployee:boolean = false;
  isOptedForGeneratePayslip:boolean = false;
  isOptedForDeleteEmployee:boolean = false;
  toggleForSalaryShow: boolean = false;

  buttonValue:string = "Yes"
  
  result:any = "";
  finalDob: string = ""
  hiddenTemplate: boolean = false;
  currentDate = new Date().toISOString();
  hiddenButtonValue: string = "Show";

  // variable for register
  myusername: string = '';
  mypassword: string = '';
  myconfirmPassword: string = '';
  myempId: string = '';
  myfullName = '';
  mydesignation: string = '';
  mydepartment: string = '';
  mybankAccountNumber: string = ''; 
  mygender: string = 'male';
  mydateOfBirth: string = '';
  myemail: string = '';
  myphoneNumber: string = '';
  mysalary!: number;
  mydateOfJoining: string = '';
  mydateOfLeaving: string = '';


  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService, private snackbar:MatSnackBar, private router: Router, private fb: FormBuilder, private datePipe: DatePipe){
    const currentDate = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.currentMonth = monthNames[currentDate.getMonth()];
    this.currentYear = currentDate.getFullYear();
  }


  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });

    this.lossOfPaidDays = undefined;
    this.basic = undefined;
    this.da = undefined;
    this.hra = undefined;
    this.ca = undefined;
    this.special = undefined;
    this.medical =undefined;
    this.tax = undefined;
    this.tds = undefined;
    this.epf = undefined;
    this.hiddenTemplate = !this.hiddenTemplate;
    this.toggleForSalaryShow = !this.toggleForSalaryShow;



  }

  
  ngOnInit(): void {


    const currentDate = Date();
    this.payPeriod = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;
    console.log(this.payPeriod);

    let apiUrl = 'http://localhost:3000/api';



    this.authService.fetchFullNameOfAdmin().subscribe((response:any) => {
      if(response.success){
        console.log("Admin fullname and username-",response)
        this.fullName2 = response.full_name;
        this.username2 = response.username;
      } else{

        this.snackbar.open(response.message,'Close');
      }
    }, (error) => {
      this.snackbar.open(error.error.message,'Close');
    })
      
  }

  response:any = this.authService.fetchAllEmployeesDetails().subscribe((response:any) =>{
    if(response.success){

      console.log(response);
      this.result = response.data;
      const dateObject = new Date(response.data[0].dateOfBirth);
      this.finalDob = formatDate(dateObject, 'yyyy-MM-dd', 'en')

    }
  }, (err) =>{
    console.log(err);
  });




  toggleOptedForUpdateDetails(username: string):any{
    if(this.isOptedForUpdateDetails==false){

      this.isOptedForUpdateDetails = !this.isOptedForUpdateDetails
      return this.authService.fetchAllDetailsOfEmployee(username).subscribe((response:any) =>{
        if(response.success){
          // console.log("Before assigning data-",response.data[0]);
          // console.log(response.data[0].bankAccountNumber);
          this.fullName = response.data[0].full_name;
          this.username = response.data[0].username;
          this.password = response.data[0].password;
          this.empId = response.data[0].emp_id;
          this.designation = response.data[0].designation;
          this.department = response.data[0].department;
          this.bankAccountNumber = response.data[0].bank_account_number;
          this.confirmPassword = response.data[0].password;
          this.gender = response.data[0].gender;
          const inputDate = response.data[0].date_of_birth;;

          const dateObject = new Date(inputDate);
          this.dateOfBirth = formatDate(dateObject, 'yyyy-MM-dd', 'en')

          // console.log(formattedDate); // Output: "10-08-2023"

          this.email = response.data[0].email;
          this.phoneNumber = response.data[0].phone_number;
          this.salary = response.data[0].salary;

          // Date of Joining 
          const inputDateOfJoining = response.data[0].date_of_joining;;

          const dateOfJoiningObject = new Date(inputDateOfJoining);
          this.dateOfJoining = formatDate(dateOfJoiningObject, 'yyyy-MM-dd', 'en')

          //Date of Leaving
          const inputDateOfLeaving = response.data[0].date_of_leaving;;

          const dateOfLeavingObject = new Date(inputDateOfLeaving);
          this.dateOfLeaving = formatDate(dateOfLeavingObject, 'yyyy-MM-dd', 'en')

          // console.log("Update button click-",this.username, this.password, this.empId, this.fullName, this.gender, this.dateOfBirth, this.email, this.phoneNumber, this.salary, this.designation, this.department, this.bankAccountNumber, this.dateOfJoining, this.dateOfLeaving);

        }
      }, (err) =>{
        console.log(err);
      });

    } else{

    this.isOptedForUpdateDetails = !this.isOptedForUpdateDetails;

    }

  }


  register() {

    // Validate password and confirm password
    if (this.mypassword !== this.myconfirmPassword) {
      this.snackbar.open('Passwords do not match. Please enter the same password in both fields.','Close');
      return;
    }

    if(this.myempId === '' || this.notContainWhiteSpace(this.myempId) === true){
      this.snackbar.open('Please enter Employee Id','Close');
      return;
    }

    if (this.myemail === '' || this.isValidEmail(this.myemail)===false) {
      this.snackbar.open('Invalid email address.','Close');
      return;
    }

    if(this.myfullName === '' || this.notContainWhiteSpace(this.myfullName) === true){
      this.snackbar.open('Please enter your name','Close');
      return;
    }

    if(this.mydateOfBirth === '' || this.notContainWhiteSpace(this.mydateOfBirth) === true){
      this.snackbar.open('Please enter correct D.O.B.','Close');
      return;
    }

    if(this.mydateOfJoining === '' || this.notContainWhiteSpace(this.mydateOfBirth) === true){
      this.snackbar.open('Please enter date of joining.','Close');
      return;
    }

    if(this.mydesignation === '' || this.notContainWhiteSpace(this.mydesignation) === true){
      this.snackbar.open('Please enter your designation','Close');
      return;
    }

    if(this.mydepartment === '' || this.notContainWhiteSpace(this.mydepartment) === true){
      this.snackbar.open('Please enter your department','Close');
      return;
    }

    if(this.mybankAccountNumber === '' || this.isValidAccountNumber(this.mybankAccountNumber)===false){
      this.snackbar.open('Invalid bank account number','Close');
      return;
    }

    if (this.myphoneNumber === '' || this.isValidNumber(this.myphoneNumber)===false) {
      this.snackbar.open('Invalid number.','Close');
      return;
    }

    if (this.mysalary < 5000 || this.mysalary === 0){
      this.snackbar.open('Enter salary more than 5000.','Close');
      return;
    }

    console.log("Date of birth-",this.mydateOfJoining > this.mydateOfBirth);

    // if (this.mydateOfJoining > this.mydateOfBirth){
    //   this.snackbar.open('Invalid date of birth','Close');
    //   return;
    // }
    
    // if (this.mydateOfJoining < this.mydateOfLeaving){
    //   this.snackbar.open('Invalid date of joining','Close');
    //   return;
    // }

    

    console.log(this.dateOfBirth);
    const currentDate = new Date();
    const selectedDate = new Date(this.mydateOfBirth);
    const selectedDate1 = new Date(this.mydateOfJoining);
    const selectedDate2 = new Date(this.mydateOfLeaving);

    if(selectedDate1 > currentDate){
      this.snackbar.open("Invalid date of joining. Can't add joining date in future date",'Close');
      return;
    }

    if(selectedDate2 > currentDate){
      this.snackbar.open("Invalid date of leaving. Can't add leaving date in future date",'Close');
      return;
    }

    if(selectedDate1 > selectedDate2){
      this.snackbar.open("Entered joining date is after leaving date",'Close');
      return;
    }

    if(isNaN(selectedDate.getTime())){
      this.snackbar.open("Enter Date of birth","Close");
    }

    if(isNaN(selectedDate1.getTime())){
      this.snackbar.open("Enter Date of joining","Close");
    }

    if(!isNaN(selectedDate.getTime())){
      const ageDifferenceInMilliseconds = currentDate.getTime() - selectedDate.getTime();
      const years = ageDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if(years < 18){
        this.snackbar.open("Age should be 18 or above","Close");
        return
      }
    }

    // console.log("Entered dates-",selectedDate, selectedDate1, selectedDate2);

    // console.log(selectedDate1 < selectedDate);

    if(selectedDate1 < selectedDate || selectedDate2 < selectedDate){
      this.snackbar.open("Entered joining/leaving date is before date of birth.","Close");
      return;
    }


    this.authService.register(this.myusername, this.mypassword, this.myempId, this.myfullName, this.mygender, this.mydateOfBirth, this.myemail, this.myphoneNumber, this.mysalary, this.mydesignation, this.mydepartment, this.mybankAccountNumber, this.mydateOfJoining, this.mydateOfLeaving)
      .subscribe((response: any) => {
        if (response.success) {
          // console.log("Register page Token", response.token);
          // this.authService.saveToken(response.token);
          this.snackbar.open("Successfully registered!!",'Close');
          setTimeout(() => {
            window.location.reload();
          }, 100);



        } else {
          this.snackbar.open('Already in database. Please choose a different username.', 'Close');
        }
      }, (error) => {
        this.snackbar.open(error.error.message,'Close');
      });
  }


  toggleOptedForAddNewEmployee():any{
    if(this.isOptedForAddNewEmployee==false){

      this.buttonValue = "No"
      this.isOptedForAddNewEmployee = !this.isOptedForAddNewEmployee

    } else{
    this.buttonValue = "Yes"
    this.isOptedForAddNewEmployee = !this.isOptedForAddNewEmployee;

    }

  }


  toggleOptedForGeneratePayslip(username: string):any{
    if(this.isOptedForGeneratePayslip==false){

      this.isOptedForGeneratePayslip = !this.isOptedForGeneratePayslip
      const lastDayOfMonth = new Date(this.myCurrentYear, this.myCurrentMonth + 1, 0).getDate();
      this.paidDays = lastDayOfMonth;

      return this.authService.fetchAllDetailsOfEmployee(username).subscribe((response:any) =>{
        if(response.success){
          console.log(response.data[0]);
          this.fullName = response.data[0].full_name;
          this.username = response.data[0].username;
          this.password = response.data[0].password;
          this.empId = response.data[0].emp_id;
          this.designation = response.data[0].designation;
          this.department = response.data[0].department;
          this.bankAccountNumber = response.data[0].bank_account_number;
          this.confirmPassword = response.data[0].password;
          this.gender = response.data[0].gender;
          const inputDate = response.data[0].date_of_birth;;

          const dateObject = new Date(inputDate);
          this.dateOfBirth = formatDate(dateObject, 'yyyy-MM-dd', 'en')

          // console.log(formattedDate); // Output: "10-08-2023"

          this.email = response.data[0].email;
          this.phoneNumber = response.data[0].phone_number;
          this.salary = response.data[0].salary;

          // Date of Joining 
          const inputDateOfJoining = response.data[0].date_of_joining;;

          const dateOfJoiningObject = new Date(inputDateOfJoining);
          this.dateOfJoining = formatDate(dateOfJoiningObject, 'yyyy-MM-dd', 'en')

          //Date of Leaving
          const inputDateOfLeaving = response.data[0].date_of_leaving;;

          const dateOfLeavingObject = new Date(inputDateOfLeaving);
          this.dateOfLeaving = formatDate(dateOfLeavingObject, 'yyyy-MM-dd', 'en')

        }
      }, (err) =>{
        console.log(err);
      });

    } else{

    this.isOptedForGeneratePayslip = !this.isOptedForGeneratePayslip;

    }

  }


  toggleOptedForDeleteEmployee(username: string):any{

   
      if(confirm("Are you sure you want to delete this employee record?")===true)
      {

      
      return this.authService.deleteEmployee(username).subscribe((response:any) =>{
        if(response.success){
          this.snackbar.open("Successfully Deleted",'Close');
          setTimeout(() => {
            window.location.reload();
          }, 100);
          

        }
      }, (err) =>{
        console.log(err);
      });
    }



  }

  


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


 update() {

    // Validate password and confirm password
    if (this.password !== this.confirmPassword) {
      this.snackbar.open('Passwords do not match. Please enter the same password in both fields.','Close');
      return;
    }

    if(this.empId === '' || this.notContainWhiteSpace(this.empId) === true){
      this.snackbar.open('Please enter Employee Id','Close');
      return;
    }

    if (this.email === '' || this.isValidEmail(this.email)===false) {
      this.snackbar.open('Invalid email address.','Close');
      return;
    }

    if(this.fullName === '' || this.notContainWhiteSpace(this.fullName) === true){
      this.snackbar.open('Please enter your name','Close');
      return;
    }

    if(this.dateOfBirth === '' || this.notContainWhiteSpace(this.dateOfBirth) === true){
      this.snackbar.open('Please enter correct D.O.B.','Close');
      return;
    }

    if(this.designation === '' || this.notContainWhiteSpace(this.designation) === true){
      this.snackbar.open('Please enter your designation','Close');
      return;
    }

    if(this.department === '' || this.notContainWhiteSpace(this.department) === true){
      this.snackbar.open('Please enter your department','Close');
      return;
    }

    if(this.phoneNumber === '' || this.isValidAccountNumber(this.bankAccountNumber) === false){
      this.snackbar.open('Invalid bank account number','Close');
      return;
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
      this.snackbar.open("Invalid date of joining. Can't add joining date in future date",'Close');
      return;
    }

    if(selectedDate2 > currentDate){
      this.snackbar.open("Invalid date of leaving. Can't add leaving date in future date",'Close');
      return;
    }

    if(selectedDate1 > selectedDate2){
      this.snackbar.open("Entered joining date is after leaving date",'Close');
      return;
    }

    if(isNaN(selectedDate.getTime())){
      this.snackbar.open("Enter Date of birth","Close");
    }

    if(isNaN(selectedDate1.getTime())){
      this.snackbar.open("Enter Date of joining","Close");
    }

    if(!isNaN(selectedDate.getTime())){
      const ageDifferenceInMilliseconds = currentDate.getTime() - selectedDate.getTime();
      const years = ageDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

      if(years < 18){
        this.snackbar.open("Age should be 18 or above","Close");
        return
      }
    }

    this.authService.update(this.username, this.password, this.empId, this.fullName, this.gender, this.dateOfBirth, this.email, this.phoneNumber, this.salary, this.designation, this.department, this.bankAccountNumber, this.dateOfJoining, this.dateOfLeaving, this.username)
      .subscribe((response: any) => {
        if (response.success) {
          // console.log("Update Token", response.token);

          const snackbarRef = this.snackbar.open('Successfully updated!!', 'Close');

          snackbarRef.afterDismissed().subscribe((dismissed) => {
            if (dismissed.dismissedByAction) {
              // The snackbar was dismissed by clicking the action button ('Close')
              window.location.reload();
            }
          });
          this.router.navigate(['/admin-page']);
          this.isOptedForUpdateDetails = false;
          

        } else {
          this.snackbar.open('Already in database. Please choose a different username.', 'Close');
        }
      }, (error) => {
        this.snackbar.open(error.error.message,'Close');
      });
  }


  calculate(){
    // this.currentDateAndTime = new Date();
    if(this.toggleForSalaryShow === false && this.hiddenTemplate === false){

      if(this.lossOfPaidDays == undefined){
        this.lossOfPaidDays = 0;
      }
      
      if(this.basic == undefined){
        this.basic = 0;
      }

      if(this.da == undefined){
        this.da = 0;
      }

      if(this.hra == undefined){
        this.hra = 0;
      }

      if(this.ca == undefined){
        this.ca = 0;
      }

      if(this.medical == undefined){
        this.medical = 0;
      }

      if(this.special == undefined){
        this.special = 0;
      }

      if(this.tax == undefined){
        this.tax = 0;
      }

      if(this.tds == undefined){
        this.tds = 0;
      }

      if(this.epf == undefined){
        this.epf = 0;
      }

      if((this.basic + this.da + this.hra + this.ca + this.special + this.medical) > this.salary || (this.basic + this.da + this.hra + this.ca + this.special + this.medical) < this.salary ){
        this.snackbar.open("Entered amount is not equal to salary","Close");
        return;
      }

      this.toggleForSalaryShow = !this.toggleForSalaryShow;
      // this.hiddenTemplate = !this.hiddenTemplate;


    } else{
      // this.hiddenTemplate = !this.hiddenTemplate;
      this.toggleForSalaryShow = !this.toggleForSalaryShow;
    }
  }

  togglePasswordVisibilityForRegisterPassword() {
    this.isPasswordVisibleforRegisterPassword = !this.isPasswordVisibleforRegisterPassword;
  }

  togglePasswordVisibilityForRegisterConfirmPassword() {
    this.isPasswordVisibleforRegisterConfirmPassword = !this.isPasswordVisibleforRegisterConfirmPassword;
  }

  togglePasswordVisibilityForUpdatePassword() {
    this.isPasswordVisibleforUpdatePassword = !this.isPasswordVisibleforUpdatePassword;
  }

  togglePasswordVisibilityForUpdateConfirmPassword() {
    this.isPasswordVisibleforUpdateConfirmPassword = !this.isPasswordVisibleforUpdateConfirmPassword;
  }

  toggleForHiddenTemplateShow(){
    this.currentDateAndTime = new Date();
      if(this.hiddenTemplate==false){
        this.hiddenButtonValue = "Hide";
        this.hiddenTemplate = !this.hiddenTemplate;
    } else{
      this.hiddenButtonValue = "Show";
      this.hiddenTemplate = !this.hiddenTemplate;
    }
  }
}
