// ==================================================================
// O ÚNICO CÓDIGO QUE DEVE ESTAR NO SEU ÚNICO task-modal.component.ts
// ==================================================================
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PedidoFormData, Column, ApiTask } from '../../models';
import { MaxYearDirective } from '../../validators/max-year.directive';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatIconModule, MaxYearDirective,
  ],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent implements OnChanges {

  @ViewChild('pedidoForm') pedidoForm!: NgForm;

  @Input() isVisible: boolean = false;
  @Input() isSubmitting: boolean = false;
  @Input() task: ApiTask | null = null;
  @Input() availableColumns: Column[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() taskSubmit = new EventEmitter<PedidoFormData>();

  public formData!: PedidoFormData;
  public isEditing = false;
  public states: string[] = ['São Paulo', 'Porto Alegre', 'Recife', 'Brasília', 'Rio de Janeiro'];

  public processStatusOptions: string[] = [
    'Aguardando preenchimento de formulário',
    'Taxa consular a recolher',
    'Agendamento concluído',
    'Orientações finalizadas',
    'Aguardando agendamento',
    'Visto aprovado',
    'Visto negado',
    'Passaporte devolvido e finalizado',
    'Documentação em análise'
  ];

  public columnOptions: { value: string; viewValue: string; }[] = [];

  constructor() {
    this.formData = this.getNewFormData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se a propriedade 'task' foi realmente alterada
    if (changes['task']) {
      
if (changes['task']) {
    console.log('%c[MODAL - DENTRO DO ngOnChanges]', 'color: blue; font-weight: bold;', {
      'Valor de this.task que chegou': this.task
    });
  }

      this.isEditing = !!this.task;
      this.setupColumnOptions();

      if (this.isEditing && this.task) {
        
        this.formData = { ...this.task };
        if (!this.formData.processStatus) {
          this.formData.processStatus = this.processStatusOptions[0];
        }
      } else {
        this.formData = this.getNewFormData();
      }

      if (this.pedidoForm) {
        this.pedidoForm.resetForm(this.formData);
      }
    }
  }

  private getNewFormData(): PedidoFormData {
    const defaultColumn = (this.availableColumns && this.availableColumns.length > 0) ? this.availableColumns[0].name : 'Aguardando';
    const defaultProcessStatus = (this.processStatusOptions && this.processStatusOptions.length > 0) ? this.processStatusOptions[0] : '';
    return {
      clientName: '', visaApplicationType: '', clientId: '', file: '', agency: '',
      agencyContact: '', hiringDate: '', state: '', casvDateTime: '',
      consulateDateTime: '', visaCountry: '', processStatus: defaultProcessStatus, editReason: ''
    };
  }

  private setupColumnOptions(): void {
    if (this.availableColumns) {
      this.columnOptions = this.availableColumns.map(col => ({ value: col.name, viewValue: col.name }));
      this.columnOptions.push({ value: 'Arquivados', viewValue: 'Arquivar Tarefa' });
    }
  }

  onStatusChange(event: MatSelectChange): void {
    const novoStatus = event.value;
    if (novoStatus === 'Passaporte devolvido e finalizado') {
      this.pedidoForm.form.updateValueAndValidity();
      if (this.pedidoForm.valid) {
        setTimeout(() => this.onSubmit(), 100);
      }
    }
  }

  onClose(): void { this.close.emit(); }

  onSubmit(): void {
    if (!this.pedidoForm.valid || this.isSubmitting) return;
    if (this.formData.processStatus === 'Passaporte devolvido e finalizado') {
      this.formData.processStatus = 'Documentação em análise';
    }
    this.taskSubmit.emit(this.formData);
  }
}
