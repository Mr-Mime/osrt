import { Component, OnInit } from '@angular/core';

// Ionic imports
import { ModalController } from '@ionic/angular';

// Models
import { Game, Player } from 'src/app/models/models';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-add-new-game-form',
  templateUrl: './add-new-game-form.component.html',
  styleUrls: ['./add-new-game-form.component.scss'],
})
export class AddNewGameFormComponent  implements OnInit {

  newGame: Game = new Game;                 // Store data for the new entry
  newOpponentId!: number;           // Store the player which was the opponent
  players!: Array<Player>;        // Used to show players in select
  formErrors: Array<string> = []; // List of present erorrs

  constructor(
    private dbService: DatabaseService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // Load players, needed for the player/opponent selection
    this.loadPlayers();
  }


  /**
   * Load all players from the database.
   */
  public async loadPlayers() {
    this.players = await this.dbService.getAllPlayers();
  }


  /**
   * Validates the inputs.
   * Checks if all required fileds are filled.
   * 
   * If any errors are found the will be added to the `formsError` array
   */
  private validateInput() {
    // Clear old errors
    this.formErrors = [];

    // Check for errors
    if (this.newGame.points == undefined) this.formErrors.push("points"); 
    if (this.newGame.pointsOpponent == undefined) this.formErrors.push("pointsOpponent");
    if (!this.newOpponentId) this.formErrors.push("opponent");
  }


  /**
   * Called when the cancel button was pressed.
   * Will dismiss the modal with the 'cancel' role.
   */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  /**
   * Called when the 'add' button was pressed.
   * 
   * When the input is valid it will dismiss the modal with the
   * 'confirm' role. The game and player data will be passed back
   * to the calling controller.
   * 
   * If the input is invalid this function will return.
   */
  confirm() {
    // First we need to validate the entries
    this.validateInput();

    // If there are errors, we do not add the game to the data base
    if (this.formErrors.length != 0) return;

    // Check if user has won
    let won = this.newGame.points > this.newGame.pointsOpponent;

    // Create game object with the data
    var game: Game = {
      id: -1,             // needs to be set as needed by the type, not used for adding the game
      won: won,
      points: this.newGame.points,
      pointsOpponent: this.newGame.pointsOpponent,
      startTime: null,
      endTime: null,
      duration: null,
      location: null,
      createTime: Date.now()/1000,
      lastEditTime: Date.now()/1000
    };

    return this.modalCtrl.dismiss({game: game, playerId: this.newOpponentId}, 'confirm');
  }
}
