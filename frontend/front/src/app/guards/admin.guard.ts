import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { UserApiService } from '../services/users-api.service'; // Ajuste o caminho se necessário

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private userApiService: UserApiService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Primeiro, verificamos se o usuário está logado.
    return this.userApiService.isLoggedIn().pipe(
      take(1),
      map(isLoggedIn => {
        if (!isLoggedIn) {
          // Se não está logado, não tem como ser admin. Redireciona para o login.
          console.log('[AdminGuard] Usuário não logado. Acesso negado.');
          return this.router.createUrlTree(['/Login']);
        }

        // Se está logado, verificamos o perfil (role).
        const userRole = this.userApiService.getRole(); // Precisamos criar este método!
        console.log(`[AdminGuard] Usuário logado. Verificando perfil: ${userRole}`);

        if (userRole === 'ROLE_MASTER') {
          // Se for MASTER, acesso permitido!
          console.log('[AdminGuard] Perfil MASTER confirmado. Acesso permitido.');
          return true;
        } else {
          // Se está logado, mas não é MASTER, redireciona para a home (ou uma página de "acesso negado").
          console.log('[AdminGuard] Perfil não é MASTER. Acesso negado.');
          return this.router.createUrlTree(['/Home']); 
        }
      })
    );
  }
}
