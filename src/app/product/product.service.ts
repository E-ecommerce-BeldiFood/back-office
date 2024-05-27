import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Product } from '../Module/Product';

const BASIC_URL = "http://localhost:8002";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  

  constructor(private http: HttpClient) { }

  postProduct(Product: any): Observable<any> {
    return this.http.post(BASIC_URL + "/products", Product);
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + "/products");
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + "/products/" +id);
  }

  updateProduct(id: number, Product: any): Observable<any> {
    return this.http.put(BASIC_URL + "/products/" +id, Product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + "/products/" +id);
  }
  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${BASIC_URL}/products/search?name=${name}`);
  }

  massDeleteProducts(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}/products/mass-delete`, { body: ids });
  }

}