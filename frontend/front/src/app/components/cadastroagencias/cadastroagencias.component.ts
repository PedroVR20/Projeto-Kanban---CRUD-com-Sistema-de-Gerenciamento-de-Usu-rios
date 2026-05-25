// ==================================================================
// ARQUIVO: cadastroagencias.component.ts (VERSÃO FINAL)
// ==================================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Agency } from '../../models/agency.model';
import { AgencyService } from '../../services/agency.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, startWith, debounceTime, distinctUntilChanged, map, finalize } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm.dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cadastroagencias',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatListModule,
    MatDividerModule, MatToolbarModule, MatDialogModule, MatProgressSpinnerModule
  ],
  templateUrl: './cadastroagencias.component.html',
  styleUrl: './cadastroagencias.component.css'
})
export class CadastroagenciasComponent implements OnInit, OnDestroy {
  agencyForm!: FormGroup;
  // Esta variável não é mais a fonte da verdade, mas é útil para o filtro.
  agencies: Agency[] = [];
  filteredAgencies: Agency[] = [];
  isLoading: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
     this.agencyForm = this.fb.group({
    nome: ['', Validators.required], // ANTES: name
    cnpj: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required], // ANTES: phone
    endereco: ['', Validators.required], // ANTES: address
    searchControl: ['']
  });

    // MUDANÇA PRINCIPAL: A fonte de dados agora é o Observable do serviço.
    combineLatest([
      this.agencyService.agencies$, // Usamos o Observable reativo
      this.agencyForm.get('searchControl')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ])
    .pipe(
      takeUntil(this.destroy$),
      map(([agencies, searchTerm]: [Agency[], string]) => {
        this.agencies = agencies; // Guardamos a lista completa
        if (!searchTerm) {
          return agencies; // Se não há busca, retorna tudo
        }
        // Lógica de filtro continua a mesma
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return agencies.filter(agency =>
          agency.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
          agency.cnpj.toLowerCase().includes(lowerCaseSearchTerm) ||
          agency.email.toLowerCase().includes(lowerCaseSearchTerm)
        );
      })
    )
    .subscribe(filteredAgencies => {
      this.filteredAgencies = filteredAgencies;
      // Não precisamos mais gerenciar o isLoading aqui, o serviço já lidou com a carga.
    });

    // MUDANÇA CRÍTICA: Damos a ordem para o serviço carregar os dados da API.
    this.agencyService.loadAgencies().pipe(
      finalize(() => this.isLoading = false) // Desliga o spinner quando a operação (sucesso ou erro) terminar
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // O método onSubmit continua perfeito, pois já chama o serviço corretamente.
  onSubmit(): void {
    if (this.agencyForm.valid) {
      // Pegamos apenas os valores dos campos de cadastro, não o 'searchControl'
      const { nome, cnpj, email, telefone, endereco } = this.agencyForm.value;
    const newAgency: Omit<Agency, 'id'> = { nome, cnpj, email, telefone, endereco };

      this.agencyService.addAgency(newAgency).subscribe({
        next: () => {
        // Limpa os campos corretos
        this.agencyForm.patchValue({
          nome: '', cnpj: '', email: '', telefone: '', endereco: ''
        });
          this.agencyForm.markAsPristine();
          this.agencyForm.markAsUntouched();
        },
        error: (err) => console.error('Erro ao cadastrar agência:', err)
      });
    } else {
      this.agencyForm.markAllAsTouched();
    }
  }

  // O método deleteAgency continua perfeito.
  deleteAgency(id: string, agencyName: string): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a agência "${agencyName}"? Esta ação não pode ser desfeita.`,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.agencyService.deleteAgency(id).subscribe({
          next: () => console.log('Agência excluída com sucesso!'),
          error: (err) => console.error('Erro ao excluir agência:', err)
        });
      }
    });
  }
}
