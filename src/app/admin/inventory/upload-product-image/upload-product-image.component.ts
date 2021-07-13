import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionService } from 'src/app/shared/services';

@Component({
  selector: 'app-upload-product-image',
  templateUrl: './upload-product-image.component.html',
  styleUrls: ['./upload-product-image.component.scss']
})
export class UploadProductImageComponent implements OnInit {
  path: string ='';
  id:string='';
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private matDialogRef: MatDialogRef<UploadProductImageComponent>,
    private sessionService: SessionService) { }

  ngOnInit(): void {
    this.path = this.data.path;
    this.id = this.data.id;
  }
}
