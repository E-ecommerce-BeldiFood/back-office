import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../auth.service';
import { UserLoginRequest } from 'src/app/Module/user-login-request.model';
import { TokenDto } from 'src/app/Module/token-dto.model';
import { Subscription } from 'rxjs';

interface LoginResponse {
  accessToken:string;
  role: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: UserLoginRequest = {
    login: '',
    password: ''
  };
  errorMessage: string = '';
  isLoggedIn = false;
  isLoginFailed = false;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router:Router) {

  }
  ngOnInit(): void {
    console.log('Login component initialized');
  }

 
  login() {
    this.subscription.add(
      this.authService.login(this.loginData).subscribe(
        (response: TokenDto) => {
          localStorage.setItem('UserInfo', JSON.stringify(response.user));
          localStorage.setItem('accessToken', JSON.stringify(response.accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          this.isLoginFailed = true;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

 /*  login() {
    this.authService.login(this.loginData).subscribe(
      (response: TokenDto) => { // Capture the response data
        // Store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('UserInfo', JSON.stringify(response.user));
        // Simulate a login process
        localStorage.setItem('accessToken', JSON.stringify(response.accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
        
        // Navigate to the home page or redirect to the desired route
        this.router.navigate(['/dash-home']); // Navigate sidbar
      },
      error => {
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  } */


  /* logout(){
    localStorage.clear()
  } */


}
