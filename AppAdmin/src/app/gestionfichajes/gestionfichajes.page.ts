/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: AppAdmin
 * 
 * Archivo: gestionfichajes.page.ts
 * Descripción: Componente de consulta de fichajes con mapas Leaflet.
 * ============================================================================
 */

import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import * as L from 'leaflet';

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
export class GestionfichajesPage implements OnInit, OnDestroy {

  fichajes: any[] = [];
  
  // Guardar instancias de los mapas para poder limpiarlas al refrescar
  private mapas: { [key: number]: L.Map } = {};

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

  ngOnDestroy() {
    this.limpiarMapas();
  }

  // Destruir las instancias activas de Leaflet
  limpiarMapas() {
    Object.values(this.mapas).forEach(mapa => mapa.remove());
    this.mapas = {};
  }

  // Cargar lista de fichajes
  cargarFichajes() {
    const idUsr = this.filtros.idUsuario ? Number(this.filtros.idUsuario) : undefined;
    const fInicio = this.filtros.fechaInicio || undefined;
    const fFin = this.filtros.fechaFin || undefined;

    this.apiService.getFichajes(idUsr, fInicio, fFin).subscribe({
      next: (data: any) => {
        this.limpiarMapas(); // Eliminar mapas anteriores
        this.fichajes = Array.isArray(data) ? [...data] : [];
        this.cdr.detectChanges(); // Renderizar elementos en el DOM

        // Dar un pequeño margen para que el DOM cree los contenedores <div> del mapa
        setTimeout(() => this.inicializarMapas(), 200);
      },
      error: (err) => {
        console.error('Error al cargar fichajes:', err);
      }
    });
  }

  // Crear mapa Leaflet para cada fichaje con GPS válido
  inicializarMapas() {
    const iconoMarcador = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    this.fichajes.forEach((f) => {
      const lat = Number(f.GeolocalizacionLatitud);
      const lng = Number(f.GeolocalizacionLongitud);

      if (f.IdFichaje && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        const idContenedor = `map-${f.IdFichaje}`;
        const elementoDOM = document.getElementById(idContenedor);

        if (elementoDOM) {
          // Si el mapa ya existía en este contenedor, lo eliminamos antes de crearlo
          if (this.mapas[f.IdFichaje]) {
            this.mapas[f.IdFichaje].remove();
          }

          const map = L.map(idContenedor).setView([lat, lng], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          L.marker([lat, lng], { icon: iconoMarcador })
            .addTo(map)
            .bindPopup(`<b>${f.NombreUsuario || 'Usuario ' + f.IdUsuario}</b><br>GPS: ${lat}, ${lng}`);

          this.mapas[f.IdFichaje] = map;

          // Forzar a Leaflet a recalcular dimensiones cuando la tarjeta ya esté renderizada
          setTimeout(() => {
            map.invalidateSize();
          }, 300);
        }
      }
    });
  }

  limpiarFiltros() {
    this.filtros = {
      idUsuario: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.cargarFichajes();
  }
}