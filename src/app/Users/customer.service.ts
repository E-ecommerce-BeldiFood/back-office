import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8002";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  
  getAllUsers(): Observable<any> {
    return this.http.get(BASIC_URL + "/users/admin");
  }

  getDisabledUsers(): Observable<any> {
    return this.http.get(BASIC_URL + "/users/disabled-users/admin");
  }
  
  deleteUsers(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + "/users/admin/" +id);
  }
  
  enableUser(id: number): Observable<any> {
    return this.http.put(BASIC_URL + "/users/admin/" + id, {});
  }
   
}
