import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hr-login',
  templateUrl: './hr-login.component.html',
  styleUrls: ['./hr-login.component.css']
})
export class HrLoginComponent {
  username: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar){}

  login() {
    this.authService.adminLogin(this.username, this.password)
      .subscribe((response: any) => {
        if (response.success) {
          console.log("Admin page Token", response.token);
          this.authService.saveTokenForAdmin(response.token);
          this.snackbar.open("Successfully logged in admin page!!", "Close");

          setTimeout(() => {
            window.location.reload();
          }, 100);

          this.router.navigate(['/admin-page']);
          // window.location.reload();

        } else {
          this.snackbar.open('Wrong details. Please enter correct credentials.','Close');
        }
      }, (error) => {
        this.snackbar.open(error.error.message,'Close');
      });
  }



togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible;
}
}
