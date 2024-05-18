import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../auth.service';

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
  credentials= {
    login:'',
    password:''
  };

  constructor(private authService: AuthService, private router:Router) {

  }

 

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Store the token in localStorage
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('role', response.role);

        this.router.navigate(['/dashhome']).then(success => {
          if (success) {
            console.log('Navigation to dashboard successful!');
          } else {
            console.log('Navigation to dashboard failed!');
          }
        });
      },
      error: (error) => {
        console.error('Login failed', error);
        console.log('Login details', error.error);
      }
    });
  }

  logout(){
    localStorage.clear()
  }


}
