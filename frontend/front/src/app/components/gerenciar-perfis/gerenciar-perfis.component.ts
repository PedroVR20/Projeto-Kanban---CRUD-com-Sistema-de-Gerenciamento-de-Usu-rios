import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../services/users-api.service';
import { UserDataService } from '../../services/user-data.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export interface UsuarioAprovado {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: string;
}

@Component({
  selector: 'app-gerenciar-perfis',
  imports: [CommonModule, MatIcon, RouterLink],
  templateUrl: './gerenciar-perfis.component.html',
  styleUrls: ['./gerenciar-perfis.component.css']
})
export class GerenciarPerfisComponent implements OnInit {

  usuariosAprovados: UsuarioAprovado[] = [];
  isLoading = true;
  emailUsuarioLogado: string = '';
  mensagem: string = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private userApiService: UserApiService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.emailUsuarioLogado = this.userDataService.getUserEmail() || '';
    this.carregarUsuariosAprovados();
  }

  carregarUsuariosAprovados(): void {
    this.isLoading = true;
    this.userApiService.getUsuariosAprovados().subscribe({
      next: (data) => {
        this.usuariosAprovados = data;
        this.isLoading = false;
        console.log('Usuários aprovados carregados:', this.usuariosAprovados);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários aprovados', err);
        this.mostrarMensagem('Erro ao carregar usuários', 'erro');
        this.isLoading = false;
      }
    });
  }

  promoverParaMaster(usuario: UsuarioAprovado): void {
    if (confirm(`Deseja promover ${usuario.nome} para MASTER?`)) {
      this.userApiService.atualizarPerfil(usuario.id, 'MASTER').subscribe({
        next: () => {
          console.log(`Usuário ${usuario.id} promovido para MASTER`);
          this.mostrarMensagem(`Usuário ${usuario.nome} promovido para MASTER com sucesso!`, 'sucesso');
          this.carregarUsuariosAprovados();
        },
        error: (err) => {
          console.error(`Erro ao promover usuário ${usuario.id}`, err);
          this.mostrarMensagem('Erro ao promover usuário: ' + (err.error?.message || 'Tente novamente'), 'erro');
        }
      });
    }
  }

  rebaixarParaUser(usuario: UsuarioAprovado): void {
    // Impedir auto-rebaixamento
    if (usuario.email === this.emailUsuarioLogado) {
      this.mostrarMensagem('Você não pode rebaixar seu próprio perfil!', 'erro');
      return;
    }

    if (confirm(`Deseja rebaixar ${usuario.nome} para USER?`)) {
      this.userApiService.atualizarPerfil(usuario.id, 'USER').subscribe({
        next: () => {
          console.log(`Usuário ${usuario.id} rebaixado para USER`);
          this.mostrarMensagem(`Usuário ${usuario.nome} rebaixado para USER com sucesso!`, 'sucesso');
          this.carregarUsuariosAprovados();
        },
        error: (err) => {
          console.error(`Erro ao rebaixar usuário ${usuario.id}`, err);
          this.mostrarMensagem('Erro ao rebaixar usuário: ' + (err.error?.message || 'Tente novamente'), 'erro');
        }
      });
    }
  }

  isProprioUsuario(usuario: UsuarioAprovado): boolean {
    return usuario.email === this.emailUsuarioLogado;
  }

  private mostrarMensagem(mensagem: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }
}
