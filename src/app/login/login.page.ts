import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FieldforceService } from './../api/fieldforce.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  ) { }

  ngOnInit() {
    Promise.resolve(this.fforce.getMessages()).then(data => {
      // alert(data)
    }).catch(e => {
      console.log(e);
    });
  }

  validation(validate) {
    if (validate.username != "" && validate.password != "") {
      return true
    } else {
      return false
    }
  }

  login(info: NgForm) {
    console.log(info.value);
    if (this.validation(info.value)) {
      Promise.resolve(this.fforce.login(info.value)).then(data => {
        console.log(data);
        if (data) {
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid username or password')
        }
        // alert(JSON.stringify(data));
      }).catch(e => {
        console.log(e);
      });
    } else {
      alert('Please input username and password')
    }
  }

}
