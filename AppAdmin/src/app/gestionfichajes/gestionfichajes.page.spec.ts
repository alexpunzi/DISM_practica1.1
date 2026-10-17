import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionfichajesPage } from './gestionfichajes.page';

describe('GestionfichajesPage', () => {
  let component: GestionfichajesPage;
  let fixture: ComponentFixture<GestionfichajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionfichajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
