import { Component, OnInit, Input, Output } from '@angular/core';
import { NavParams, NavController, ModalController } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  imgData: any;

  constructor(
    navParams: NavParams,
    private mediaCapture: MediaCapture,
    private imagePicker: ImagePicker,
    private nav: NavController,
    private modalCtrl: ModalController,
    public fforce: FieldforceService,

  ) {
    // componentProps can also be accessed at construction time using NavParams
  }

  ngOnInit() { }

  capture() {
    let options: CaptureImageOptions = { limit: 1 }
    this.mediaCapture.captureImage(options).then((data: MediaFile[]) => {
      // alert(JSON.stringify(data))
      this.imgData = data;
      let file = data.pop();
      let path = file.fullPath.replace('file:', '');
      // this.fforce.uploadfile(path)
      alert((JSON.stringify(this.imgData)))
      alert((JSON.stringify(path)))
      this.closeModal();
    }, (err) => { });
  }

  attachedImg() {
    var options = {
      quality: 100,
      // sourceType: sourceType,
      maximumImagesCount: 1,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
        // alert(JSON.stringify(results[i]))
        this.imgData = results[i];
      }
      this.closeModal();
    }, (err) => { });
  }

  closeModal() {
    this.modalCtrl.dismiss({ img: this.imgData });
  }

}
