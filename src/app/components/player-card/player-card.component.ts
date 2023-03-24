import { Component, Input, OnInit } from '@angular/core';

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

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {}

}
