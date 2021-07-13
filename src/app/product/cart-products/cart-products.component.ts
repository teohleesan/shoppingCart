import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { retryWhen, take, delay, catchError } from 'rxjs/operators';
import { retryCount, retryInterval } from 'src/app/shared/classes/const-variable';
import { AuthService, ProductService, SessionService } from '../../shared/services/index';
import {Router} from '@angular/router';
import { SumPipe } from 'src/app/shared/pipes/sum.pipe';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationData } from 'src/app/shared/models';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { OrderItems } from 'src/app/shared/models/order-items';


@Component({
  selector: 'app-cart-products',
  templateUrl: './cart-products.component.html',
  styleUrls: ['./cart-products.component.scss'],
  providers: [SumPipe]
})
export class CartProductsComponent implements OnInit {
  cart = []
  isSubscriber :boolean = false;
  subscriberId: string = '';

  constructor(private productService: ProductService,
    private sessionService: SessionService,
    private router: Router,
    private dialog:MatDialog,
    private auth: AuthService,
    ) {
  }
  async ngOnInit() {
    this.productService.cart$.subscribe((value) => {
      const cartItems = value;
      this.productService.getProducts().pipe(
        retryWhen((error) => {
          return error.pipe(delay(retryInterval), take(retryCount));
        }),
        catchError((error) => {
          return of([]);
        })
      ).subscribe((allProduct) => {
        this.cart = allProduct.filter(p => cartItems[p.id])
          .map(product => {
            return { ...product, count: cartItems[product.id], amount: cartItems[product.id] * product.price };
          });
      });
    })
    this.auth.userSubject.subscribe((user) => {
      if (user !== null){
        this.subscriberId = user.id;
        this.isSubscriber = user?.roles?.subscriber
      }
    })
  }
  getDefaultImage() {
    this.sessionService.getAppSetting().defaultBlankScr;
  }
  addToCart(id: string) {
    this.productService.addToCart(id);
  }
  removeFromCart(id: string) {
    this.productService.removeFromCart(id);
  }
  checkOut(){
    let orderItems: Array<OrderItems> = []
    this.cart.forEach(element => {
      let o : OrderItems = {
        productId: element.id,
        quantity: element.count,
        unitPrice: element.price,
        amount: element.count * element.price
      }
      orderItems.push(o);
    });
    let totalAmount = new SumPipe().transform(this.cart, 'amount');
    if (this.isSubscriber){
      this.router.navigate(['check-out'],{queryParams :{
        subscriberId: this.subscriberId,
        totalAmount, orderItems: JSON.stringify(orderItems)
      }});
    }else{
      this.router.navigate(['auth/signup'],{queryParams :{
        totalAmount, orderItems: JSON.stringify(orderItems),
        caller: 'check-out'
      }});
    }
  }

  gotoProducts() {
    this.router.navigate(['/']);
  }
  removeCart() {
    const dialogConfig = new MatDialogConfig();
    let data: ConfirmationData = {
      title: 'Clear Cart',
      message: 'Are You sure to empty the cart ? ',
      btnOKText: 'Ok',
      btnCancelText: 'Cancel'
    }
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    const dialog = this.dialog.open(ConfirmationDialogComponent, dialogConfig)
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.removeCart();
      }
    })
  }

}
