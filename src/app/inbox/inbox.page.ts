import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  inboxData: any;
  viewer: boolean;
  selectedMsg: any;

  constructor(
    public fforce: FieldforceService,

  ) { }

  ngOnInit() {
    this.viewer = false;
    this.messages()
    // this.inboxData = [
    //   {
    //     "subject": "Sample",
    //     "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus, quam a tincidunt convallis, arcu tortor interdum nulla, quis mattis sapien purus eu ligula.",
    //     "senderid": 0,
    //     "attachments": [
    //       "https://cushyfy.com/images/logo.png",
    //       "https://cushyfy.com/images/logo.png"
    //     ],
    //     "province": "metro_manila",
    //     "city": "caloocal_city",
    //     "barangay": "string",
    //     "created": "2019-02-20T01:59:06.808991Z"
    //   },
    //   {
    //     "subject": "Sample 2",
    //     "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus, quam a tincidunt convallis, arcu tortor interdum nulla, quis mattis sapien purus eu ligula.",
    //     "senderid": 0,
    //     "attachments": [
    //       "https://cushyfy.com/images/logo.png",
    //       "https://cushyfy.com/images/logo.png"
    //     ],
    //     "province": "metro_manila",
    //     "city": "caloocal_city",
    //     "barangay": "string",
    //     "created": "2019-02-20T01:59:06.808991Z"
    //   }
    // ]
  }

  viewMsg(info) {
    this.viewer = true;
    console.log(info);
    this.selectedMsg = info;
  }

  backtoList() {
    this.viewer = false;
  }

  messages() {
    Promise.resolve(this.fforce.getMessages()).then(data => {
      this.inboxData = data;
      console.log(this.inboxData)
    }).catch(e => {
      console.log(e);
    });
  }

  removeItem(index, info) {
    // this.inboxData.splice(index, 1)

  }

}
