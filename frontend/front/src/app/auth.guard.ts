import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree  } from '@angular/router';
import { UserApiService } from './services/users-api.service'; // Ajuste o caminho
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userApiService: UserApiService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

     const isLoginRoute = state.url.includes('/Login');

    // Usamos o Observable reativo do nosso serviço!
    return this.userApiService.isLoggedIn().pipe(
      take(1), // Pega apenas o valor mais recente e completa o observable
      map((isLoggedIn: boolean) => {
        
        console.log(`[Guard] Status de login verificado: ${isLoggedIn}. Tentando acessar: ${state.url}`);

        if (isLoginRoute) {
          if (isLoggedIn) {
            // Se o usuário ESTÁ logado e tenta acessar a página de Login...
            console.log('[Guard] Usuário já logado. Redirecionando para /Home.');
            return this.router.createUrlTree(['/Home']); // ...redireciona para a Home.
          } else {
            // Se o usuário NÃO está logado e tenta acessar a página de Login...
            return true; // ...permite o acesso.
          }
        } else {
          // Para qualquer outra rota...
          if (isLoggedIn) {
            // Se o usuário ESTÁ logado...
            return true; // ...permite o acesso.
          } else {
            // Se o usuário NÃO está logado...
            console.log('[Guard] Usuário não logado. Redirecionando para /Login.');
            return this.router.createUrlTree(['/Login']); // ...redireciona para o Login.
          }
        }
      })
    );
  }
}
