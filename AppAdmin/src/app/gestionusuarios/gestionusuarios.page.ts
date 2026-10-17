/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: AppAdmin
 * 
 * Archivo: gestionusuarios.page.ts
 * Descripción: Componente para la gestión CRUD de usuarios consumiendo la API REST.
 * ============================================================================
 */

import { Component, OnInit } from '@angular/core';
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
  selector: 'app-gestionusuarios',
  templateUrl: './gestionusuarios.page.html',
  styleUrls: ['./gestionusuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonMenuButton, IonList, IonItem, IonLabel, IonButton, 
    IonIcon, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ]
})
export class GestionusuariosPage implements OnInit {

  // Lista de usuarios traída desde MySQL
  usuarios: any[] = [];

  // Estado del formulario (Crear vs Editar)
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;

  // Modelo de datos para el formulario
  usuarioForm = {
    IdUsuario: 0,
    Nombre: '',
    Usuario: '',
    Clave: ''
  };

  constructor(private apiService: ApiService) {
    addIcons({ addOutline, trashOutline, createOutline, closeOutline, saveOutline });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  // Recargar la lista cada vez que se entra en la página en Ionic
  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  // Cargar lista de usuarios desde la API
  cargarUsuarios() {
    this.apiService.getUsuarios().subscribe({
      next: (data: any) => {
        // Asignamos creando una nueva referencia de array para actualizar la vista al instante
        this.usuarios = Array.isArray(data) ? [...data] : [];
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  // Abrir formulario para un nuevo usuario
  nuevoUsuario() {
    this.modoEdicion = false;
    this.usuarioForm = { IdUsuario: 0, Nombre: '', Usuario: '', Clave: '' };
    this.mostrarFormulario = true;
  }

  // Abrir formulario para editar un usuario existente
  editarUsuario(usuario: any) {
    this.modoEdicion = true;
    this.usuarioForm = { ...usuario, Clave: '' };
    this.mostrarFormulario = true;
  }

  // Guardar (Insertar o Actualizar)
  guardarUsuario() {
    if (!this.usuarioForm.Nombre || this.usuarioForm.Nombre.trim() === '') {
      alert('El nombre es obligatorio');
      return;
    }

    if (this.modoEdicion) {
      // Actualizar registro existente (PUT)
      this.apiService.updateUsuario(this.usuarioForm.IdUsuario, this.usuarioForm).subscribe({
        next: () => {
          this.cancelar();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          alert('Error al actualizar el usuario');
        }
      });
    } else {
      // Crear nuevo registro (POST)
      this.apiService.addUsuario(this.usuarioForm).subscribe({
        next: () => {
          this.cancelar(); // Oculta la tarjeta del formulario
          this.cargarUsuarios(); // Refresca la lista desde MySQL
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          alert('Error al crear el usuario en la base de datos');
        }
      });
    }
  }

  // Borrar usuario
  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.apiService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar usuario');
        }
      });
    }
  }

  // Ocultar y vaciar formulario
  cancelar() {
    this.mostrarFormulario = false;
    this.usuarioForm = { IdUsuario: 0, Nombre: '', Usuario: '', Clave: '' };
  }
}