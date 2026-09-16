import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHttpOptions(params?: any, isFormData: boolean = false) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    
    let headers = new HttpHeaders();
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }
    
    return {
      headers: headers,
      params: httpParams,
      withCredentials: true // Extremely important for cookie-based auth
    };
  }

  // Generics for CRUD
  public get(endpoint: string, params?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, this.getHttpOptions(params));
  }

  public post(endpoint: string, data: any): Observable<any> {
    const isFormData = data instanceof FormData;
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, this.getHttpOptions(null, isFormData));
  }

  public put(endpoint: string, data: any): Observable<any> {
    const isFormData = data instanceof FormData;
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, this.getHttpOptions(null, isFormData));
  }

  public delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, this.getHttpOptions());
  }
}
