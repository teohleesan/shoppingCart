import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule} from '../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { CartProductsComponent } from './cart-products/cart-products.component';
import { CheckOutComponent } from './check-out/check-out.component';


const COMPONETS =[
  ProductsComponent,
  ProductComponent,
  CartProductsComponent,
  CheckOutComponent,
]

@NgModule({
  declarations: [ ...COMPONETS],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule
  ]
})
export class ProductModule { }
