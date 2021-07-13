import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationData } from 'src/app/shared/models';
import { OrderService } from 'src/app/shared/services';

@Component({
  selector: 'app-order-inquiry',
  templateUrl: './order-inquiry.component.html',
  styleUrls: ['./order-inquiry.component.scss']
})
export class OrderInquiryComponent implements OnInit, OnDestroy {
  dataSource:Array<any> = [];
  orderSub: Subscription;
  displayedColumns: string[] = ['createdOn', 'name', 'country', 'phoneNumber', 'totalAmount', 'actions'];
  constructor(private orderService: OrderService,
    private router:Router,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.orderSub = this.orderService.inquiry().subscribe((orders)=>{
      this.dataSource = orders.map((o)=>{
        return {...o, name: o.firstName+' '+ o.lastName}
      })
    });
  }
  ngOnDestroy(){
     this.orderSub.unsubscribe();
   }
   edit(row:any){
     this.router.navigate(['/admin/order/order-maintenance'], { queryParams:{id: row.id}})
   }
   delete(row: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const data: ConfirmationData = {
      title: 'Delete order',
      message: 'Do you wants to delete the order?',
      btnOKText: 'OK',
      btnCancelText: 'Cancel'
    }
    dialogConfig.data = data;
    const dialog = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialog.afterClosed().subscribe((result)=>{
      if (result){
        // delete order
      }
    })
   }
}
