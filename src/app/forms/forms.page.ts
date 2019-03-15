import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FieldforceService } from '../api/fieldforce.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {
  title: any;
  constructor(
    public fforce: FieldforceService,
  ) { }

  ngOnInit() {
    this.title = 'Retailer';
    this.fforce.getTitle = 'Retailer';
    
  }

  updateTitle(name) {
    console.log(name);
    this.fforce.getTitle = name;
    this.title = this.fforce.getTitle;
  }

}
