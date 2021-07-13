import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const COMPONENTS = [
  AdminDashboardComponent
]
const MODULES = [
  AdminRoutingModule,
  SharedModule
]



@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule, ...MODULES
  ]
})
export class AdminModule { }
