import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAccount } from '../../models/user-account';
import { User } from '../../models/user';
import { ItemsService, AuthService, SessionService, ProductService } from '../../services/index';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  mobileQuery: MediaQueryList;
  shouldRun: boolean = true;
  user: User = null;
  show: boolean;
  cartCount: number = 0;

  constructor(media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public authService: AuthService,
    private sessionService: SessionService,
    private itemsService: ItemsService,
    private productService: ProductService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // this.authService.getUser().subscribe((user) => {
    //   this.updateUser(user)
    // })
    this.authService.userSubject.subscribe((user) => {
      this.user = user;
    })
    // await this.productService.cart$.subscribe((cart)=>{
    //   this.cartCount = 0;
    //   Object.entries(cart).map(([key, value]) =>{
    //     this.cartCount += value as number;
    //   })
    // })
    this.productService.cartEvent.subscribe(event => { this.updateCart(event) })
  }
  private _mobileQueryListener: () => void;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit() {
  }
  updateCart(cart: any) {
    console.log(cart);
    this.cartCount = 0;
      Object.entries(cart).map(([key, value]) =>{
        this.cartCount += value as number;
    })
  }
  signup() {
    this.router.navigate(['/auth/signup'])
  }
  signin() {
    this.router.navigate(['/auth/signin'])
  }
  signout() {
    this.authService.signOut()
  }
  adminLogin() {
    this.router.navigate(['/admin/dashboard'])
  }
  home() {
    this.router.navigate(['/'])
  }
  // updateUser(user: any) {
  //   if (user){
  //     this.user = this.itemsService.getSerialized<UserAccount>(user)
  //   }
  //   else{
  //     this.user = null;
  //   }
  // }
  gotoCarts() {
    this.router.navigate(['/carts']);
  }

}
