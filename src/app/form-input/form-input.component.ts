import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController, ToastController, AlertController, MenuController } from '@ionic/angular';
import { formatDate, LocationStrategy } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ModalController } from '@ionic/angular';
import { PopoverComponent } from './../popover/popover.component';
import { FieldforceService } from '../api/fieldforce.service';
import { ModalSelectComponent } from '../modal-select/modal-select.component';
import { Observable, timer, Subject } from "rxjs/";
import { take, map, takeUntil, count } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements OnInit {
  data: any;
  dateToday = formatDate(new Date(), 'MMMM d, y', 'en');
  details: NgForm;
  selectedGender: any;
  selectedProvince: any;
  selectedCity: any;
  selectedCrop: any;
  selectedBirthdate: any;
  location: any;
  @ViewChild('genderSelect') selectRef_gender: IonSelect;
  @ViewChild('provinceSelect') selectRef_province: IonSelect;
  @ViewChild('citySelect') selectRef_city: IonSelect;
  @ViewChild('cropSelect') selectRef_crop: IonSelect;

  public form = [
    { name: 'agree_tc', val: 'I agree to the Terms & Conditions of Syngenta Tiwala Loyalty Program', isChecked: false },
    { name: 'agree_pp', val: 'I agree that the information provided above can be processed in the manner as described in our Privacy Policy', isChecked: false },
    { name: 'chkbx3', val: 'I would like to receive SMS updates from Syngenta. For more information on how Syngenta uses and protects your data. Please click here to Privacy Policy', isChecked: false }
  ];

  public cropList = [
    { id: 1, name: "Rice" },
    { id: 2, name: "Corn" },
    { id: 3, name: "Mango" },
    { id: 4, name: "Banana" },
    { id: 5, name: "Vegetables" },
  ];

  genderList = ["Male", "Female"];
  provinceList: any = [];
  cityList: any = [];
  latlong: any;
  locationList: any;
  birthdate: any;
  numberofAttach: any = 0;
  attachments: any = [];
  loading: any;
  submitted: boolean;
  verified: boolean;

  counter: any;
  count = 60;
  countdown = 60;
  showTimer: boolean;
  subject = new Subject();
  retailerDetails: any;
  growerDetails: any;

  constructor(
    public fforce: FieldforceService,
    private geolocation: Geolocation,
    private datePicker: DatePicker,
    private mediaCapture: MediaCapture,
    private imagePicker: ImagePicker,
    private router: Router,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public menuCtrl: MenuController,

  ) {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    this.submitted = false
    this.verified = false


    await this.getLocs()

    this.selectedGender = this.genderList[0];
    this.selectedCrop = this.cropList[0].name;
    this.selectedBirthdate = "";
  }

  getLocs() {
    for (var province in this.fforce.locationList) {
      this.provinceList.push(province);
    }
    this.selectedProvince = this.provinceList[0];
    this.fforce.locationList[this.selectedProvince].forEach(city => {
      this.cityList.push(city);
    });
    this.selectedCity = this.cityList[0];
  }

  changeProvince(selectedProv) {
    this.cityList = [];
    this.fforce.locationList[selectedProv].forEach(city => {
      this.cityList.push(city);
    });
    this.selectedCity = this.cityList[0];
  }

  async imgModal() {
    const myModal = await this.modalController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-modal-css'
    });
    myModal.present();

    const { data } = await myModal.onWillDismiss();
    if (data != null) {
      this.attachments = [];
      this.attachments.push(data);
      // alert(JSON.stringify(this.attachments));
    }
    this.numberofAttach = this.attachments.length;

    // alert(JSON.stringify(this.numberofAttach));
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: '',
    });
    this.loading.present();
    this.loading.dismiss();

  }

  openSelect(select) {
    switch (select) {
      case 'gender':
        this.selectRef_gender.open();
        break;
      case 'province':
        this.selectRef_province.open();
        break;
      case 'city':
        this.selectRef_city.open();
        break;
      case 'crop':
        this.selectRef_crop.open();
        break;

      default:
        break;
    }
  }

  openDate() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {
      this.selectedBirthdate = formatDate(date, 'MMMM d, y', 'en');;
    }).catch(err => {
      console.log('Error occurred while getting date: ', err)
    });
  }

  convertDate(date) {
    let newDate = formatDate(new Date(date), 'yyyy-MM-d', 'en')
    return newDate
  }

  next(info: NgForm) {
    console.log(info.value);
    // alert(JSON.stringify(info.value))

    let dot = /\./gi;
    let space = / /gi;

    switch (this.fforce.getTitle) {
      case 'Retailers':
        let retailerInfo = {
          "username": info.value.username,
          "password": info.value.password,
          "email": info.value.email,
          "retailer": {
            "phone_number": info.value.mobileno,
            "first_name": info.value.fname,
            "middle_name": info.value.mname,
            "last_name": info.value.lname,
            "birthdate": this.selectedBirthdate == "" ? "" : this.convertDate(this.selectedBirthdate),
            "gender": info.value.gender == 'Male' ? '1' : '2',
            "business_name": info.value.business_name,
            "address": info.value.houseunit,
            "province": info.value.province.replace(dot, "").replace(space, "_").toLowerCase(),
            "city": info.value.city.replace(dot, "").replace(space, "_").toLowerCase(),
            "barangay": info.value.barangay,
            "agree_tc": this.form[0].isChecked,
            "agree_pp": this.form[1].isChecked,
            "lat": Math.round(this.fforce.location.lat * 100000) / 100000,
            "lon": Math.round(this.fforce.location.lon * 100000) / 100000,
            "photo": "https://cushyfy.com/images/logo.png",
            "referrer": info.value.referralcode == "" ? undefined : info.value.referralcode,
            "membership": info.value.membershipid
          }
        }
        this.retailerDetails = retailerInfo;
        // alert(JSON.stringify(retailerInfo))

        if (retailerInfo.username == "" || retailerInfo.password == "" || retailerInfo.email == "" || retailerInfo.retailer.first_name == "" || retailerInfo.retailer.middle_name == "" || retailerInfo.retailer.last_name == "" || retailerInfo.retailer.birthdate == "" || retailerInfo.retailer.business_name == "" || retailerInfo.retailer.address == "" || retailerInfo.retailer.barangay == "" || retailerInfo.retailer.phone_number == "") {
          this.fforce.presentAlert('Please fill out all required fields.')
        } else if (retailerInfo.retailer.photo == "") {
          this.fforce.presentAlert('Please attached photo')
        } else if (retailerInfo.password.length < 8) {
          this.fforce.presentAlert('Password must be 8 characters long.')
        } else if (retailerInfo.password != info.value.rpassword) {
          this.fforce.presentAlert('Confirm password did not match.')
        } else if (!this.form[0].isChecked) {
          this.fforce.presentAlert('Please tick Terms and Conditions')
        } else if (!this.form[1].isChecked) {
          this.fforce.presentAlert('Please tick Privacy Policy')
        } else if (!this.form[2].isChecked) {
          this.fforce.presentAlert('Please tick SMS Update')
        } else {
          Promise.resolve(this.fforce.createRetailer(retailerInfo)).then(data => {
            console.log(data);
            let response;
            response = data;
            if (response.id) {
              this.fforce.presentToast('Retailer account has been created.')
              this.submitted = true
              this.startTimer()

              console.log(this.submitted)
            } else if (response.username) {
              this.fforce.presentAlert('Failed to create retailer. Username already exist.')
            } else if (response.retailer) {
              if (response.retailer.membership) {
                this.fforce.presentAlert('Failed to create retailer. Membership id already exist.')
              } else if (response.retailer.referrer) {
                this.fforce.presentAlert('Failed to create retailer. ' + response.retailer.referrer[0])
              } else if (response.retailer.phone_number) {
                this.fforce.presentAlert('Failed to create retailer. Mobile number already exist.')
              }
            } else if (response.password) {
              this.fforce.presentAlert('Password is too common.')
            } else if (response.email) {
              this.fforce.presentAlert('Failed to create retailer. Email already registered.')
            }
            // alert(JSON.stringify(data));
          }).catch(e => {
            console.log(e);
          });
        }
        console.log(retailerInfo)
        break;

      case 'Growers':
        let growersInfo = {
          "phone_number": info.value.mobileno,
          "first_name": info.value.fname,
          "middle_name": info.value.mname,
          "last_name": info.value.lname,
          "address": info.value.houseunit,
          "birthdate": this.selectedBirthdate == "" ? "" : this.convertDate(this.selectedBirthdate),
          "gender": info.value.gender == 'Male' ? '1' : '2',
          "province": info.value.province.replace(dot, "").replace(space, "_").toLowerCase(),
          "city": info.value.city.replace(dot, "").replace(space, "_").toLowerCase(),
          "barangay": info.value.barangay,
          "crop": (info.value.crop).toLowerCase(),
          "ha_fbt": info.value.hafbt,
          "agree_tc": this.form[0].isChecked,
          "agree_pp": this.form[1].isChecked,
          "agree_updates": this.form[2].isChecked,
          "photo": "https://cushyfy.com/images/logo.png",
          "referrer": info.value.referralcode == "" ? undefined : info.value.referralcode,
          "membership": info.value.membershipid,
        }

        this.growerDetails = growersInfo;

        if (growersInfo.first_name == "" || growersInfo.middle_name == "" || growersInfo.last_name == "" || growersInfo.gender == "" || growersInfo.birthdate == "" || growersInfo.address == "" || growersInfo.barangay == "" || growersInfo.ha_fbt == "" || growersInfo.phone_number == "") {
          this.fforce.presentAlert('Please fill out all required fields.')
        } else if (growersInfo.photo == "") {
          this.fforce.presentAlert('Please attached photo')
        } else if (!this.form[0].isChecked) {
          this.fforce.presentAlert('Please tick Terms and Conditions')
        } else if (!this.form[1].isChecked) {
          this.fforce.presentAlert('Please tick Privacy Policy')
        } else if (!this.form[2].isChecked) {
          this.fforce.presentAlert('Please tick SMS Update')
        } else {
          Promise.resolve(this.fforce.createGrower(growersInfo)).then(data => {
            console.log(data);
            let response;
            response = data;
            if (response.id) {
              this.fforce.presentToast('Grower account has been created.')
              this.submitted = true
              this.startTimer()

              console.log(this.submitted)
            } else if (response.phone_number) {
              this.fforce.presentAlert('Failed to create grower. Mobile number already exist.')
            } else if (response.membership) {
              this.fforce.presentAlert('Failed to create grower. Membership id - ' + response.membership[0])
            } else if (response.referrer) {
              this.fforce.presentAlert('Failed to create grower. Membership id - ' + response.referrer[0])
            }
            // alert(JSON.stringify(data));
          }).catch(e => {
            console.log(e);
          });
        }
        console.log(growersInfo)
        break;

      default:
        break;
    }



    // alert(JSON.stringify(retailerInfo))
  }

  setFormData() {
    this.countdown = this.countdown - 1;
    if (this.countdown == 0) {
      this.showTimer = false
    }
    // console.log('Done', this.countdown)
    this.subject.next();
  }

  startTimer() {
    this.showTimer = true

    this.counter = timer(0, 1000).pipe(
      take(this.count),
      map(() => --this.count),
      // takeUntil(this.subject),
    ).subscribe(t => {
      this.setFormData()
    });
  }

  activate(info: NgForm) {
    console.log(info.value);
    if (info.value.code == "") {
      this.fforce.presentAlert('Please enter your SMS verification code.')
    } else {
      let activateDetails;
      switch (this.fforce.getTitle) {
        case 'Retailers':
          activateDetails = {
            "uid": info.value.code,
            "phone_number": this.retailerDetails.retailer.phone_number,
            "type": 'retailers'
          }
          console.log(activateDetails)
          Promise.resolve(this.fforce.activate(activateDetails)).then(data => {
            console.log(data);
            if (data == null) {
              this.verified = true
              this.submitted = false
            } else {
              this.fforce.presentAlert("Invalid user id/phone number or user doesn't exist.")
            }

          }).catch(e => {
            console.log(e);
          });
          break;

        case 'Growers':
          activateDetails = {
            "uid": info.value.code,
            "phone_number": this.growerDetails.phone_number,
            "type": 'growers'
          }
          console.log(activateDetails)
          Promise.resolve(this.fforce.activate(activateDetails)).then(data => {
            console.log(data);
            if (data == null) {
              this.verified = true
              this.submitted = false
            } else {
              this.fforce.presentAlert("Invalid user id/phone number or user doesn't exist.")
            }

          }).catch(e => {
            console.log(e);
          });
          break;

        default:
          break;
      }


    }

  }

  resend() {
    this.count = 60
    this.countdown = 60
    console.log('resend')
    console.log(this.count)
    console.log(this.countdown)
    this.startTimer()
    let resendDetails;
    switch (this.fforce.getTitle) {
      case 'Retailers':
        resendDetails = {
          "membership": this.retailerDetails.retailer.membership,
          "phone_number": this.retailerDetails.retailer.phone_number,
          "type": 'retailers'
        }
        console.log(resendDetails)
        Promise.resolve(this.fforce.resendCode(resendDetails)).then(data => {
          console.log(data);
          this.fforce.presentSuccess("Activation code has been send to your registered mobile number")
        }).catch(e => {
          console.log(e);
        });
        break;

      case 'Growers':
        resendDetails = {
          "membership": this.growerDetails.membership,
          "phone_number": this.growerDetails.phone_number,
          "type": 'growers'
        }
        console.log(resendDetails)
        Promise.resolve(this.fforce.resendCode(resendDetails)).then(data => {
          console.log(data);
          this.fforce.presentSuccess("Activation code has been send to your registered mobile number")
        }).catch(e => {
          console.log(e);
        });
        break;

      default:
        break;
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

  selectGender(gender) {
    console.log(gender);
  }
}
