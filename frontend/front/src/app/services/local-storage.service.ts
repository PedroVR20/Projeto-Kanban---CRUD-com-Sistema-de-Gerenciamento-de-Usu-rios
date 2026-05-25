import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Column } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  saveColumns(columns: Column[]): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem('kanbanColumns', JSON.stringify(columns));
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
    }
  }

  loadColumns(): Column[] | null {
    if (this.isBrowser) {
      try {
        const savedColumns = localStorage.getItem('kanbanColumns');
        if (savedColumns) {
          return JSON.parse(savedColumns) as Column[];
        }
      } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
      }
    }
    return null;
  }
}

