import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Capacitor plugins
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';

// Service
import { DatabaseService } from 'src/app/services/database.service';

// Models
import { Player } from 'src/app/models/models';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  public players!: Array<Player>;

  constructor(
    public dbService: DatabaseService,
    public translate: TranslateService,
  ) { }

  ngOnInit() {
    this.loadPlayers();
  }


  /**
   * Load all players from the database.
   */
  public async loadPlayers() {
    this.players = await this.dbService.getAllPlayers();
  }


  /**
   * Delete a player
   * @param player {Player} Player to delete
   */
  public async deletePlayer(player: Player) {
    // Ask for confirmation
    const confirmation = await Dialog.confirm({
      title: this.translate.instant('PLAYERS.DELETE.TITLE'),
      message: this.translate.instant('PLAYERS.DELETE.MSG', {playerName: player.name}),
      cancelButtonTitle: this.translate.instant('GENERAL.CANCEL'),
      okButtonTitle: this.translate.instant('GENERAL.DELETE')
    });

    if (confirmation.value) {
      // Delete the player and update the list
      this.dbService.deletePlayer(player.id);
      this.players = this.players.filter(p => p.id !== player.id);
      
      // Show a toast to confirm the deletion
      await Toast.show({
        text: this.translate.instant('PLAYERS.DELETE.SUCCESS', {playerName: player.name}),
        duration: 'short'
      });
    }
  }
  

  /**
   * Add a new player.
   * This function is called when the user clicks on the floating action button.
   */
  public async addPlayer() {
    // Ask for the player name
   const result = await Dialog.prompt({
      title: this.translate.instant('PLAYERS.ADD.TITLE'),
      message: this.translate.instant('PLAYERS.ADD.MSG'),
      inputPlaceholder: this.translate.instant('PLAYERS.ADD.PLACEHOLDER'),
      cancelButtonTitle: this.translate.instant('GENERAL.CANCEL'),
      okButtonTitle: this.translate.instant('GENERAL.ADD')
    });
    
    if (!result.cancelled) {
      // Add the player to the database
      const playerName = result.value;
      const player = await this.dbService.addPlayer(playerName);

      // Reload the list
      this.loadPlayers();

        // Show a toast
      await Toast.show({
        text: this.translate.instant('PLAYERS.ADD.SUCCESS', {playerName}),
        duration: 'short'
      });
    }
  }
  

}
