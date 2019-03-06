import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FieldforceService } from '../api/fieldforce.service';
import { ModalSelectComponent } from '../modal-select/modal-select.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchases-input',
  templateUrl: './purchases-input.component.html',
  styleUrls: ['./purchases-input.component.scss'],
})
export class PurchasesInputComponent implements OnInit {

  @ViewChild('itemSelect') selectRef_product: IonSelect;
  @ViewChild('itemRetailer') selectRef_retailer: IonSelect;
  dateToday = formatDate(new Date(), 'MMMM d, y', 'en');
  selectedProduct: any;
  selectedRetailer: any;

  constructor(
    public fforce: FieldforceService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.selectedProduct = "Select Product";
  }

  openSelect(select) {
    switch (select) {
      case 'product':
        this.selectRef_product.open();
        break;

      case 'retailer':
        this.selectRef_retailer.open();
        break;

      default:
        break;
    }
  }

  checkOut() {
    this.router.navigate(['/checkout']);
  }

  addItem() {

  }

}
