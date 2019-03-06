import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FieldforceService } from '../api/fieldforce.service';
import { ModalSelectComponent } from '../modal-select/modal-select.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  dateToday = formatDate(new Date(), 'MMMM d, y', 'en');

  constructor(
    public fforce: FieldforceService,
    private router: Router,
  ) { }

  ngOnInit() { }

}
