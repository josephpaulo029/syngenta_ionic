import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';
import { MenuController, AlertController } from '@ionic/angular';
import { Observable, timer, Subject } from "rxjs/";
import { take, map, takeUntil, count } from 'rxjs/operators';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {
  title: any;
  mainView: boolean;
  reregisterView: boolean;
  activateView: boolean;
  scanningView: boolean;
  newactivateView: boolean;
  verifyView: boolean;
  successView: boolean;
  changeMobile: boolean;
  changeMobileDetails: boolean;
  cmverifyView: boolean;
  cmsuccessView: boolean;
  memberDetails: any;

  counter: any;
  count = 60;
  countdown = 60;
  showTimer: boolean;
  subject = new Subject();

  constructor(
    public fforce: FieldforceService,
    public menuCtrl: MenuController,
    public alertController: AlertController,

  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.hideAll();
    this.mainView = true;
    this.title = 'Retailer';
    this.fforce.getTitle = 'Retailer';

  }

  setFormData() {
    this.countdown = this.countdown - 1;
    if (this.countdown == 0) {
      this.showTimer = false
      this.counter.unsubscribe();

    }
  }

  startTimer() {
    this.showTimer = true
    if (this.counter != undefined) {
      this.counter.unsubscribe();
      this.counter = timer(0, 1000).pipe(
        take(this.count),
        map(() => --this.count),
      ).subscribe(t => {
        this.setFormData()
      });
    } else {
      this.counter = timer(0, 1000).pipe(
        take(this.count),
        map(() => --this.count),
      ).subscribe(t => {
        this.setFormData()
      });
    }
  }

  resend() {
    this.count = 60
    this.countdown = 60
    this.startTimer()
    let resendDetails;
    resendDetails = {
      "membership": this.memberDetails.newMembership ? this.memberDetails.newMembership : this.memberDetails.membership,
      "phone_number": this.memberDetails.newNumber ? this.memberDetails.newNumber : this.memberDetails.phone_number,
      "type": this.memberDetails.type,
    }
    console.log(resendDetails)
    Promise.resolve(this.fforce.resendCode(resendDetails)).then(data => {
      console.log(data);
      this.fforce.presentSuccess("Activation code has been send to your registered mobile number")
    }).catch(e => {
      console.log(e);
    });

  }

  activate(info: NgForm) {
    console.log(info.value);
    if (info.value.code == "") {
      this.fforce.presentAlert('Please enter your SMS verification code.')
    } else {
      let activateDetails = {
        "uid": info.value.code,
        "phone_number": this.memberDetails.newNumber,
        "type": this.memberDetails.type,
      };

      Promise.resolve(this.fforce.activate(activateDetails)).then(data => {
        console.log(data);
        if (data == null) {
          this.hideAll()
          this.cmsuccessView = true
        } else {
          this.fforce.presentAlert("Invalid user id/phone number or user doesn't exist.")
        }

      }).catch(e => {
        console.log(e);
      });
    }

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
        this.memberDetails = data[0];
        console.log(this.memberDetails);

        if (this.memberDetails == undefined) {
          this.fforce.presentAlert("Mobile number is invalid or doesn't exist")
        } else {
          this.hideAll();
          this.activateView = true
        }

      }).catch(e => {
        console.log(e);
      });
    }
  }

  verify() {
    this.hideAll();
    this.successView = true
  }

  save() {
    console.log(this.memberDetails);

    let lostCardDetails;
    lostCardDetails = {
      "phone_number": this.memberDetails.phone_number,
      "membership": this.memberDetails.newMembership,
      "type": this.memberDetails.type,
    }
    Promise.resolve(this.fforce.verifyLostcard(lostCardDetails)).then(data => {
      console.log(data);
      if (data == null) {
        this.count = 60
        this.countdown = 60
        this.startTimer();
        this.hideAll();
        this.verifyView = true
      } else {
        this.fforce.presentAlert('Failed to submit request. Please try again')
      }
    }).catch(e => {
      console.log(e);
    });
  }

  activateCard(info: NgForm) {

    console.log(info.value);
    if (info.value.code == "") {
      this.fforce.presentAlert('Please enter your SMS verification code.')
    } else {
      let activateDetails = {
        "uid": info.value.code,
        "phone_number": this.memberDetails.phone_number,
        "type": this.memberDetails.type,
      };

      Promise.resolve(this.fforce.activate(activateDetails)).then(data => {
        console.log(data);
        if (data == null) {
          this.hideAll()
          this.successView = true
        } else {
          this.fforce.presentAlert("Invalid user id/phone number or user doesn't exist.")
        }

      }).catch(e => {
        console.log(e);
      });
    }

  }

  changeMobileSave(info: NgForm) {
    if (info.value.mobileno == "") {
      this.fforce.presentAlert('Please enter your new mobile number')
    } else {
      let lostPhoneDetails = {
        "phone_number": info.value.mobileno,
        "membership": this.memberDetails.membership,
        "type": this.memberDetails.type,
      }
      Promise.resolve(this.fforce.verifyLostphone(lostPhoneDetails)).then(data => {
        console.log(data);
        if (data == null) {
          this.memberDetails.newNumber = info.value.mobileno;
          this.hideAll();
          this.count = 60
          this.countdown = 60
          this.startTimer();
          this.cmverifyView = true
        } else {
          this.fforce.presentAlert('Failed to submit request. Please try again')
        }
      }).catch(e => {
        console.log(e);
      });

    }
  }

  async getResult(res) {
    console.log(res);
    if (this.scanningView == true) {
      this.memberDetails.newMembership = res
      this.hideAll();
      this.newactivateView = true
    } else if (this.changeMobile == true) {
      //validate
      await this.fforce.presentLoading('')
      Promise.resolve(this.fforce.checkMembership(res)).then(data => {
        console.log(data);
        if (!data) {
          this.fforce.loading.dismiss();
          this.fforce.presentAlert("Sorry, membership id is invalid")
        } else {
          this.fforce.loading.dismiss();
          this.memberDetails = data;
          this.hideAll();
          this.changeMobileDetails = true
        }
      }).catch(e => {
        console.log(e);
      });

    }
  }

  async presentAlertConfirm(msg) {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: msg,
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'RESEND',
          handler: () => {
            // console.log('Confirm Okay');
            this.resend();
          }
        }
      ]
    });

    await alert.present();
  }

  hideAll() {
    this.mainView = false
    this.reregisterView = false
    this.activateView = false
    this.scanningView = false
    this.newactivateView = false
    this.verifyView = false
    this.successView = false
    this.changeMobile = false
    this.changeMobileDetails = false
    this.cmverifyView = false
  }

}
