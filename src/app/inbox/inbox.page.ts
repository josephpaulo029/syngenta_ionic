import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  inboxData: any;

  constructor(
    public fforce: FieldforceService,

  ) { }

  ngOnInit() {
    this.inboxData = [
      {
        "subject": "Sample",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus, quam a tincidunt convallis, arcu tortor interdum nulla, quis mattis sapien purus eu ligula.",
        "senderid": 0,
        "attachments": [
          "https://cushyfy.com/images/logo.png",
          "https://cushyfy.com/images/logo.png"
        ],
        "province": "metro_manila",
        "city": "caloocal_city",
        "barangay": "string"
      },
      {
        "subject": "Sample 2",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rhoncus, quam a tincidunt convallis, arcu tortor interdum nulla, quis mattis sapien purus eu ligula.",
        "senderid": 0,
        "attachments": [
          "https://cushyfy.com/images/logo.png",
          "https://cushyfy.com/images/logo.png"
        ],
        "province": "metro_manila",
        "city": "caloocal_city",
        "barangay": "string"
      }
    ]
  }

  messages() {
    Promise.resolve(this.fforce.getMessages()).then(data => {
      this.inboxData = data;
    }).catch(e => {
      console.log(e);
    });
  }

  removeItem(index) {
    // this.cartData.product.splice(index, 1)
    this.inboxData.splice(index, 1)
  }

}
