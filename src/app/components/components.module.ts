import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PlayerCardComponent } from './player-card/player-card.component';
import { WinrateCircleComponent } from './winrate-circle/winrate-circle.component';
import { SportCardComponent } from './sport-card/sport-card.component';
import { IonicModule } from '@ionic/angular';
import { GameCardComponent } from './game-card/game-card.component';
import { AddNewGameFormComponent } from './add-new-game-form/add-new-game-form.component';

@NgModule({
  declarations: [
    PlayerCardComponent,
    WinrateCircleComponent,
    SportCardComponent,
    GameCardComponent,
    AddNewGameFormComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    PlayerCardComponent,
    WinrateCircleComponent,
    SportCardComponent,
    GameCardComponent,
    AddNewGameFormComponent
  ]
})
export class ComponentsModule { }
