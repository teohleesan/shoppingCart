import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { retryWhen, take, delay, catchError } from 'rxjs/operators';
import { retryCount, retryInterval } from 'src/app/shared/classes/const-variable';
import { Product } from 'src/app/shared/models';
import { ProductService } from '../../shared/services/index';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private productSub: Subscription;
  cart = {};
  products: Observable<any>;


  constructor(private productService: ProductService,
    private router: Router) {
      this.productService.cartEvent.subscribe(event=> this.updateCart(event));

  }

  ngOnInit(): void {
    this.products = this.productService.getProducts().pipe(
      retryWhen((error) => {
        return error.pipe(delay(retryInterval), take(retryCount))
      }), catchError(() => {
        return of([]);
      })
    )
    // this.productService.cart$.subscribe(value=>{
    //   this.cart = value;
    // })
  }
  updateCart(value: any){
    this.cart = value;
  }
  gotoCarts() {
    this.router.navigate(['/carts'])
  }
  addToCart(id: string) {
    this.productService.addToCart(id)
  }
  removeFromCart(id: string) {
    this.productService.removeFromCart(id)
  }
  check() {
    this.productService.checkLocalStorage();
  }
  removeCart() {
    this.productService.removecart();
  }

  getCart() {
    console.log(this.cart);
  }
}

