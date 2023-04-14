import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PlayerCardComponent } from './player-card/player-card.component';
import { WinrateCircleComponent } from './winrate-circle/winrate-circle.component';
import { SportCardComponent } from './sport-card/sport-card.component';
import { IonicModule } from '@ionic/angular';
import { GameCardComponent } from './game-card/game-card.component';

@NgModule({
  declarations: [
    PlayerCardComponent,
    WinrateCircleComponent,
    SportCardComponent,
    GameCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
    PlayerCardComponent,
    WinrateCircleComponent,
    SportCardComponent,
    GameCardComponent
  ]
})
export class ComponentsModule { }
