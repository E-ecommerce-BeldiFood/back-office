import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Token } from '@angular/compiler';
import { LoginComponent } from '../auth/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isCollapsed = false;
  isVisible = false;
  constructor(private servicetoken : AuthService, private router: Router){

  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login'])
  }

  isMenuOpen: boolean = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isLoggedIn() {
    return window.localStorage.getItem('token') !== null;
  }
  

  
}
