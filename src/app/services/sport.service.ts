import { Injectable } from '@angular/core';

import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  public readonly supportedSports = [
    {short: "bv", transString: "SPORT.BEACHVOLLEYBALL.TITLE"},
    {short: "tt", transString: "SPORT.TABLETENNIS.TITLE"},
  ];

  public enabledSports = new BehaviorSubject([""]);

  constructor() {
    this.loadEnabledSports();
  }


  /**
   * Loads the list of enabled sports from the phone via the Preferences plugin
   */
  private async loadEnabledSports() {
    let entry = await Preferences.get({key: "sports_enabled"});

    // On first boot this is not set and we  set it to an empty string
    if (entry.value == null) {
      Preferences.set({key: "sports_enabled", value: ""});
      this.enabledSports.next([""]);
    } else {
      // The entries are separated by a comma, thus we split and put them as single elements to an array
      let sportList = entry.value.split(",");
      this.enabledSports.next(sportList);
    }
  }


  /**
   * Enables a sport.
   * This will make it visible on the home page.
   * @param shortCode {string} The short code of the sport to enable.
   */
  public enableSport(shortCode: string) {
    let currentlyEnabled = this.enabledSports.value;

    // Check if sport is not already enabled
    if (!currentlyEnabled.includes(shortCode)) {
      currentlyEnabled.push(shortCode);

      // Publish the change
      this.enabledSports.next(currentlyEnabled);

      // Save the change
      let enabledString = currentlyEnabled.join(",");
      Preferences.set({key: "sports_enabled", value: enabledString});
    } 
  }


  /**
   * Disables a sport.
   * This will remove it from the home page.
   * 
   * @param shortCode {string} The short code of the sport to disable
   */
  public disableSport(shortCode: string) {
    let currentlyEnabled = this.enabledSports.value;

    // Check if sport is not already enabled
    if (currentlyEnabled.includes(shortCode)) {
      let idx = currentlyEnabled.indexOf(shortCode, 0);
      currentlyEnabled.splice(idx, 1);

      // Publish the change
      this.enabledSports.next(currentlyEnabled);

      // Save the change
      let enabledString = currentlyEnabled.join(",");
      Preferences.set({key: "sports_enabled", value: enabledString});
    } 
  }
}
