import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayersPage } from './players.page';

const routes: Routes = [
  {
    path: '',
    component: PlayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayersPageRoutingModule {}
