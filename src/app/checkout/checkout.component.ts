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

  async ngOnInit() {
    this.membershipstatus = this.fforce.getMembershipStatus(this.fforce.getMemberData[0].tier)
    this.cartData = this.fforce.getCartData;
    await this.getTotal()
    // this.cartData = [
    //   {
    //     id: 1,
    //     name: 'NK5017 - Bag',
    //     uom: 'Bag',
    //     quantity: 2,
    //     tierpoint: 14
    //   },
    //   {
    //     id: 2,
    //     name: 'AGRIMEK 250 ML - Carton',
    //     uom: 'Bag',
    //     quantity: 1,
    //     tierpoint: 373
    //   },
    //   {
    //     id: 3,
    //     name: 'AGRIMEK 250 ML - Carton',
    //     uom: 'Bag',
    //     quantity: 1,
    //     tierpoint: 373
    //   },
    //   {
    //     id: 4,
    //     name: 'AGRIMEK 250 ML - Carton',
    //     uom: 'Bag',
    //     quantity: 1,
    //     tierpoint: 373
    //   }
    // ]
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
}
