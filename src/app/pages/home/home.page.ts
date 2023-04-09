import { Component } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Variables for edit mode
  isInEditMode: boolean = false;

  // Variables for displaying sports
  enabledSportsSubscription;
  enabledSports = [""];

  constructor(
    private alertController: AlertController,
    private sportService: SportService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang("en");

    this.enabledSportsSubscription = this.sportService.enabledSports.subscribe(value => {
      this.enabledSports = value;
    });
  }


  /**
   * Well..., toggles the edit mode.
   */
  public toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }


  /**
   * Opens an dialog in which the user can select sports he wants to add.
   * If all sports are alerady added, it will inform the user about this.
   */
  public async openSportSelector() {
    let sportList: Array<AlertInput> = [];

    this.sportService.supportedSports.forEach(sport => {
      // Only add sports that are not already enabled to the selection
      if (!this.enabledSports.includes(sport.short)) {
        sportList.push({
          label: this.translate.instant(sport.transString),
          type: 'checkbox',
          value: sport.short 
        });  
      }
    })

    let alert: HTMLIonAlertElement;

    // If list is empty and thus all sports are enabled already,
    // we show an information alert
    if (sportList.length == 0) {
      alert = await this.alertController.create({
        header:  this.translate.instant('HOME.ADD_SPORTS.EMPTY.TITLE'),
        message: this.translate.instant('HOME.ADD_SPORTS.EMPTY.MSG'),
        buttons: [this.translate.instant('GENERAL.OK')],
      });
    } else { // we show an alert with multiple select options
      alert = await this.alertController.create({
        header: this.translate.instant('HOME.ADD_SPORTS.TITLE'),
        buttons: [
          {
            text: this.translate.instant('GENERAL.CANCEL'),
            role: 'cancel'
          },
          {
            text: this.translate.instant('GENERAL.OK'),
            handler: (value) => this.addSports(value)
          }
        ],
        inputs: sportList
      });
    }

    await alert.present();
  }


  /**
   * Deletes sport from list of enabled sports.
   * 
   * @param shortCode {string} Short code of the sport to delete
   */
  public deleteSport(shortCode: string) {
    this.sportService.disableSport(shortCode);
  }


  /**
   * Adds passed sports to list of enabled sports
   * 
   * @param sports {Array<string>} Array of shortcodes from sports to add.
   */
  private addSports(sports: Array<string>) {
    sports.forEach(sport => {
      this.sportService.enableSport(sport);
    })
  }

}
