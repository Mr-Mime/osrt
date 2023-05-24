import { Component, OnInit } from '@angular/core';

// Ionic imports
import { IonDatetime, ModalController } from '@ionic/angular';

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
  formErrors: Array<string> = []; // List of present errors
  startDate!: string;
  endDate!: string;

  includeTimes: boolean = false;

  constructor(
    private dbService: DatabaseService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // Load players, needed for the player/opponent selection
    this.loadPlayers();

    // Get current time and set it
    let d = new Date(Date.now());
    d.setSeconds(0);
    let dString = this.toIsoString(d);
    this.startDate = dString;
    this.endDate = dString;
  }


  /**
   * Load all players from the database.
   */
  public async loadPlayers() {
    this.players = await this.dbService.getAllPlayers();
  }


  /**
   * Validates the inputs.
   * Checks if all required fields are filled.
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
    if (this.endDate < this.startDate && this.includeTimes) this.formErrors.push("time");
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

    // Check if start and end time should be included
    let startTime = null;
    let endTime = null;
    let duration = null;
    if (this.includeTimes) {
      startTime = Date.parse(this.startDate) / 1000;
      endTime   = Date.parse(this.endDate) / 1000;
      duration  = (endTime - startTime);
      console.log("Duration: " + duration);
      console.log("Start: " + this.startDate)
      console.log("Ende: " + this.endDate)
    }

    // Create game object with the data
    var game: Game = {
      id: -1,             // needs to be set as needed by the type, not used for adding the game
      won: won,
      points: this.newGame.points,
      pointsOpponent: this.newGame.pointsOpponent,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      location: null,
      createTime: Date.now()/1000,
      lastEditTime: Date.now()/1000
    };

    return this.modalCtrl.dismiss({game: game, playerId: this.newOpponentId}, 'confirm');
  }


  /**
   * Sets the time of the calling picker to "now".
   * 
   * @param dateTimePicker Reference to the date timepicker that is calling
   * @param idx Index (0 for the start date, 1 for the end date)
   */
  public setTimeToNow(dateTimePicker: IonDatetime, idx: number) {
    // Close the picker
    dateTimePicker.cancel(true);

    // Get current time and set it
    let d = new Date(Date.now());
    d.setSeconds(0);
    let dString = this.toIsoString(d);

    if (idx == 0) this.startDate = dString;
    else this.endDate = dString;
  }


  /**
   * Toggles wether the time should be included or not.
   * 
   * @param e Event
   */
  public timesClicked(e: Event) {
    this.includeTimes = !this.includeTimes;
  }


  /**
   * Convert the given date to an iso string, containing timezone information.
   * 
   * @param d Date object to convert
   * @returns String in the ISO form with the timezone added "YYYY-MM-DDTHH:MM:SS-+ZZ:ZZ"
   */
  private toIsoString(d: Date) {
    var tzo = -d.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = (num: number) => {
            return (num < 10 ? '0' : '') + num;
        };
  
    return d.getFullYear() +
        '-' + pad(d.getMonth() + 1) +
        '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
  }
}
