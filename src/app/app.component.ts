import { Component } from '@angular/core';

import { SettingsService } from './services/settings.service';

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
    // {
    //   name: 'ABOUT.TITLE',
    //   path: 'about',
    //   icon: 'information-circle-outline'
    // }
  ];

  constructor(
    private settings: SettingsService
  ) {}
}
