import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataService } from './user-data.service';
import { VistoRequest, VistoResponse } from '../models/visto.model';
import { UserApiService } from './users-api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
} )
export class VistosApiService {

  private apiUrl = environment.apiVistos;

  constructor(
    private http: HttpClient,
    private userApiService: UserApiService
   ) { }

  // 2. CORREÇÃO: O método agora retorna um array de 'VistoResponse'.
  public getVistos(): Observable<VistoResponse[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<VistoResponse[]>(this.apiUrl, { headers } );
  }

  // 3. CORREÇÃO: O método agora recebe um 'VistoRequest' e retorna um 'VistoResponse'.
  public createVisto(vistoData: VistoRequest): Observable<VistoResponse> {
    const headers = this.createAuthHeaders();
    return this.http.post<VistoResponse>(this.apiUrl, vistoData, { headers } );
  }

  public deleteVisto(id: string): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers } );
  }

  private createAuthHeaders(): HttpHeaders {
    const token = this.userApiService.getToken();

    if (!token) {
      console.error('Token não encontrado para a requisição à API de Vistos.');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }



}
