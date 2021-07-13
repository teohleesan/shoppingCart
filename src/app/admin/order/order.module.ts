import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import { OrderRoutingModule } from './order-routing.module';
import { OrderInquiryComponent } from './order-inquiry/order-inquiry.component';
import { OrderMaintenanceComponent } from './order-maintenance/order-maintenance.component';


@NgModule({
  declarations: [
    OrderInquiryComponent,
    OrderMaintenanceComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule
  ]
})
export class OrderModule { }
