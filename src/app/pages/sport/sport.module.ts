import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SportPageRoutingModule } from './sport-routing.module';

import { SportPage } from './sport.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SportPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [SportPage]
})
export class SportPageModule {}
