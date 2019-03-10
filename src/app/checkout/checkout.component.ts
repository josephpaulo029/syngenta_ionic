import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController, AlertController } from '@ionic/angular';
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
  constructor(
    public fforce: FieldforceService,
    private router: Router,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,


  ) { }

  ngOnInit() {
    // this.membershipstatus = this.fforce.getMembershipStatus(this.fforce.getMemberData[0].tier)
    // this.cartData = this.fforce.getCartData;
    // this.totalPoints = 0
    // this.cartData.product.forEach(prod => {
    //   this.totalPoints = parseInt(this.totalPoints) + (parseInt(prod.quantity) * parseInt(prod.tierpoint))
    // });
    this.cartData = [
      {
        name: 'NK5017 - Bag',
        uom: 'Bag',
        quantity: 2,
        points: 14
      },
      {
        name: 'AGRIMEK 250 ML - Carton',
        uom: 'Bag',
        quantity: 1,
        points: 373
      },
      {
        name: 'AGRIMEK 250 ML - Carton',
        uom: 'Bag',
        quantity: 1,
        points: 373
      },
      {
        name: 'AGRIMEK 250 ML - Carton',
        uom: 'Bag',
        quantity: 1,
        points: 373
      }
    ]
  }

  async presentAlertPrompt(info) {
    const alert = await this.alertController.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'qty',
          type: 'number',
          id: 'qty',
          placeholder: 'Qty',
        }
      ],
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  editItem(index) {

  }

  removeItem(index) {
    this.cartData.product.splice(index, 1)
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
}
