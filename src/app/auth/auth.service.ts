import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {JwtUtilService} from "../auth/jwt-util.service";
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private jwtUtil:JwtUtilService) {
  }

  login(credentials: { login: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          console.log('Token:', response.token);
          const decodedToken = this.jwtUtil.decodeToken(response.token);
          console.log('Decoded Token:', decodedToken);

          localStorage.setItem('token', response.token);

          console.log('Stored Token:', localStorage.getItem('token'));
        }
      })
    );
  }

  private extractRoles(decodedToken: any): string[] {
    try {
      const rolesRaw = decodedToken.roles;
      console.log('Roles raw:', rolesRaw);
      if (rolesRaw) {
        return rolesRaw.split(','); // Split roles by comma and return as array
      }
    } catch (error) {
      console.error('Error extracting roles:', error);
    }
    return [];
  }



  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Optionally add a method to retrieve the user role
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

}
