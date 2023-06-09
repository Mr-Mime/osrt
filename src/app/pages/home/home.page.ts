import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertInput } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { SportCardComponent } from 'src/app/components/sport-card/sport-card.component';

// Services
import { SportService, SupportedSportsType } from 'src/app/services/sport.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChildren(SportCardComponent) sportCard!: QueryList<SportCardComponent>;

  // Variables for edit mode
  isInEditMode: boolean = false;

  // Variables for displaying sports
  enabledSportsSubscription;
  enabledSports: Array<string> = [];
  sportCardData: any; 

  constructor(
    private alertController: AlertController,
    private router: Router,
    public  sportService: SportService,
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
   * Callback for when the page will open
   */
  ionViewWillEnter() {
    // Tell all child components to reload their data
    this.sportCard.forEach((child) => {
      child.reloadData();
    });
  }


  /**
   * Navigates to the sport page pasing the short code of the choosen sport.
   * Only works if currently not in edit mode.
   * 
   * @param shortCode Short code of the sport to navigate to
   */
  public navigateToSport(sport: SupportedSportsType) {
    // We only navigate if we are not in edit mode
    if (this.isInEditMode) return;
    console.log("Pushing: " + JSON.stringify(sport));
    
    this.router.navigate(['/sport'], {queryParams: {sport: JSON.stringify(sport)}});
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
   * @param sport Sport to delete
   */
  public async deleteSport(sport: SupportedSportsType) {
    let alert: HTMLIonAlertElement;
    let sportName = this.translate.instant(sport.transString);

    alert = await this.alertController.create({
      header:  this.translate.instant('HOME.DELETE_SPORT.TITLE', {sport: sportName}),
      message: this.translate.instant('HOME.DELETE_SPORT.MSG', {sport: sportName}),
      buttons: [
        {
          text: this.translate.instant('GENERAL.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('GENERAL.DELETE'),
          handler: () => this.sportService.disableSport(sport.short)
        }
      ],
      cssClass: "wide-alert"
    });

    await alert.present();
  }


  /**
   * Adds passed sports to list of enabled sports
   * 
   * @param sports Array of shortcodes from sports to add.
   */
  private addSports(sports: Array<string>) {
    sports.forEach(sport => {
      this.sportService.enableSport(sport);
    })

    // Leave the edit mode
    this.toggleEditMode();
  }

}
