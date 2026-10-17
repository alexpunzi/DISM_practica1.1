import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-gestionfichajes',
  templateUrl: './gestionfichajes.page.html',
  styleUrls: ['./gestionfichajes.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class GestionfichajesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
