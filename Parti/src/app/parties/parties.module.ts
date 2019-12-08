import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartiesPage } from './parties.page';
import { ExpandableModule } from '../expandable/expandable.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExpandableModule,
    RouterModule.forChild([{ path: '', component: PartiesPage }])
  ],
  declarations: [PartiesPage]
})
export class PartiesPageModule {}
