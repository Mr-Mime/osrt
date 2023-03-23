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


  /**
   * Passes the selected language to the settings service.
   * 
   * @param e {Event} The event given on change of the selected value.
   */
  public setNewLanguage(e: any) {
    this.settings.setNewLanguage(e.detail.value);
  }


  /**
   * Converts the selected theme setting from integer to string, as needed by the select element values property.
   * 
   * @returns {String} The currently selected theme setting as a string.
   */
  public selectedThemeSetting(): String  {
    return this.settings.selectedThemeSetting + "";
  }

  /**
   * Passes the selected theme to the settings service.
   * 
   * @param e {Event} The event given on change of the selected value.
   */
  public updateThemeSetting(e: any) {
    this.settings.updateThemeSetting(parseInt(e.detail.value));
  }
}
