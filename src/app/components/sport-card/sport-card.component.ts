import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from 'src/app/services/database.service';
import { SupportedSportsType } from 'src/app/services/sport.service';

@Component({
  selector: 'app-sport-card',
  templateUrl: './sport-card.component.html',
  styleUrls: ['./sport-card.component.scss'],
})
export class SportCardComponent  implements OnInit {
  @Input() sport!: SupportedSportsType;

  @Input() imagePath: string = "";
  @Input() iconPath: string = "";
  
  @Input() isInEditMode: boolean = false;
  
  @Output() onDeleteSport = new EventEmitter();


  hoursPlayed: number | undefined;
  playerCount: number | undefined;
  winrate: number | undefined;
  games: number | undefined;

  constructor(
    public translate: TranslateService,
    private dbService: DatabaseService
  ) { }

  ngOnInit() {
    this.loadGameInfo();
  }

  /**
   * Emits an event when the delete button was pressed
   */
  public deleteButtonPressed() {
    this.onDeleteSport.emit();
  }


  private async loadGameInfo() {
    this.games = await this.dbService.getNumberOfGamesOfSport(this.sport.short);
    this.playerCount = await this.dbService.getNumberOfOpponentsOfSport(this.sport.short);
    this.hoursPlayed = await this.dbService.getDurationOfGamesOfSport(this.sport.short) / 60;
    
    // Calculate winrate
    var wonGames = await this.dbService.getNumberOfWonGamesOfSport(this.sport.short);
    
    if (wonGames != undefined && this.games != undefined && this.games != 0) {
      this.winrate = wonGames / this.games;
    } else {
      this.winrate = 0;
    }
  }
}
