import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss'],
})
export class PlayerCardComponent  implements OnInit {
  @Input() name: string = "";
  @Input() games: number = 0;
  @Input() winrate: number = 0;
  @Input() hours_played: number = 0;

  @Output() onDeletePlayer = new EventEmitter<boolean>();

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {}


  /**
   * Emit an event when the delete button was pressed
   */
  public deleteButtonPressed() {
    this.onDeletePlayer.emit(true);
  }
}
