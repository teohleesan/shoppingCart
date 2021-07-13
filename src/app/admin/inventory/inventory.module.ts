import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module'

import { InventoryRoutingModule } from './inventory-routing.module';
import { ProductInquiryComponent } from './product-inquiry/product-inquiry.component';
import { ProductMaintenanceComponent } from './product-maintenance/product-maintenance.component';
import { UploadProductImageComponent } from './upload-product-image/upload-product-image.component';
import { ProductImageGalleryComponent } from './product-image-gallery/product-image-gallery.component';


@NgModule({
  declarations: [
    ProductInquiryComponent,
    ProductMaintenanceComponent,
    UploadProductImageComponent,
    ProductImageGalleryComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
