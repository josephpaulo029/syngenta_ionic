import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FieldforceService } from './api/fieldforce.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home Page',
      url: '/dashboard',
      // icon: 'home'
    },
    {
      title: 'My Account',
      url: '/account',
      // icon: 'folder'
    },
    {
      title: 'Pending Purchase Request',
      url: '/pending',
      // icon: 'folder'
    },
    {
      title: 'Logout',
      url: '/login',
      // icon: 'log-out'
    },
    // {
    //   title: 'Home',
    //   url: '/home',
    //   icon: 'home'
    // },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // }
  ];
  userDetails: any;
  dateNow: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fforce: FieldforceService,
    private router: Router,

  ) {
    this.fforce.preLoadData()

    this.initializeApp();
    this.dateNow = Date.now();
    console.log(localStorage.getItem('fieldforce') != null);
    console.log(localStorage.getItem('token') != null);
    if(localStorage.getItem('token') != null){
      this.router.navigate(['/dashboard']);
      this.userDetails = JSON.parse(localStorage.getItem('fieldforce'))
      console.log(this.userDetails)
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onClick(info) {
    console.log(info)
    if (info.url == '/login') {
      localStorage.removeItem('fieldforce');
      localStorage.removeItem('token');
    }
  }
}
