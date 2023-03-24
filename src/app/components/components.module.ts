import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PlayerCardComponent } from './player-card/player-card.component';
import { WinrateCircleComponent } from './winrate-circle/winrate-circle.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    PlayerCardComponent,
    WinrateCircleComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
    PlayerCardComponent,
    WinrateCircleComponent
  ]
})
export class ComponentsModule { }
