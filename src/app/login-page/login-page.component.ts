import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  username: string = '';
  password: string = '';
  isPasswordVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar){}

  login() {
    this.authService.login(this.username, this.password)
      .subscribe((response: any) => {
        if (response.success) {
          console.log("Login page Token", response.token);
          this.authService.saveToken(response.token);
          this.snackbar.open("Successfully logged in!!", "Close")
          setTimeout(() => {
            window.location.reload();
          }, 100);
          this.router.navigate(['/protected-page']);
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
