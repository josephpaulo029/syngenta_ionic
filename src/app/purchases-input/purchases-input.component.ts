import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect } from '@ionic/angular';
import { FieldforceService } from '../api/fieldforce.service';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-purchases-input',
  templateUrl: './purchases-input.component.html',
  styleUrls: ['./purchases-input.component.scss'],
})
export class PurchasesInputComponent implements OnInit {

  constructor(
    public fforce: FieldforceService,
  ) { }

  ngOnInit() {}

}
