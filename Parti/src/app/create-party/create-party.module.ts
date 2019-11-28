import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePartyPageRoutingModule } from './create-party-routing.module';

import { CreatePartyPage } from './create-party.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePartyPageRoutingModule
  ],
  declarations: [CreatePartyPage]
})
export class CreatePartyPageModule {}
