import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogitrackAuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private rest: RestApiService,
    private router: Router
  ) {}

  checkSessionInitializer(): Observable<any> {
    return this.rest.get('auth/me').pipe(
      tap(res => {
        if (res.status) {
          this.currentUserSubject.next(res.data);
        } else {
          this.currentUserSubject.next(null);
        }
      })
    );
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(nik: string, password: string): Observable<any> {
    return this.rest.post('auth/login', { nik, password })
      .pipe(
        tap(res => {
          if (res.status && res.data) {
            this.currentUserSubject.next(res.data);
          }
        })
      );
  }

  sso(employeeCode: string): Observable<any> {
    return this.rest.post('auth/sso', { employeeCode })
      .pipe(
        tap(res => {
          if (res.status && res.data) {
            this.currentUserSubject.next(res.data);
          }
        })
      );
  }

  logout() {
    this.rest.post('auth/logout', {}).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  checkSession() {
    this.rest.get('auth/me').subscribe({
      next: (res) => {
        if (res.status) {
          this.currentUserSubject.next(res.data);
        } else {
          this.currentUserSubject.next(null);
        }
      },
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }
}
