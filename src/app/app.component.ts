import { Component } from '@angular/core';

import { SettingsService } from './services/settings.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menuEntries = [
    {
      name: 'HOME.TITLE',
      path: 'home',
      icon: 'home-sharp'
    },
    {
      name: 'PLAYERS.TITLE',
      path: 'players',
      icon: 'person'
    },
    {
      name: 'SETTINGS.TITLE',
      path: 'settings',
      icon: 'settings-sharp'
    },
    {
      name: 'ABOUT.TITLE',
      path: 'about',
      icon: 'information-circle-outline'
    }
  ];

  // Used to highlight the active route in the side menu
  activeRoute: string = "home";

  constructor(
    private settings: SettingsService,
    private dbService: DatabaseService
  ) {
    this.dbService.initDataBase();
  }


  /**
   * Set the active route
   * 
   * @param path Tha path which is active
   */
  public setActiveItem(path: string) {
    this.activeRoute = path;
  }
}
