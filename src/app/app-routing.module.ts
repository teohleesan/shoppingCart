import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './shared/classes/auth-guard';
import {AdminGuard} from './shared/classes/admin-guard';
import { MainLayoutComponent } from './shared/theme/main-layout/main-layout.component';
import { AdminLayoutComponent } from './shared/theme/admin-layout/admin-layout.component';
import { ProductsComponent } from './product/products/products.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path : 'auth',
        loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: '',
        loadChildren: () => import('../app/product/product.module').then( m=> m.ProductModule)
       }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path : '',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
