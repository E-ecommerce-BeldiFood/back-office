import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Module/Category';

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

  searchProducts(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${BASIC_URL}/categories/search?name=${name}`);
  }

  massDeleteCategories(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}/categories/mass-delete`, { body: ids });
  }

}
