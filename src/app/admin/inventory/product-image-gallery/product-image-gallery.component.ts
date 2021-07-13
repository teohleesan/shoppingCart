import { Component, Inject, OnInit } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';


@Component({
  selector: 'app-product-image-gallery',
  templateUrl: './product-image-gallery.component.html',
  styleUrls: ['./product-image-gallery.component.scss']
})
export class ProductImageGalleryComponent implements OnInit {
  title:string='';
  id:string='';
  imageurls: string[] = [];
  responsive = true;
  cols = 1;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA)private data,
    private matBottomSheetRef:MatBottomSheetRef<ProductImageGalleryComponent>) { }

  ngOnInit(): void {
    this.title = this.data.title;
    this.id = this.data.id;
    this.imageurls= this.data.imageurls;
    console.log(this.imageurls)

  }

  close(event:any){
    this.matBottomSheetRef.dismiss(false);
    event.preventDefault()
  }

}
