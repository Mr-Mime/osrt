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


  @Input() hoursPlayed: number | undefined;
  @Input() playerCount: number | undefined;
  @Input() winrate: number | undefined;
  @Input() games: number | undefined;

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


  /**
   * Public function to allow parent component to initiate data reload.
   */
  public reloadData() {
    this.loadGameInfo();
  }


  /**
   * Loads all relevant informaiton for the sport from th database.
   */
  private async loadGameInfo() {
    this.games = await this.dbService.getNumberOfGamesOfSport(this.sport.short);
    this.playerCount = await this.dbService.getNumberOfOpponentsOfSport(this.sport.short);
    this.hoursPlayed = await this.dbService.getDurationOfGamesOfSport(this.sport.short) / 60;
    
    // Calculate winrate
    var wonGames = await this.dbService.getNumberOfWonGamesOfSport(this.sport.short);
    
    if (wonGames != undefined && this.games != undefined && this.games != 0) {
      this.winrate = wonGames / this.games * 100;
    } else {
      this.winrate = 0;
    }
  }
}
