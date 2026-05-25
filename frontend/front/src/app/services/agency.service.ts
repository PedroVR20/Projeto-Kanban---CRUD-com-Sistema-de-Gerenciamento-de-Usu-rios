import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Agency } from '../models/agency.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
} )
export class AgencyService {
  private apiUrl = environment.apiAgencias;

  // Mantém o estado reativo das agências para toda a aplicação.
  private agenciesSubject = new BehaviorSubject<Agency[]>([] );
  public agencies$ = this.agenciesSubject.asObservable();

  constructor(private http: HttpClient ) {}

  /**
   * Busca todas as agências da API e atualiza o estado local.
   * Deve ser chamado uma vez quando a página de agências é carregada.
   */
  loadAgencies(): Observable<Agency[]> {
    return this.http.get<Agency[]>(this.apiUrl ).pipe(
      tap(agencies => this.agenciesSubject.next(agencies)),
      catchError(err => {
        console.error('Erro ao carregar agências:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Envia os dados de uma nova agência para a API (POST) e,
   * em caso de sucesso, adiciona a agência retornada ao estado local.
   */
  addAgency(agencyData: Omit<Agency, 'id'>): Observable<Agency> {
    return this.http.post<Agency>(this.apiUrl, agencyData ).pipe(
      tap(newAgencyFromApi => {
        const currentAgencies = this.agenciesSubject.getValue();
        this.agenciesSubject.next([...currentAgencies, newAgencyFromApi]);
      }),
      catchError(err => {
        console.error('Erro ao adicionar agência:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Envia uma requisição para deletar uma agência na API (DELETE) e,
   * em caso de sucesso, remove a agência do estado local.
   */
  deleteAgency(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}` ).pipe(
      tap(() => {
        const currentAgencies = this.agenciesSubject.getValue();
        const updatedAgencies = currentAgencies.filter(agency => agency.id !== id);
        this.agenciesSubject.next(updatedAgencies);
      }),
      catchError(err => {
        console.error('Erro ao deletar agência:', err);
        return throwError(() => err);
      })
    );
  }
}
