import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root' 
})
export class ModalService {
  private openModalSubject = new Subject<void>();
  openModal$ = this.openModalSubject.asObservable();

  constructor() { }

  private openFilterModalSubject = new Subject<void>();
  openFilterModal$ = this.openFilterModalSubject.asObservable();

  openBoardModal(): void {
    console.log('ModalService: openBoardModal() chamado. Emitindo evento...'); // <-- Adicione este log
    this.openModalSubject.next();
  }

  openFilterModal(): void {
    this.openFilterModalSubject.next();
  }

}
