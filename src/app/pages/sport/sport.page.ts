import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// Services
import { DatabaseService } from 'src/app/services/database.service';
import { SportService, SupportedSportsType } from 'src/app/services/sport.service';

// Models
import { Game } from 'src/app/models/models';


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
    private route: ActivatedRoute,
    private sportService: SportService,
    public translate: TranslateService
  ) {
    this.route.queryParams.subscribe(params => {
      this.activeSport = this.sportService.supportedSports[params["sport"]];
    });
  }

  ngOnInit() {
    this.loadGames();
  }


  /**
   * Load all saved games for the currently open sport
   */
  private async loadGames() {
    this.games = await this.dbService.getAllGamesOfSport(this.activeSport.short);
  }


  /**
   * Add a game to the list of games of the cuttently open sport
   */
  public addGame() {
    var game: Game = {
      id: -1,             // needs to be set as needed by the type, not used for adding the game
      won: true,
      points: 23,
      pointsOpponent: 12,
      startTime: 1,
      endTime: 10,
      duration: 9,
      location: null,
      createTime: -1,     // needs to be set as needed by the type, not used for adding the game
      lastEditTime: -1    // needs to be set as needed by the type, not used for adding the game
    };

    // Add the game to the database
    this.dbService.addGameForSport(this.activeSport.short, game);

    // Reload the list of games
    this.loadGames();
  }
}
