import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    public fforce: FieldforceService,
    public menuCtrl: MenuController,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    this.fforce.getTitle = 'Retailer';
  }
}
