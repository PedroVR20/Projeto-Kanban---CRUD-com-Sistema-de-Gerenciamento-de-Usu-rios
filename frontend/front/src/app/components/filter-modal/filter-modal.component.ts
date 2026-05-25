import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Imports do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Interface para os dados do filtro
export interface FilterData {
  clientName: string;
  clientId: string;
  file: string;
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<FilterData>();

  filterData: FilterData = {
    clientName: '',
    clientId: '',
    file: ''
  };

  onClose(): void {
    this.close.emit();
  }

  onApply(): void {
    this.apply.emit(this.filterData);
    this.onClose();
  }

  onClear(): void {
    this.filterData = {
      clientName: '',
      clientId: '',
      file: ''
    };
    this.apply.emit(this.filterData); // Aplica o filtro limpo para resetar a busca
  }
}
