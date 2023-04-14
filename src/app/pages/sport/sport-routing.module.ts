import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SportPage } from './sport.page';

const routes: Routes = [
  {
    path: '',
    component: SportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SportPageRoutingModule {}
