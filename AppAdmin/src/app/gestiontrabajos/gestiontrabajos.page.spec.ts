import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestiontrabajosPage } from './gestiontrabajos.page';

describe('GestiontrabajosPage', () => {
  let component: GestiontrabajosPage;
  let fixture: ComponentFixture<GestiontrabajosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestiontrabajosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
