import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { UserDataService } from './user-data.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
} )
export class UserApiService {

  private readonly API_BASE_URL = environment.apiUsuarios;
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private loggedInStatus = new BehaviorSubject<boolean>(!!localStorage.getItem(this.TOKEN_KEY ));

  
  constructor(
    private http: HttpClient,
    private userDataService: UserDataService 
   ) { }

  

  public setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
    this.loggedInStatus.next(true);
    this.userDataService.loadToken();
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.loggedInStatus.next(false);
    this.userDataService.clearToken();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.loggedInStatus.asObservable();
  }

  // --- MÉTODOS DE API ---

  public autenticar(loginData: any): Observable<any> {
    const url = `${this.API_BASE_URL}/autenticar`;
    return this.http.post<any>(url, loginData).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token, response.refreshToken);
        }
      })
    );
  }

  public refreshToken(refreshToken: string): Observable<{ token: string; refreshToken: string }> {
    const url = `${this.API_BASE_URL}/refresh`;
    return this.http.post<{ token: string; refreshToken: string }>(url, { refreshToken });
  }

  public criar(userData: any): Observable<any> {
    const url = `${this.API_BASE_URL}/criar`;
    return this.http.post<any>(url, userData );
  }

  

  public getUsuariosPendentes(): Observable<any> {
    const url = `${this.API_BASE_URL}/pendentes`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<any>(url, { headers } );
  }

  public aprovarUsuario(id: string): Observable<void> {
    const url = `${this.API_BASE_URL}/${id}/aprovar`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<void>(url, null, { headers } );
  }

  public rejeitarUsuario(id: string): Observable<void> {

    const url = `${this.API_BASE_URL}/${id}/rejeitar`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<void>(url, null, { headers } );
  }

  public getUsuariosAprovados(): Observable<any> {
    const url = `${this.API_BASE_URL}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<any>(url, { headers });
  }

  public atualizarPerfil(id: string, perfil: string): Observable<void> {
    const url = `${this.API_BASE_URL}/${id}/perfil`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.put<void>(url, { perfil }, { headers });
  }

  public getRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role as string;
      if (userRole === 'MASTER') {
        return 'ROLE_MASTER';
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
