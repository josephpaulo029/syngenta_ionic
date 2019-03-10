import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { FieldforceService } from './../api/fieldforce.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logo = 'assets/img/bg_ricefields_b.png';
  constructor(
    public fforce: FieldforceService,
    private router: Router,
    public menu: MenuController,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  validation(validate) {
    if (validate.username != "" && validate.password != "") {
      return true
    } else {
      return true
    }
  }

  async login(info: NgForm) {
    console.log(info.value);
    if (this.validation(info.value)) {
      Promise.resolve(this.fforce.login(info.value)).then(data => {
        console.log(data);
        if (data) {
          this.menu.enable(true);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid username or password')
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

}
