import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartiDetailPage } from './parti-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PartiDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartiDetailPageRoutingModule {}
