import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { UserInquiryComponent } from './user-inquiry/user-inquiry.component';
import { UserMaintenanceComponent } from './user-maintenance/user-maintenance.component';


@NgModule({
  declarations: [
    UserInquiryComponent,
    UserMaintenanceComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
