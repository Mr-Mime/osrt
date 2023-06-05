import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { App } from '@capacitor/app';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})

export class AboutPage implements OnInit {
  
  contributors: Array<{name: string, web: {name: string, link: string}}> = [
    {name: "Mohammad Yasir", web: {name: "Yasir761", link: "https://github.com/Yasir761"}}
  ];

  privacy: string = "";
  appVersion: string = "";

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    App.getInfo().then(app => {
      this.appVersion = app.version;
    })
  }

  ionViewWillEnter() {
    this.translate.get("ABOUT.PRIVACY.DATA_TEXT").subscribe(text => {
      this.privacy = text.join("\n");
    })
  }
}
