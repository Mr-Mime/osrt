import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';

// Services
import { DatabaseService } from 'src/app/services/database.service';
import { SupportedSportsType } from 'src/app/services/sport.service';

// Modal
import { AddNewGameFormComponent } from 'src/app/components/add-new-game-form/add-new-game-form.component';


@Component({
  selector: 'app-sport',
  templateUrl: './sport.page.html',
  styleUrls: ['./sport.page.scss'],
})
export class SportPage implements OnInit {

  activeSport!: SupportedSportsType;

  games!: Array<any>;

  constructor(
    private dbService: DatabaseService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    this.route.queryParams.subscribe(params => {      
      this.activeSport = JSON.parse(params["sport"]);
    });
  }

  ngOnInit() {
    this.loadGames();
  }


  /**
   * Load all saved games for the currently open sport
   */
  private async loadGames() {
    let g = await this.dbService.getAllGamesOfSport(this.activeSport.short);

    this.games = g.sort((a,b) => {
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0;
    });
  }


  /**
   * Opens the modal which allows adding a new game.
   * All data verification is done by the modal.
   */
  public async openAddSportForm() {
    // Create and present the modal
    const modal = await this.modalCtrl.create({
      component: AddNewGameFormComponent,
      id: 'custom-dialog-modal',
      backdropDismiss: false
    });
    modal.present();

    // Waiting for the modal to be closed
    const {data, role} = await modal.onWillDismiss();

    // We only need to handle if the modal was confirmed
    if (role === 'confirm') {
      console.log("DATA: " + JSON.stringify(data));
      
      // Add the game to the database
      const ret = await this.dbService.addGameForSport(this.activeSport.short, data.game);
  
      // Get the ID of the added game
      let id: number = ret.changes?.lastId ? ret.changes.lastId : -1;
  
      // Add the player game conection
      this.dbService.addGamePlayerConnection(this.activeSport.short, id, data.playerId, true);
  
      // Reload the list of games
      this.loadGames();
    }
  }
}
