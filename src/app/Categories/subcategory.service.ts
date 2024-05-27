import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subcategory } from '../Module/Subcategory';

const BASIC_URL = "http://localhost:8002";

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  constructor(private http: HttpClient) { }

  getAllSubcategories(): Observable<any> {
    return this.http.get(BASIC_URL + "/subcategories");
  }
  postSubCategories(Subcategory: any): Observable<any> {
    return this.http.post(BASIC_URL + "/subcategories",Subcategory);
  }
  updateSubCategories(id: number, Subcategory: any): Observable<any> {
    return this.http.put(BASIC_URL + "/subcategories/" +id,Subcategory);
  }

  deleteSubcategory(id: number): Observable<any> {
    console.log("mokk")
    return this.http.delete(BASIC_URL + "/subcategories/" + id);
  }


  searchsubcategories(name: string): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${BASIC_URL}/subcategories/search?name=${name}`);
  }

  massDeletesubcategories(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${BASIC_URL}/subcategories/mass-delete`, { body: ids });
  }

}
