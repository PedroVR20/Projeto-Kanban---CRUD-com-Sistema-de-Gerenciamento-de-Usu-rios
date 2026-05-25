import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroagenciasComponent } from './cadastroagencias.component';

describe('CadastroagenciasComponent', () => {
  let component: CadastroagenciasComponent;
  let fixture: ComponentFixture<CadastroagenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroagenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroagenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
