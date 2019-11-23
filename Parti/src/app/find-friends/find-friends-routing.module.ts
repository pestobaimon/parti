import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindFriendsPage } from './find-friends.page';

const routes: Routes = [
  {
    path: '',
    component: FindFriendsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindFriendsPageRoutingModule {}
