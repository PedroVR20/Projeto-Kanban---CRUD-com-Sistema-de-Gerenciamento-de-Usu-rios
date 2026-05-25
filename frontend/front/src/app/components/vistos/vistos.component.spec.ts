import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoosComponent } from './vistos.component';

describe('VoosComponent', () => {
  let component: VoosComponent;
  let fixture: ComponentFixture<VoosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
