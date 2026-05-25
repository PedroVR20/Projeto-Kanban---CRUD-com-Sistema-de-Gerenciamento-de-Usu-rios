import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs'; // Ferramenta para gerenciar inscrições

// Seus Módulos do Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// Seus Serviços
import { UserApiService } from '../../services/users-api.service';
import { UserDataService } from '../../services/user-data.service';
import { ModalService } from '../../shared/modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Propriedades para controlar a UI
  isLoggedIn: boolean = false;
  isMaster: boolean = false;
  nomeUsuario: string | null = null;
  userInitials: string = '';

  // Variáveis para guardar as inscrições e cancelá-las depois
  private authSubscription!: Subscription;
  private profileSubscription!: Subscription;

  constructor(
    private userApiService: UserApiService,
    private userDataService: UserDataService, // Injetando o serviço de dados
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    // Inscrição 1: Ouve o status de login (logado/deslogado)
    this.authSubscription = this.userApiService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });

    // Inscrição 2: Ouve os dados do token (perfil, nome, etc.)
    this.profileSubscription = this.userDataService.decodedToken$.subscribe(tokenData => {
      console.log('[Navbar] Recebi novos dados do token:', tokenData);

      // Verifica se o usuário é MASTER
      this.isMaster = (tokenData?.role === 'MASTER');

      // Atualiza o nome do usuário e as iniciais
      this.nomeUsuario = tokenData ? tokenData.sub : null;
      this.setUserInitials();
    });
  }

  ngOnDestroy(): void {
    // Boa prática: cancela as inscrições para evitar vazamento de memória
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  // --- MÉTODOS DE AÇÃO E AUXILIARES ---

  public fazerLogout(): void {
    this.userApiService.logout();
    this.router.navigate(['/Login']);
  }

  setUserInitials(): void {
    if (this.nomeUsuario) {
      const names = this.nomeUsuario.split(' ');
      this.userInitials = names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`
        : names[0].substring(0, 2);
      this.userInitials = this.userInitials.toUpperCase();
    } else {
      this.userInitials = '';
    }
  }

  isBoardRoute(): boolean {
    return this.router.url === '/' || this.router.url === '/Home';
  }

  openTaskModal(): void {
    this.modalService.openBoardModal();
  }

  openFilterModal(): void {
    this.modalService.openFilterModal();
  }
}
