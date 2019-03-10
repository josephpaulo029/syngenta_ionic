import { filter } from 'rxjs/operators';
import { FilterProductsUsertype } from './../filter.pipe';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSelect, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FieldforceService } from '../api/fieldforce.service';
import { ModalSelectComponent } from '../modal-select/modal-select.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchases-input',
  templateUrl: './purchases-input.component.html',
  styleUrls: ['./purchases-input.component.scss'],
})
export class PurchasesInputComponent implements OnInit {

  @ViewChild('itemSelect') selectRef_product: IonSelect;
  @ViewChild('itemRetailer') selectRef_retailer: IonSelect;
  dateToday = formatDate(new Date(), 'MMMM d, y', 'en');
  selectedProduct: any;
  selectedRetailer: any;
  // memberDetails: any;
  membershipstatus: any;
  productDetails: any;
  retailerDetails: any;
  cart: any = [];
  itemQty: any;
  loading: any = new LoadingController;
  alert: any;
  purchaseInfo: any;
  constructor(
    public fforce: FieldforceService,
    private router: Router,
    public modalController: ModalController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,

  ) {
    this.fforce.chosenProduct = undefined;
    this.fforce.chosenRetailer = undefined;
    this.itemQty = 1;

  }

  ngOnInit() {
    this.membershipstatus = this.fforce.getMembershipStatus(this.fforce.getMemberData[0].tier)
  }

  openSelect(select) {
    switch (select) {
      case 'product':
        this.selectRef_product.open();
        break;

      case 'retailer':
        this.selectRef_retailer.open();
        break;

      default:
        break;
    }
  }

  checkOut(details: NgForm) {
    if (details.value.invoice == '' || details.value.invoice == null) {
      this.fforce.presentAlert('Please input you Invoice/Official Receipt Reference')
    }
    else if (this.purchaseInfo.product.length < 1) {
      this.fforce.presentToast('NO PRODUCT ON CHECKOUT')

    } else {
      this.purchaseInfo.product.forEach(prod => {
        Promise.resolve(this.getPoints(this.purchaseInfo.retailer.tier, prod)).then(data => {
          prod.tierpoint = data
        });
      });
      console.log(this.purchaseInfo)
      this.fforce.getCartData = this.purchaseInfo
      this.router.navigate(['/checkout']);
    }
  }

  getPoints(tier, product): Promise<any> {
    console.log(tier)
    console.log(product)
    let type = this.fforce.getTitle == 'Retailer' ? 'retailer' : 'grower'
    return new Promise(resolve => {
      product.points.forEach(element => {
        if (element.user_type == type && element.tier == tier) {
          let pnt = element.points
          resolve(pnt)
        }
      });
    });
  }

  addItem(details: NgForm) {
    this.purchaseInfo = details.value;
    this.purchaseInfo.product = this.cart
    this.purchaseInfo.retailer = this.fforce.getTitle == 'Retailer' ? this.fforce.getMemberData[0] : this.fforce.chosenRetailer
    this.fforce.chosenProduct.quantity = details.value.quantity == '' ? 0 : details.value.quantity
    if (this.validation(this.purchaseInfo)) {
      if (this.cart.length < 1) {
        this.cart.push(this.fforce.chosenProduct)
      } else {
        let duplicate = this.cart.find(x => x.id == this.fforce.chosenProduct.id);
        if (duplicate != undefined) {
          this.cart.forEach(prod => {
            if (prod.id == duplicate.id) {
              prod.quantity = parseInt(prod.quantity) + parseInt(this.fforce.chosenProduct.quantity)
            }
          });
        } else {
          this.cart.push(this.fforce.chosenProduct)
        }
      }

      this.fforce.presentToast('Product has been added.')
      console.log(this.cart)
      this.membershipstatus = this.fforce.getMembershipStatus(this.fforce.getMemberData[0].tier)
      this.fforce.chosenProduct = undefined;
      this.fforce.chosenRetailer = undefined
      details.resetForm({
        quantity: 1,
        uom: '',
        membership_status: this.membershipstatus,
        membershipid: this.fforce.getMemberID,
        dateToday: this.dateToday
      });
    }
  }

  validation(data) {
    switch (this.fforce.getTitle) {
      case 'Retailer':
        if (this.fforce.chosenProduct == undefined) {
          this.fforce.presentAlert('Please select product first')
          return false
        } else if (this.fforce.chosenProduct.quantity == 0) {
          this.fforce.presentAlert('Please add quantity')
          return false
        } else {
          return true
        }
      case 'Grower':
        if (this.fforce.chosenRetailer == undefined) {
          this.fforce.presentAlert('Please select a retailer')
          return false
        } else if (this.fforce.chosenProduct == undefined) {
          this.fforce.presentAlert('Please select product first')
          return false
        } else if (this.fforce.chosenProduct.quantity == 0) {
          this.fforce.presentAlert('Please add quantity')
          return false
        } else {
          return true
        }

      default:
        break;
    }
  }

  async selectModal(selection) {
    let selectionData;
    let modalTitle;
    let toString = JSON.stringify(this.fforce.productList);
    let toJSON: any[] = JSON.parse(toString);
    switch (selection) {
      case 'products':
        selectionData = new FilterProductsUsertype().transform(toJSON, this.fforce.getTitle);
        modalTitle = 'Product List';
        break;
      case 'retailers':
        selectionData = this.fforce.retailerList;
        modalTitle = 'Retailer List';
        break;

      default:
        break;
    }
    const modalselect = await this.modalController.create({
      component: ModalSelectComponent,
      componentProps: { value: selectionData, modal_title: modalTitle, type: selection },
      cssClass: ''
    });
    modalselect.present();

    await modalselect.onWillDismiss().then(data => {
      let selected;
      selected = data.data;
      console.log(selected);
      switch (selection) {
        case 'products':
          this.fforce.chosenProduct = selected.selectedData
          break;
        case 'retailers':
          this.fforce.chosenRetailer = selected.selectedData
          break;

        default:
          break;
      }

    });

  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
    });
    return await this.loading.present();
  }

}
