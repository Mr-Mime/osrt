import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PlayersPageRoutingModule } from './players-routing.module';

import { PlayersPage } from './players.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayersPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [PlayersPage]
})
export class PlayersPageModule {}
