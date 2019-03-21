import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { FieldforceService } from './../api/fieldforce.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, IonSlides, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logo = 'assets/img/bg_ricefields_b.png';
  forgot: boolean;

  constructor(
    public fforce: FieldforceService,
    private router: Router,
    public menuCtrl: MenuController,
    public alertController: AlertController,

  ) { }

  ngOnInit() {
    this.forgot = false;
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  validation(validate) {
    if (validate.username != "" && validate.password != "") {
      return true
    } else {
      return false
    }
  }

  async login(info: NgForm) {
    console.log(info.value);
    if (this.validation(info.value)) {
      Promise.resolve(this.fforce.login(info.value)).then(data => {
        console.log(data);
        if (data) {
          this.menuCtrl.enable(true);
          this.router.navigate(['/dashboard']);
        } else {
          this.fforce.presentAlert('Invalid username or password')
        }
        // alert(JSON.stringify(data));
      }).catch(e => {
        console.log(e);
      });
    } else {
      this.fforce.presentAlert('Please input username and password')
      // this.fforce.presentToast('Please input username and password')
    }
  }

  forgotPass(data: NgForm) {
    console.log(data.value)

    if (data.value.email == "") {
      this.fforce.presentAlert('Kindly enter your email address')
    } else {
      Promise.resolve(this.fforce.forgotpassword(data.value)).then(data => {
        console.log(data);
        if (data == null) {
          this.presentAlertConfirm("Forgot password request success. Kindly check your email for steps to reset your password.")
        } else {
          this.fforce.presentAlert('Enter a valid email address.')
        }
      }).catch(e => {
        console.log(e);
      });
    }
  }

  async presentAlertConfirm(msg) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
            this.forgot = false

          }
        }
      ]
    });
    await alert.present();
  }
}
