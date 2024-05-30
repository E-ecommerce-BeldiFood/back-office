import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve access token from local storage
    const accessToken = localStorage.getItem('accessToken');
    
    // Add the access token to the request headers if it exists
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${JSON.parse(accessToken)}`
        }
      });
    }

    return next.handle(request);
  }
}
