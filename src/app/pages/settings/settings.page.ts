import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Services
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public translate: TranslateService,
    public settings: SettingsService
  ) { }

  ngOnInit() {
  }


  public setNewLanguage(e: any) {
    this.settings.setNewLanguage(e.detail.value);
  }

}
