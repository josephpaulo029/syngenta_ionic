import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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

  userDetails = {
    id: 1,
    name: 'John Doe',
    userImg: 'assets/img/profile_user.jpg',
    userType: 'Admin',
    memberID: 'f000001',
    date: 'February 21, 2019',
    time: '10:30 AM'
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
