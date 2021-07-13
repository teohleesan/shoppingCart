import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferencesResolverService } from '../shared/services/references-resolver.service';
import { CartProductsComponent } from './cart-products/cart-products.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';


const productsRoute: Routes = [
  {path: 'products', component: ProductsComponent},
  {path: 'product-details', component: ProductComponent},
  {path: 'carts', component: CartProductsComponent},
  {path: 'check-out', component: CheckOutComponent, resolve: {references : ReferencesResolverService } },
  {path: '', redirectTo: 'products',pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(productsRoute)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
