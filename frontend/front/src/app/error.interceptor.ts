import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserApiService } from './services/users-api.service';
import { NotificationService } from './services/notification.service';

export const ErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const userApiService = inject(UserApiService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      const isRefreshCall = req.url.includes('/refresh');
      const isAuthCall = req.url.includes('/autenticar');

      if (error.status === 401 && !isRefreshCall && !isAuthCall) {
        const refreshToken = userApiService.getRefreshToken();

        if (refreshToken) {
          return userApiService.refreshToken(refreshToken).pipe(
            switchMap(response => {
              userApiService.setToken(response.token, response.refreshToken);
              const retried = req.clone({
                setHeaders: { Authorization: `Bearer ${response.token}` }
              });
              return next(retried);
            }),
            catchError(() => {
              userApiService.logout();
              router.navigate(['/Login']);
              return throwError(() => error);
            })
          );
        }

        userApiService.logout();
        router.navigate(['/Login']);
        return throwError(() => error);
      }

      if (error.status === 403) {
        notificationService.error('Você não tem permissão para esta ação.');
      } else if (error.status >= 500) {
        notificationService.error('Erro no servidor. Tente novamente em instantes.');
      } else if (error.status === 0) {
        notificationService.error('Sem conexão com o servidor. Verifique sua rede.');
      }

      return throwError(() => error);
    })
  );
};
