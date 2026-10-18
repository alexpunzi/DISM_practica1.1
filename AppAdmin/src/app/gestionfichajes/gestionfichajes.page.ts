/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: AppAdmin
 * 
 * Archivo: gestionfichajes.page.ts
 * Descripción: Componente para consultar y filtrar el historial global
 *              de fichajes de empleados consumiendo la API REST.
 * ============================================================================
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, 
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
  IonBadge 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  searchOutline, refreshOutline, timeOutline, personOutline, 
  constructOutline, locationOutline 
} from 'ionicons/icons';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-gestionfichajes',
  templateUrl: './gestionfichajes.page.html',
  styleUrls: ['./gestionfichajes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonButton, 
    IonIcon, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonBadge
  ]
})
export class GestionfichajesPage implements OnInit {

  // Listado de fichajes recuperados
  fichajes: any[] = [];

  // Filtros de búsqueda
  filtros = {
    idUsuario: '',
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ 
      searchOutline, refreshOutline, timeOutline, personOutline, 
      constructOutline, locationOutline 
    });
  }

  ngOnInit() {
    this.cargarFichajes();
  }

  ionViewWillEnter() {
    this.cargarFichajes();
  }

  // Cargar lista filtrada de fichajes
  cargarFichajes() {
    const idUsr = this.filtros.idUsuario ? Number(this.filtros.idUsuario) : undefined;
    const fInicio = this.filtros.fechaInicio || undefined;
    const fFin = this.filtros.fechaFin || undefined;

    this.apiService.getFichajes(idUsr, fInicio, fFin).subscribe({
      next: (data: any) => {
        this.fichajes = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges(); // Refresco inmediato en el DOM
      },
      error: (err) => {
        console.error('Error al cargar fichajes:', err);
      }
    });
  }

  // Limpiar campos de filtro y recargar listado completo
  limpiarFiltros() {
    this.filtros = {
      idUsuario: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.cargarFichajes();
  }
}