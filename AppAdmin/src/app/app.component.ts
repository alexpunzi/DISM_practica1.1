/*
 * ============================================================================
 * DISM - Práctica 1: AppAdmin
 * Archivo: app.component.ts
 * Descripción: Componente principal con barra/menú lateral e importación de iconos.
 * ============================================================================
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
  IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonRouterOutlet 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, peopleOutline, briefcaseOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterModule, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, IonRouterOutlet
  ],
})
export class AppComponent {
  constructor() {
    // Registrar iconos que usaremos en el menú lateral
    addIcons({ homeOutline, peopleOutline, briefcaseOutline, timeOutline });
  }
}