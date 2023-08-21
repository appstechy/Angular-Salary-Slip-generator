import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private loggedInFullName: string = ''
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any>{
    const credentials = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }


  adminLogin(username: string, password: string): Observable<any>{
    const credentials = { username, password };
    return this.http.post<any>(`${this.apiUrl}/admin_login`, credentials);
  }



  register(username: string, password:string, empId: string, fullName:string, gender: string, dateOfBirth: string, email: string, phoneNumber: string, salary: number, designation: string, department: string, bankAccountNumber: string, dateOfJoining: string, dateOfLeaving: string): Observable<any>{
    const credentials = { username, password, empId, fullName, gender, dateOfBirth, email, phoneNumber, salary, designation, department, bankAccountNumber, dateOfJoining, dateOfLeaving };
    return this.http.post<any>(`${this.apiUrl}/register`, credentials);

  }


  update(username: string, password:string, empId: string, fullName:string, gender: string, dateOfBirth: string, email: string, phoneNumber: string, salary: number, designation: string, department: string, bankAccountNumber: string, dateOfJoining: string, dateOfLeaving: string, username2: string): Observable<any>{
    const credentials = { username, password, empId, fullName, gender, dateOfBirth, email, phoneNumber, salary, designation, department, bankAccountNumber, dateOfJoining, dateOfLeaving, username2 };
    return this.http.post<any>(`${this.apiUrl}/updateUser`, credentials);

  }

  saveToken(token: string){
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'employee');
    
  }

  saveTokenForAdmin(token: string){
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'admin');
    
  }


  getToken(){
    return localStorage.getItem('token');

  }

  fetchFullName(): Observable<any>{
    const token = this.getToken();
    console.log("fetchFullName()-",token);
    if(!token){
      return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    }

    return this.http.get<any>(`${this.apiUrl}/getFullName`, {
      headers:{
        Authorization: token
      }
    });
  }



  fetchFullNameOfAdmin(): Observable<any>{
    const token = this.getToken();
    console.log("fetchFullNameOfAdmin()-",token);
    if(!token){
      return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    }

    return this.http.get<any>(`${this.apiUrl}/getFullNameOfAdmin`, {
      headers:{
        Authorization: token
      }
    });
  }


  fetchAllDetails():Observable<any>{
    const token = this.getToken();
    console.log("fetchAllDetails()-",token);
    if(!token){
      return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    }

    return this.http.get<any>(`${this.apiUrl}/fetchAllDetails`, {
      headers:{
        Authorization: token
      }
    });

  }



  fetchAllDetailsOfEmployee(username: string):Observable<any>{
    // const token = this.getToken();
    console.log("fetchAllDetailsOfEmployee()-");
    // if(!token){
    //   return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    // }

    return this.http.get<any>(`${this.apiUrl}/fetchAllDetailsOfEmployee`, {
      headers:{
        Authorization: username
      }
    });

  }


  deleteEmployee(username: string):Observable<any>{
    // const token = this.getToken();
    console.log("deleteEmployee()-",username);
    // if(!token){
    //   return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    // }
    const credentials = { username };
    return this.http.post<any>(`${this.apiUrl}/deleteEmployee`, credentials );

  }




  fetchAllEmployeesDetails():Observable<any>{
    const token = this.getToken();
    console.log("fetchAllEmployeesDetails()-",token);
    if(!token){
      return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    }

    return this.http.get<any>(`${this.apiUrl}/fetchAllEmployeesDetails`);

  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  isUserLoggedIn():boolean{
    const token = this.getToken();

    return !!token && !this.isTokenExpired(token);
  }


  findUserByRole(){
    console.log("AuthService - findUserByRole");
    return localStorage.getItem('role');
  }

  private isTokenExpired(token: string): boolean{
    const decodedToken: any = jwt_decode(token);
    if(decodedToken && decodedToken.exp){
      const expirationTime = decodedToken.exp * 1000;
      return Date.now() >= expirationTime;
    }

    return false;
  }

}

