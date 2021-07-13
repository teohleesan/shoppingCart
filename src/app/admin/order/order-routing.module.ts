import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderInquiryComponent } from './order-inquiry/order-inquiry.component';
import { OrderMaintenanceComponent } from './order-maintenance/order-maintenance.component';

const routes: Routes = [
  {path: 'order-inquiry' , component: OrderInquiryComponent},
  {path: 'order-maintenance', component: OrderMaintenanceComponent},
  {path: '', redirectTo: 'order-inquiry', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
