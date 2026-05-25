import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarPerfisComponent } from './gerenciar-perfis.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from '../../auth.interceptor';

describe('GerenciarPerfisComponent', () => {
  let component: GerenciarPerfisComponent;
  let fixture: ComponentFixture<GerenciarPerfisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarPerfisComponent],
      providers: [
        provideHttpClient(withInterceptors([AuthInterceptor]))
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarPerfisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
