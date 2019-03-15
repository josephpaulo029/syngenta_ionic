import { Component, VERSION, OnInit, EventEmitter, ViewChild, Output, Input } from '@angular/core';
import { ZXingScannerComponent } from '../modules/zxing-scanner/zxing-scanner.component';
import { Result } from '@zxing/library';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldforceService } from '../api/fieldforce.service';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnInit {

  ngVersion = VERSION.full;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;
  @Input() menu: any;
  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo;

  scanDetails: any = null;
  qrData: any = null;
  createdCode: any = null;
  scannedCode: any = null;
  loading: any = LoadingController;
  alert: any;

  constructor(
    private router: Router,
    private fforce: FieldforceService,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
  ) { }

  ngOnInit(): void {
    this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
    this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
    console.log(this.menu)
    this.fforce.getMemberID = undefined;
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;
      // console.log(this.availableDevices);
      this.availableDevices.forEach(element => {
        // alert(element.label);
      });

      if (this.availableDevices.length > 1) {
        this.onDeviceSelectChange(this.availableDevices[1].deviceId);
      } else {
        this.onDeviceSelectChange(this.availableDevices[0].deviceId);
      }
      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.currentDevice = device;
      //         break;
      //     }
      // }
    });
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
    });
    return await this.loading.present();
  }

  async presentAlert(msg) {
    this.alert = await this.alertController.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });
    this.alert.present();
  }

  async scanCard(cardno: NgForm) {
    this.fforce.getMemberData = undefined;
    this.qrResultString = cardno.value.qrResultString;
    // if (this.menu == 'purchases') {
      if (this.fforce.getTitle == 'Retailer') {
        this.qrResultString = '6508985944667841'
      } else {
        this.qrResultString = '5186648475664505'
      }
    // }
    let scanParams = {
      memberid: this.qrResultString,
      type: this.fforce.getTitle == 'Retailer' ? 'retailers' : 'growers'
    }
    if (this.qrResultString != undefined && this.qrResultString != '') {
      switch (this.menu) {
        case 'forms':
          this.fforce.getMemberID = this.qrResultString;
          this.router.navigate(['/forminput']);
          break;
        case 'purchases':
          Promise.resolve(this.fforce.memberidVerification(scanParams)).then(data => {
            // alert(data)
            console.log(data);
            if (data != false) {
              this.fforce.getMemberData = data;
              this.fforce.getMemberID = this.qrResultString;
              this.router.navigate(['/purchasesinput']);
            } else {
              this.presentAlert('Sorry, membership id is invalid');
            }
          }).catch(e => {
            console.log(e);
          });
          break;

        default:
          break;
      }

    } else {
      this.presentAlert('Please scan or enter your card number.')
    }


  }

  errorMsg(msg) {
    alert(msg);
  }

  displayCameras(cameras: MediaDeviceInfo[]) {
    console.debug('Devices: ', cameras);
    this.availableDevices = cameras;
  }

  handleQrCodeResult(resultString: string) {
    console.debug('Result: ', resultString);
    this.qrResultString = resultString;

  }

  onDeviceSelectChange(selectedValue: string) {
    // alert('Selection changed: ' + ' ' + selectedValue);
    this.currentDevice = this.scanner.getDeviceById(selectedValue);
  }

  stateToEmoji(state: boolean): string {

    const states = {
      // not checked
      undefined: '❔',
      // failed to check
      null: '⭕',
      // success
      true: '✔',
      // can't touch that
      false: '❌'
    };

    return states['' + state];
  }

}
