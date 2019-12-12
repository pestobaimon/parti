import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartiDetailPageRoutingModule } from './parti-detail-routing.module';

import { PartiDetailPage } from './parti-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartiDetailPageRoutingModule
  ],
  declarations: [PartiDetailPage]
})
export class PartiDetailPageModule {}
