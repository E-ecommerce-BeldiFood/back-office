// src/app/auth/jwt-util.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtUtilService {
  private jwtHelper = new JwtHelperService();

  constructor() { }

  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  getTokenExpirationDate(token: string): Date | null {
    return this.jwtHelper.getTokenExpirationDate(token);
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}
