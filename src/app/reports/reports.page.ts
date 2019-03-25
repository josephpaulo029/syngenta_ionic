import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  title: any;
  // searchText: any;
  // reports: any;
  constructor(
    public fforce: FieldforceService,
    public menuCtrl: MenuController,

  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.title = 'Retailer';
    this.fforce.getTitle = 'Retailer';
    // let reportsDetails = {
    //   type: "retailers",
    //   id: "94",
    //   param: "fieldforce",
    // }
    // Promise.resolve(this.fforce.getReports(reportsDetails)).then(data => {
    //   console.log(data);

    // }).catch(e => {
    //   console.log(e);
    // });
  }

  updateTitle(name) {
    console.log(name);
    this.fforce.getTitle = name;
    this.title = this.fforce.getTitle;
  }

}
