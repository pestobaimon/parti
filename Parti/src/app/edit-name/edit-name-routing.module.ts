import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditNamePage } from './edit-name.page';

const routes: Routes = [
  {
    path: '',
    component: EditNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditNamePageRoutingModule {}
