import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrls = 'http://localhost:8080/user/employee';

  constructor(private http: HttpClient) { }
  
  updateData(data: any, headers: HttpHeaders): Observable<any>{
    return this.http.put(`${this.baseUrls}/updateNote`, data, { headers });
  }

  
}
