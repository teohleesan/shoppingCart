import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferencesResolverService } from 'src/app/shared/services/references-resolver.service';
import { ProductInquiryComponent } from './product-inquiry/product-inquiry.component';
import { ProductMaintenanceComponent } from './product-maintenance/product-maintenance.component';

const routes: Routes = [
  { path: 'product-inquiry', component: ProductInquiryComponent },
  {
    path: 'product-maintenance', component: ProductMaintenanceComponent,
    resolve: { references: ReferencesResolverService }
  },
  { path: '', redirectTo: 'product-inquiry', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
