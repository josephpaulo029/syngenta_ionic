import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {
  title: any;
  constructor(
    public fforce: FieldforceService,
  ) { }

  ngOnInit() {
    this.title = 'Retailer';
    this.fforce.getTitle = 'Retailer';
  }

  updateTitle(name) {
    console.log(name);
    this.fforce.getTitle = name;
    this.title = this.fforce.getTitle;
  }

}
