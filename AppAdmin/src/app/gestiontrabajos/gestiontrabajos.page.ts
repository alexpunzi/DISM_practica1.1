/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: AppAdmin
 * 
 * Archivo: gestiontrabajos.page.ts
 * Descripción: Componente para la gestión CRUD (Listar, Crear, Editar, Eliminar)
 *              de trabajos/proyectos consumiendo la API REST.
 * ============================================================================
 */

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, 
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonInput, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline, closeOutline, saveOutline } from 'ionicons/icons';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-gestiontrabajos',
  templateUrl: './gestiontrabajos.page.html',
  styleUrls: ['./gestiontrabajos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonButton, 
    IonIcon, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ]
})
export class GestiontrabajosPage implements OnInit {

  // Lista de trabajos desde MySQL
  trabajos: any[] = [];

  // Control de interfaz y formulario
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;

  // Modelo de datos para el trabajo
  trabajoForm = {
    IdTrabajo: 0,
    Nombre: ''
  };

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ addOutline, trashOutline, createOutline, closeOutline, saveOutline });
  }

  ngOnInit() {
    this.cargarTrabajos();
  }

  ionViewWillEnter() {
    this.cargarTrabajos();
  }

  // Cargar lista completa de trabajos
  cargarTrabajos() {
    this.apiService.getTrabajos().subscribe({
      next: (data: any) => {
        this.trabajos = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges(); // Fuerza el refresco visual inmediato
      },
      error: (err) => {
        console.error('Error al cargar trabajos:', err);
      }
    });
  }

  // Desplegar formulario para nuevo trabajo
  nuevoTrabajo() {
    this.modoEdicion = false;
    this.trabajoForm = { IdTrabajo: 0, Nombre: '' };
    this.mostrarFormulario = true;
  }

  // Desplegar formulario para edicion
  editarTrabajo(trabajo: any) {
    this.modoEdicion = true;
    this.trabajoForm = { ...trabajo };
    this.mostrarFormulario = true;
  }

  // Guardar (POST para nuevo, PUT para actualizar)
  guardarTrabajo() {
    if (!this.trabajoForm.Nombre || this.trabajoForm.Nombre.trim() === '') {
      alert('El nombre del trabajo es obligatorio');
      return;
    }

    if (this.modoEdicion) {
      this.apiService.updateTrabajo(this.trabajoForm.IdTrabajo, this.trabajoForm).subscribe({
        next: () => {
          this.cancelar();
          this.cargarTrabajos();
        },
        error: (err) => {
          console.error('Error al actualizar trabajo:', err);
          alert('Error al actualizar el trabajo');
        }
      });
    } else {
      this.apiService.addTrabajo(this.trabajoForm).subscribe({
        next: () => {
          this.cancelar();
          this.cargarTrabajos();
        },
        error: (err) => {
          console.error('Error al crear trabajo:', err);
          alert('Error al registrar el trabajo');
        }
      });
    }
  }

  // Borrar trabajo
  eliminarTrabajo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este trabajo?')) {
      this.apiService.deleteTrabajo(id).subscribe({
        next: () => {
          this.cargarTrabajos(); // Recarga la lista real desde MySQL tras el borrado
        },
        error: (err) => {
          console.error('Error al eliminar trabajo:', err);
          alert('Error al eliminar el trabajo');
        }
      });
    }
  }

  // Ocultar formulario
  cancelar() {
    this.mostrarFormulario = false;
    this.trabajoForm = { IdTrabajo: 0, Nombre: '' };
  }
}