import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.cancelButtonText || 'Cancelar' }}</button>
      <button mat-raised-button [color]="data.confirmButtonColor || 'primary'" [mat-dialog-close]="true">{{ data.confirmButtonText || 'Confirmar' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      color: #3f51b5;
    }
    mat-dialog-content {
      padding-top: 10px;
      padding-bottom: 20px;
    }
    mat-dialog-actions {
      padding-bottom: 10px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
