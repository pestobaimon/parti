import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindFriendsPageRoutingModule } from './find-friends-routing.module';

import { FindFriendsPage } from './find-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindFriendsPageRoutingModule
  ],
  declarations: [FindFriendsPage]
})
export class FindFriendsPageModule {}
