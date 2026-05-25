import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

// 1. IMPORTAÇÕES NOVAS PARA O MODAL E NOTIFICAÇÕES
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { VistosApiService } from '../../services/vistos-api.service';
import { UserDataService } from '../../services/user-data.service';
import { VistoResponse } from '../../models/visto.model';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component'; // Importa o novo componente de diálogo

@Component({
  selector: 'app-vistos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    // 2. ADICIONAR OS MÓDULOS NOVOS
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './vistos.component.html',
  styleUrls: ['./vistos.component.css']
})
export class VistosComponent implements OnInit {

  public vistos: VistoResponse[] = [];
  public carregando = true;
  public erro: string | null = null;
  public isAdmin = false;
  public nomeNovoVisto = '';

  constructor(
    private vistosApiService: VistosApiService,
    private userDataService: UserDataService,
    // 3. INJETAR OS SERVIÇOS DE DIALOG E SNACKBAR
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.userDataService.isUserMaster();

    this.carregarVistos();
  }

  public carregarVistos(): void {
    this.carregando = true;
    this.erro = null;
    this.vistosApiService.getVistos().subscribe({
      next: (data) => {
        this.vistos = data;
        this.carregando = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar vistos:', err);
        this.erro = 'Falha ao carregar os vistos. Verifique sua conexão ou se a API está online.';
        this.carregando = false;
      }
    });
  }

  public criarVisto(): void {
    if (!this.nomeNovoVisto.trim()) {
      return;
    }
    this.vistosApiService.createVisto({ nome: this.nomeNovoVisto }).subscribe({
      next: () => {
        this.snackBar.open('Visto criado com sucesso!', 'Fechar', { duration: 3000 });
        this.nomeNovoVisto = '';
        this.carregarVistos();
      },
      error: (err) => {
        console.error('Erro ao criar visto:', err);
        this.snackBar.open('Erro ao criar o visto. Tente novamente.', 'Fechar', { duration: 5000 });
      }
    });
  }

  // 4. NOVO MÉTODO PARA EXCLUIR VISTO USANDO O MODAL
  public excluirVisto(id: string, nomeVisto: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        title: 'Confirmar Exclusão', 
        message: `Tem certeza que deseja excluir permanentemente o visto "${nomeVisto}"?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Se o usuário confirmou no modal
        this.vistosApiService.deleteVisto(id).subscribe({
          next: () => {
            this.snackBar.open('Visto excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.carregarVistos(); 
          },
          error: (err) => {
            console.error(`Erro ao excluir visto:`, err);
            this.snackBar.open('Erro ao excluir o visto. Verifique suas permissões.', 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }
}
