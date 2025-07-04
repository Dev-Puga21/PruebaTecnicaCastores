import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject, Observable } from 'rxjs';

interface DecodedToken {
  exp: number;
  Id: number;
  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;
  FirstLogin: boolean;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  decodedToken?: DecodedToken | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'tokenData';
  private intervalId: any = null;
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    decodedToken: null
  });
  public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

  constructor(private router: Router) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.setUserData(token);
    }

    this.intervalId = setInterval(() => this.checkTokenExpiration(), 60000);
  }

  // ✅ Decodificación JWT sin librerías
  private decodeJwt<T>(token: string): T {
    const payload = token.split('.')[1];
    if (!payload) {
      throw new Error('Token inválido: no contiene payload.');
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload) as T;
  }

  public setUserData(token: string): void {
    try {
      const decoded = this.decodeJwt<DecodedToken>(token);
      if (decoded.exp * 1000 > Date.now()) {
        localStorage.setItem(this.tokenKey, token);
        this.authStateSubject.next({
          isAuthenticated: true,
          decodedToken: decoded
        });
      } else {
        this.logout();
      }
    } catch (e) {
      console.error('Token inválido:', e);
      this.logout();
    }
  }

  public logout(): void {
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'La sesión ha sido cerrada por seguridad.',
      icon: 'info'
    }).then(() => {
      localStorage.removeItem(this.tokenKey);
      this.authStateSubject.next({
        isAuthenticated: false,
        decodedToken: null
      });
      this.router.navigate(['/']);
    });
  }

  public checkTokenExpiration(): void {
    const currentState = this.authStateSubject.value;
    if (currentState.isAuthenticated && currentState.decodedToken) {
      if (currentState.decodedToken.exp * 1000 < Date.now()) {
        this.logout();
      }
    }
  }

  public getDecodedToken(): DecodedToken | null {
    return this.authStateSubject.value.decodedToken || null;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getAuthState(): Observable<AuthState> {
    return this.authState$;
  }

  public isLoggedIn(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }
}
