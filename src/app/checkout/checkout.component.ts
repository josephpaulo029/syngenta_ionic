import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FieldforceService } from '../api/fieldforce.service';
import { ModalSelectComponent } from '../modal-select/modal-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  dateToday = formatDate(new Date(), 'MMMM d, y', 'en');
  membershipstatus: any;
  numberofAttach: any = 0;
  attachments: any = [];
  cartData: any;
  totalPoints: any;
  submitted: boolean;
  transDetails: any;

  constructor(
    public fforce: FieldforceService,
    private router: Router,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    public menuCtrl: MenuController,

  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    this.submitted = false
    this.membershipstatus = this.fforce.getMembershipStatus(this.fforce.getMemberData[0].tier)
    this.cartData = this.fforce.getCartData;
    await this.getTotal()
    
  }

  getTotal() {
    this.totalPoints = 0
    this.cartData.product.forEach(prod => {
      this.totalPoints = parseInt(this.totalPoints) + (parseInt(prod.quantity) * parseInt(prod.tierpoint))
    });
  }

  removeItem(index) {
    // this.cartData.product.splice(index, 1)
    this.cartData.product.splice(index, 1)
  }

  async endTrans() {
    let productData = [];
    let params;
    console.log(this.cartData)
    this.cartData.product.forEach(prod => {
      params = {
        id: prod.id,
        quantity: prod.quantity
      }
      productData.push(params)
    });
    switch (this.fforce.getTitle) {
      case 'Retailer':
        this.transDetails = {
          "membership": this.cartData.membershipid,
          "products": productData,
          "receipt_number": this.cartData.invoice,
          "receipt_photo": "https://cushyfy.com/images/logo.png",
          "remarks": this.cartData.remarks,
        }
        this.presentAlertConfirm('Are you sure you want to END THIS TRANSACTION?')
        break;

      case 'Grower':
        this.transDetails = {
          "membership": this.cartData.membershipid,
          "products": productData,
          "receipt_number": this.cartData.invoice,
          "receipt_photo": "https://cushyfy.com/images/logo.png",
          "remarks": this.cartData.remarks,
          "receipt_from": this.cartData.retailer.id,
        }
        this.presentAlertConfirm('Are you sure you want to END THIS TRANSACTION?')
        break;

      default:
        break;
    }
    console.log(this.transDetails)

  }

  saveTrans(info) {
    if (this.fforce.getTitle == 'Retailers') {
      Promise.resolve(this.fforce.retailerClaim(info)).then(data => {
        console.log(data);
        if (data == null) {
          this.submitted = true
        }
        // alert(JSON.stringify(data));
      }).catch(e => {
        console.log(e);
      });
    } else {
      Promise.resolve(this.fforce.growerClaim(info)).then(data => {
        console.log(data);
        if (data == null) {
          this.submitted = true
        }
        // alert(JSON.stringify(data));
      }).catch(e => {
        console.log(e);
      });
    }
  }

  async editItem(info) {
    console.log(info)
    const myModal = await this.modalController.create({
      component: PopoverComponent,
      cssClass: 'editqty-css',
      componentProps: { type: 'editqty', value: info },
      backdropDismiss: false,
    });
    myModal.present();

    const { data } = await myModal.onWillDismiss();
    console.log(data)
    let updatedQty = data.qty

    if (updatedQty != undefined) {
      await this.cartData.product.forEach(prod => {
        if (prod.id == info.id) {
          prod.quantity = updatedQty;
        }
      });

      this.getTotal()
    }
    console.log(this.cartData)
  }

  async imgModal() {
    const myModal = await this.modalController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-modal-css',
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
          text: 'OK',
          handler: () => {
            this.saveTrans(this.transDetails)
            // console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
}
