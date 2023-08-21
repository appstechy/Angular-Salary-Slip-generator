import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProtectedPageComponent } from './protected-page/protected-page.component';
import { AuthGuard } from './auth.guard';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { HrLoginComponent } from './hr-login/hr-login.component';
import { HrProtectedPageComponent } from './hr-protected-page/hr-protected-page.component';

const routes: Routes = [
  { path:'', pathMatch: 'full', redirectTo: 'login' },
  { path:'login', component: HrLoginComponent },
  { path:'emp_login', component: LoginPageComponent },
  { path: 'protected-page', component: ProtectedPageComponent, canActivate: [AuthGuard] },
  { path: 'admin-page', component: HrProtectedPageComponent, canActivate: [AuthGuard] },
  // { path: 'register', component: RegistrationPageComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
