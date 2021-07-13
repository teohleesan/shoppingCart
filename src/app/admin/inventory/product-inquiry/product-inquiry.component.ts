import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subscription, throwError } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { ActionService } from 'src/app/shared/services/action.service';
import { InventoryService } from 'src/app/shared/services/inventory.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationData } from 'src/app/shared/models/confirmation-data.model';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { FirebaseStorageService, SessionService, ToastrService } from 'src/app/shared/services';

import { retryWhen, take, delay, catchError } from 'rxjs/operators';
import { productUploadPath, retryCount, retryInterval } from 'src/app/shared/classes/const-variable';


@Component({
  selector: 'app-product-inquiry',
  templateUrl: './product-inquiry.component.html',
  styleUrls: ['./product-inquiry.component.scss']
})
export class ProductInquiryComponent implements OnInit {
  dataSource: Product[]
  productSub: Subscription;
  displayedColumns: string[] = ['image', 'code', 'name', 'currency', 'price', 'ratings', 'seller', 'category', 'stockQuantity', 'actions']

  constructor(private inventoryService: InventoryService,
    private actionService: ActionService,
    private router: Router,
    private matDialog: MatDialog,
    private toastrService: ToastrService,
    private sessionService: SessionService,
    private firebaseStorageService: FirebaseStorageService) {
    this.actionService.toggleCreateEvent.subscribe(_ => {
      this.create();
    })
  }

  async ngOnInit() {
    this.productSub = this.inventoryService.inquiry()
      .pipe(
        retryWhen((item) => {
          return item.pipe(delay(retryInterval), take(retryCount))
        }),
        catchError((error) => {
          return of([])
        })
      ).subscribe((items) => {
        this.dataSource = items
      })
  }
  displayImageUrl(storagePath: string, index: number) {
    this.firebaseStorageService.getUrlByStoragePath(storagePath).subscribe(url => {
      this.dataSource[index].url = url
    })
  }
  ngOnDestroy(): void {
    this.productSub.unsubscribe()
  }
  create() {
    this.router.navigate(['/admin/inventory/product-maintenance']);
  }
  edit(row: Product) {
    this.router.navigate(['/admin/inventory/product-maintenance'], { queryParams: { id: row.id } });
  }
  delete(row: Product) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const confirmdata: ConfirmationData = {
      title: 'delete record',
      message: 'do you wants to delete this record ' + row.code + ' ' + row.name,
      btnOKText: 'Ok',
      btnCancelText: 'Cancel'
    }
    dialogConfig.data = confirmdata;
    const dialog = this.matDialog.open(ConfirmationDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.inventoryService.delete(row.id).then(() => {
          this.toastrService.showSuccessMessage('record deleted successfully.')
        }).catch((error) => {
          this.toastrService.showErrorMessage(error.message)
        })
      }
    })
  }
  getDefaultImage(){
    this.sessionService.getAppSetting().defaultBlankScr;
  }
}
