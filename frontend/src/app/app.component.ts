import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    console.log("AppComponent - ngOnInit");
    this.findUserByRole();
  }
  

  isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  findUserByRole(): void {
    console.log("AppComponent - findUserByRole");
    this.userRole = this.authService.findUserByRole() || '';
    console.log("Role-", this.userRole);
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
    this.userRole = '';
    this.snackbar.open("Successfully logged out!!", "Close");
  }
}
