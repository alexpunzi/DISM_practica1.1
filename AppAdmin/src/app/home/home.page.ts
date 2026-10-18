/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: AppAdmin
 * 
 * Archivo: home.page.ts
 * Descripción: Dashboard de inicio con métricas del sistema y accesos directos.
 * ============================================================================
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonCardContent, IonIcon, IonButton, IonBadge, IonSpinner, IonText 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  peopleOutline, briefcaseOutline, timeOutline, arrowForwardOutline, 
  checkmarkCircleOutline, alertCircleOutline, refreshOutline, pulseOutline 
} from 'ionicons/icons';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
    IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton, IonBadge, 
    IonSpinner, IonText
  ]
})
export class HomePage implements OnInit {

  totalUsuarios: number = 0;
  totalTrabajos: number = 0;
  fichajesEnCurso: number = 0;
  totalFichajes: number = 0;

  cargando: boolean = true;
  backendConectado: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ 
      peopleOutline, briefcaseOutline, timeOutline, arrowForwardOutline, 
      checkmarkCircleOutline, alertCircleOutline, refreshOutline, pulseOutline 
    });
  }

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ionViewWillEnter() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando = true;

    // Cargar usuarios
    this.apiService.getUsuarios().subscribe({
      next: (usuarios: any[]) => {
        this.totalUsuarios = Array.isArray(usuarios) ? usuarios.length : 0;
        this.backendConectado = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.backendConectado = false;
      }
    });

    // Cargar trabajos
    this.apiService.getTrabajos().subscribe({
      next: (trabajos: any[]) => {
        this.totalTrabajos = Array.isArray(trabajos) ? trabajos.length : 0;
        this.cdr.detectChanges();
      }
    });

    // Cargar fichajes
    this.apiService.getFichajes().subscribe({
      next: (fichajes: any[]) => {
        if (Array.isArray(fichajes)) {
          this.totalFichajes = fichajes.length;
          // Contar fichajes sin fecha de salida (en curso)
          this.fichajesEnCurso = fichajes.filter(f => !f.FechaHoraSalida).length;
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  navegarA(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }
}