import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASIC_URL = "http://localhost:8002";
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<any> {
    return this.http.get(BASIC_URL + "/orders");
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(BASIC_URL + "/orders/" + orderId);
  }
}
