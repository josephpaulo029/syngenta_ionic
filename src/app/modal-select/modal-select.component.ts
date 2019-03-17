import { Component, OnInit, Input, Output } from '@angular/core';
import { NavParams, NavController, ModalController, MenuController } from '@ionic/angular';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-modal-select',
  templateUrl: './modal-select.component.html',
  styleUrls: ['./modal-select.component.scss'],
})
export class ModalSelectComponent implements OnInit {
  @Input() modal_title: any;
  @Input() value: any;
  @Input() type: any;
  searchText: any;
  constructor(
    navParams: NavParams,
    private nav: NavController,
    private modalCtrl: ModalController,
    public fforce: FieldforceService,
    public menuCtrl: MenuController,

  ) {
    // componentProps can also be accessed at construction time using NavParams
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    console.log(this.value);
    console.log(this.type);
    console.log(this.modal_title);

  }

  closeModal(selected) {
    let selectData;
    selectData = selected

    if (selected == '') {
      switch (this.type) {
        case 'products':
          selectData = this.fforce.chosenProduct
          break;
        case 'retailers':
          selectData = this.fforce.chosenRetailer
          break;

        default:
          break;
      }
    }
    this.modalCtrl.dismiss({ selectedData: selectData });
  }

}
