import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    public fforce: FieldforceService,
  ) { }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log("I'm alive!");
    this.fforce.getTitle = 'Retailer';
  }
}
