import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


const routes: Routes = [
  {
    path: '',
    children : [
      { path : 'dashboard', component: AdminDashboardComponent},
      { path : 'user',
        loadChildren: () => import('./user/user.module').then( m=> m.UserModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then( m => m.InventoryModule)
      },
      {
        path: 'order',
        loadChildren:() => import('./order/order.module').then(m=>m.OrderModule)
      },

      { path: '' , redirectTo: 'dashboard'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
