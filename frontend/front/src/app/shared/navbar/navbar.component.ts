import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserApiService } from '../../services/users-api.service';
import { UserDataService } from '../../services/user-data.service';
import { ModalService } from '../../shared/modal.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isMaster: boolean = false;
  nomeUsuario: string | null = null;
  userInitials: string = '';

  private authSubscription!: Subscription;
  private profileSubscription!: Subscription;

  constructor(
    private userApiService: UserApiService,
    private userDataService: UserDataService,
    private router: Router,
    private modalService: ModalService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.userApiService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });

    this.profileSubscription = this.userDataService.decodedToken$.subscribe(tokenData => {
      console.log('[Navbar] Recebi novos dados do token:', tokenData);
      this.isMaster = (tokenData?.role === 'MASTER');
      this.nomeUsuario = tokenData ? tokenData.sub : null;
      this.setUserInitials();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.profileSubscription) this.profileSubscription.unsubscribe();
  }

  public fazerLogout(): void {
    this.userApiService.logout();
    this.router.navigate(['/Login']);
  }

  toggleTheme(): void {
    this.themeService.toggle();
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
