import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs'; // Importando as ferramentas de reatividade

// A interface que você já definiu, perfeita.
interface DecodedToken {
  sub: string;
  role: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  // --- INÍCIO DA LÓGICA REATIVA ---

  // 1. O "Anunciante": Um BehaviorSubject que guarda o estado atual do token decodificado.
  // Ele começa com o valor do token que já pode estar no localStorage.
  private decodedTokenSubject = new BehaviorSubject<DecodedToken | null>(this.getDecodedToken());

  // 2. O "Canal de Rádio": Um Observable público que outros componentes (como a Navbar) podem "ouvir".
  public decodedToken$: Observable<DecodedToken | null> = this.decodedTokenSubject.asObservable();

  // --- FIM DA LÓGICA REATIVA ---

  constructor() { }

  // Método chamado APÓS o login para atualizar o estado.
  public loadToken(): void {
    const tokenData = this.getDecodedToken();
    console.log('[UserDataService] Carregando novo token. Dados:', tokenData);
    // 3. Notifica todos os "ouvintes" (a Navbar) que um novo token chegou.
    this.decodedTokenSubject.next(tokenData);
  }

  // Método chamado DURANTE o logout para limpar o estado.
  public clearToken(): void {
    console.log('[UserDataService] Limpando dados do token.');
    // 4. Notifica todos os "ouvintes" que o token foi removido.
    this.decodedTokenSubject.next(null);
  }

  // --- SEUS MÉTODOS ORIGINAIS (AGORA PRIVADOS) ---

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
      }
    }
    return null;
  }

  // --- MÉTODOS PÚBLICOS PARA ACESSO DIRETO (OPCIONAL, MAS ÚTIL) ---
  // Estes métodos agora leem do "Anunciante" para sempre terem o valor mais atual.

  public getCurrentUserName(): string | null {
    const decodedToken = this.decodedTokenSubject.getValue();
    return decodedToken ? decodedToken.sub : null;
  }

  public getCurrentUserProfile(): string | null {
    const decodedToken = this.decodedTokenSubject.getValue();
    // Adicionamos o prefixo "ROLE_" aqui para padronizar
    return decodedToken ? "ROLE_" + decodedToken.role : null;
  }

  public isUserMaster(): boolean {
    const perfil = this.getCurrentUserProfile();
    // 5. SUA CORREÇÃO APLICADA: Verificando por 'ROLE_MASTER'.
    return perfil === 'ROLE_MASTER';
  }

  public getUserEmail(): string | null {
    const decodedToken = this.decodedTokenSubject.getValue();
    return decodedToken ? decodedToken.sub : null;
  }
}
