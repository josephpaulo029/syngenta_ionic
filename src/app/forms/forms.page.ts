import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {
  title: any;
  reregister: boolean;
  activate: boolean;
  memberDetails: any;

  constructor(
    public fforce: FieldforceService,
    public menuCtrl: MenuController,

  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.reregister = false
    this.activate = false
    this.title = 'Retailer';
    this.fforce.getTitle = 'Retailer';

  }

  updateTitle(name) {
    console.log(name);
    this.fforce.getTitle = name;
    this.title = this.fforce.getTitle;
  }

  next(info: NgForm) {
    console.log(info.value)
    if (info.value.mobileno == "") {
      this.fforce.presentAlert('Kindly enter your enrolled mobile number')
    } else {
      Promise.resolve(this.fforce.checkNumber(info.value.mobileno)).then(data => {
        console.log(data);
        let res;
        res = data;
        if (res.length == 0) {
          this.fforce.presentAlert("Mobile number is invalid or doesn't exist")
        } else {
          this.activate = true
          this.reregister = false
          this.memberDetails = res;
        }

      }).catch(e => {
        console.log(e);
      });
    }
  }

}
