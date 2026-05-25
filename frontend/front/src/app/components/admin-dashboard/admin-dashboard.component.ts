import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../services/users-api.service'; // Ajuste o caminho
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

// Vamos criar uma interface para tipar os dados do usuário pendente
export interface UsuarioPendente {
  id: string;
  nome: string;
  email: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule ,
    MatIcon,
    RouterLink
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  // Variável para guardar a lista de usuários que virá da API
  usuariosPendentes: UsuarioPendente[] = [];
  isLoading = true; // Variável para mostrar um "Carregando..."

  constructor(private userApiService: UserApiService) { }

  ngOnInit(): void {
    this.carregarUsuariosPendentes();
  }

  carregarUsuariosPendentes(): void {
    this.isLoading = true;
    this.userApiService.getUsuariosPendentes().subscribe({
      next: (data) => {
        this.usuariosPendentes = data;
        this.isLoading = false;
        console.log('Usuários pendentes carregados:', this.usuariosPendentes);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários pendentes', err);
        this.isLoading = false;
        // Aqui você pode mostrar uma mensagem de erro para o usuário
      }
    });
  }

  aprovarUsuario(id: string): void {
    console.log(`Tentando aprovar usuário com ID: ${id}`);
    this.userApiService.aprovarUsuario(id).subscribe({
      next: () => {
        console.log(`Usuário ${id} aprovado com sucesso!`);
        // Recarrega a lista para remover o usuário que foi aprovado
        this.carregarUsuariosPendentes(); 
      },
      error: (err) => {
        console.error(`Erro ao aprovar usuário ${id}`, err);
      }
    });
  }

  rejeitarUsuario(id: string): void {
    // Usamos um 'confirm' para evitar cliques acidentais
    if (confirm('Tem certeza que deseja rejeitar este usuário? A ação não pode ser desfeita.')) {
      this.userApiService.rejeitarUsuario(id).subscribe({
        next: () => {
          console.log(`Usuário ${id} rejeitado com sucesso!`);
          this.carregarUsuariosPendentes(); // Recarrega a lista para remover o usuário
        },
        error: (err) => {
          console.error(`Erro ao rejeitar usuário ${id}`, err);
          // Opcional: mostrar uma mensagem de erro para o usuário
        }
      });

    }
  }
}
