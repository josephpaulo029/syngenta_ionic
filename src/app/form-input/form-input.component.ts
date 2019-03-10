import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ModalController } from '@ionic/angular';
import { PopoverComponent } from './../popover/popover.component';
import { FieldforceService } from '../api/fieldforce.service';
import { ModalSelectComponent } from '../modal-select/modal-select.component';

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

  constructor(
    public fforce: FieldforceService,
    private geolocation: Geolocation,
    private datePicker: DatePicker,
    private mediaCapture: MediaCapture,
    private imagePicker: ImagePicker,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,

  ) { }

  ngOnInit() {
    Promise.resolve(this.fforce.loadLocations()).then(data => {
      for (var province in data) {
        this.provinceList.push(province);
      }
      this.selectedProvince = this.provinceList[0];
      data[this.selectedProvince].forEach(city => {
        this.cityList.push(city);
      });
      this.selectedCity = this.cityList[0];
    }).catch(e => {
      console.log(e);
    });
    this.selectedGender = this.genderList[0];
    this.selectedCrop = this.cropList[0].name;

  }

  changeProvince(selectedProv) {
    this.cityList = [];
    Promise.resolve(this.fforce.loadLocations()).then(data => {
      data[selectedProv].forEach(city => {
        this.cityList.push(city);
      });
      this.selectedCity = this.cityList[0];
    }).catch(e => {
      console.log(e);
    });
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
      this.birthdate = formatDate(date, 'MMMM d, y', 'en');;
      // alert(this.birthdate)
    }).catch(err => {
      console.log('Error occurred while getting date: ', err)
    });
  }
  validation(value) {
    if (value.username) {

    }
  }

  next(info: NgForm) {
    console.log(info.value);
    let dot = /\./gi;
    let space = / /gi;

    let retailerInfo = {
      "username": info.value.username,
      "password": info.value.password,
      "email": info.value.email,
      "retailer": {
        "phone_number": info.value.mobileno,
        "first_name": info.value.fname,
        "middle_name": info.value.mname,
        "last_name": info.value.lname,
        "birthdate": info.value.birthdate,
        "gender": info.value.gender,
        "business_name": info.value.business_name,
        "address": info.value.houseunit,
        "province": info.value.province.replace(dot, "").replace(space, "_").toLowerCase(),
        "city": info.value.city.replace(dot, "").replace(space, "_").toLowerCase(),
        "barangay": info.value.barangay,
        "agree_tc": this.form[0].isChecked,
        "agree_pp": this.form[1].isChecked,
        "lat": this.fforce.location.lat,
        "lon": this.fforce.location.lon,
        "photo": this.attachments,
        "membership": info.value.membershipid
      }
    }
    console.log(retailerInfo)
    alert(JSON.stringify(retailerInfo))
  }

  selectGender(gender) {
    console.log(gender);
  }
}
