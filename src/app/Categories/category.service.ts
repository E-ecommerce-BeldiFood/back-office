import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8002";
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }


  postCategories(Category: any): Observable<any> {
    return this.http.post(BASIC_URL + "/categories",Category);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(BASIC_URL + "/categories");
  }

  updateCategories(id: number, Category: any): Observable<any> {
    return this.http.put(BASIC_URL + "/categories/" +id,Category);
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + "/categories/" +id);
  }
}
