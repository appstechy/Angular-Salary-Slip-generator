import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-protected-page',
  templateUrl: './protected-page.component.html',
  styleUrls: ['./protected-page.component.css']
})
export class ProtectedPageComponent implements OnInit {
  fullName2 = '';
  username2 = '';
  // fullName = '';
  // username: string = '';
  // password: string = '';
  // confirmPassword: string = '';
  // empId: string = '';
  // designation: string = '';
  // department: string = '';
  // bankAccountNumber: string = '';
  // gender: string = 'male';
  // dateOfBirth: string = '';
  // email: string = '';
  // phoneNumber: string = '';
  // salary!: number;
  // dateOfJoining: string = '';
  // dateOfLeaving: string = '';
  // isPasswordVisible: boolean = false;
  // isOptedForUpdateDetails:boolean = false;
  // buttonValue:string = "Yes"
  
  result:any = "";
  finalDob: string = ""

  response:any = this.authService.fetchAllDetails().subscribe((response:any) =>{
    if(response.success){
      console.log(response.data[0]);
      this.result = response.data[0];
      const dateObject = new Date(response.data[0].dateOfBirth);
      this.finalDob = formatDate(dateObject, 'yyyy-MM-dd', 'en')

    }
  }, (err) =>{
    console.log(err);
  });



  // toggleOptedForUpdateDetails():any{
  //   if(this.isOptedForUpdateDetails==false){

  //     this.buttonValue = "No"
  //     this.isOptedForUpdateDetails = !this.isOptedForUpdateDetails
  //     return this.authService.fetchAllDetails().subscribe((response:any) =>{
  //       if(response.success){
  //         console.log(response.data[0]);
  //         this.fullName = response.data[0].fullName;
  //         this.username = response.data[0].username;
  //         this.password = response.data[0].password;
  //         this.confirmPassword = response.data[0].password;
  //         this.gender = response.data[0].gender;
  //         const inputDate = response.data[0].dateOfBirth;;

  //         const dateObject = new Date(inputDate);
  //         this.dateOfBirth = formatDate(dateObject, 'yyyy-MM-dd', 'en')

  //         // console.log(formattedDate); // Output: "10-08-2023"

  //         this.email = response.data[0].email;
  //         this.phoneNumber = response.data[0].phoneNumber;
  //         this.salary = response.data[0].salary;

  //         // Date of Joining 
  //         const inputDateOfJoining = response.data[0].dateOfJoining;;

  //         const dateOfJoiningObject = new Date(inputDateOfJoining);
  //         this.dateOfJoining = formatDate(dateOfJoiningObject, 'yyyy-MM-dd', 'en')

  //         //Date of Leaving
  //         const inputDateOfLeaving = response.data[0].dateOfLeaving;;

  //         const dateOfLeavingObject = new Date(inputDateOfLeaving);
  //         this.dateOfLeaving = formatDate(dateOfLeavingObject, 'yyyy-MM-dd', 'en')

  //       }
  //     }, (err) =>{
  //       console.log(err);
  //     });

  //   } else{
  //   this.buttonValue = "Yes"
  //   this.isOptedForUpdateDetails = !this.isOptedForUpdateDetails;

  //   }

  // }

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService, private snackbar:MatSnackBar, private router: Router){}


  // isValidEmail(email: string): boolean {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   return emailRegex.test(email);
  // }

  // isValidNumber(num: string): boolean {
  //   const numRegex = /^\d{10}$/;
  //   return numRegex.test(num);
  // }

  ngOnInit(): void {

    let apiUrl = 'http://localhost:3000/api';



    this.authService.fetchFullName().subscribe((response:any) => {
      if(response.success){
        this.fullName2 = response.fullName;
        this.username2 = response.username;
      } else{

        this.snackbar.open(response.message,'Close');
      }
    }, (error) => {
      this.snackbar.open(error.error.message,'Close');
    })
      
  }



//  update() {

//    // Validate password and confirm password
//     if (this.password !== this.confirmPassword) {
//       this.snackbar.open('Passwords do not match. Please enter the same password in both fields.','Close');
//       return;
//     }

//     if (this.email == '' || this.isValidEmail(this.email)==false) {
//       this.snackbar.open('Invalid email address.','Close');
//       return;
//     }

//     if (this.phoneNumber == '' || this.isValidNumber(this.phoneNumber)==false) {
//       this.snackbar.open('Invalid number.','Close');
//       return;
//     }


//     const currentDate = new Date();
//     const selectedDate = new Date(this.dateOfBirth);

//     if(selectedDate > currentDate){
//       this.snackbar.open('Invalid date of birth.','Close');
//       return;
//     }

//     this.authService.update(this.username, this.password, this.empId, this.fullName, this.gender, this.dateOfBirth, this.email, this.phoneNumber, this.salary, this.designation, this.department, this.bankAccountNumber, this.dateOfJoining, this.dateOfLeaving, this.username)
//       .subscribe((response: any) => {
//         if (response.success) {
//           // console.log("Update Token", response.token);

//           const snackbarRef = this.snackbar.open('Successfully updated!!', 'Close');

//           snackbarRef.afterDismissed().subscribe((dismissed) => {
//             if (dismissed.dismissedByAction) {
//               // The snackbar was dismissed by clicking the action button ('Close')
//               window.location.reload();
//             }
//           });
//           this.router.navigate(['/protected-page']);
//           this.isOptedForUpdateDetails = false;
          

//         } else {
//           this.snackbar.open('Already in database. Please choose a different username.', 'Close');
//         }
//       }, (error) => {
//         this.snackbar.open(error.error.message,'Close');
//       });
//   }

  // togglePasswordVisibility() {
  //   this.isPasswordVisible = !this.isPasswordVisible;
  // }

}


