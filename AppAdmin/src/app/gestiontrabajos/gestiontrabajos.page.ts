import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-gestiontrabajos',
  templateUrl: './gestiontrabajos.page.html',
  styleUrls: ['./gestiontrabajos.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GestiontrabajosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
