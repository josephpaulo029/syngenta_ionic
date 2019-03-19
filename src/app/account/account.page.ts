import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  accountDetails: any;

  constructor(
    public menuCtrl: MenuController,

  ) { }

  ngOnInit() {
    this.accountDetails = JSON.parse(localStorage.getItem('fieldforce'))
    console.log(this.accountDetails)
    // let a;
    // let b;
    // a = this.accountDetails.region.split("_")
    // if (a.lenth > 0) {
    //   this.accountDetails.region = a[0].charAt(0).toUpperCase() + a[0].substr(1).toLowerCase()
    // }
    // console.log(a);
    // console.log(a[0]);
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

}
