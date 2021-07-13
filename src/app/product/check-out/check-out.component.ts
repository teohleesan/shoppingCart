import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationData, Country, Order } from 'src/app/shared/models';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProductService, UserService, FormService, ToastrService } from 'src/app/shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Utilities } from 'src/app/shared/classes/utilities';
import { References } from 'src/app/shared/models/references';
import { OrderItems } from 'src/app/shared/models/order-items';
import { delivery_amount, discount_percentage, gst_percentage } from 'src/app/shared/classes/const-variable';



@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  form : FormGroup;
  countryOption$:Observable<Country[]>;
  countries: Country[];
  order: Order;
  orderItems:Array<OrderItems> = [];
  orderId: string;
  subscriberId: string = '';

  constructor(private router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private formService: FormService,
    private toastrService: ToastrService
    ) {
      this.activatedRoute.data.subscribe((data)=>{
        const ref = data['references'] || { country: [], category: [], currency: [], seller: [] } as References
        this.countries = ref.country;
      })
      this.order = this.init()
    }
  init(): Order {
    return {
      purchaserId: '',
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      country: '',
      state: '',
      zip: 0,
      phoneNumber: '',
      grandAmount: 0,
      discountPercent:  discount_percentage,
      discountAmount:  0,
      amountAfterDiscount:  0,
      gstAmount:  0,
      gstPercent: gst_percentage,
      amountAfterGST: 0,
      deliveryChargesAmount:  delivery_amount,
      totalAmount: 0,
    } as Order
  }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params)=>{
      this.orderItems = JSON.parse(params['orderItems']) || [] ;
      this.order.grandAmount =  params['totalAmount'] || 0;
      this.subscriberId =  params['subscriberId'] || '';
      this.calculateAmount();
      if (this.subscriberId.length > 0){
        this.getUserInformation(this.subscriberId, this.form);
      }
    })
    this.initialForm()
    this.countryOption$ = this.form.controls.country.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? Utilities.filter<Country>(name, this.countries) : this.countries.slice())
    )
  }
  calculateAmount() {
    let discountPercent = this.order.discountPercent / 100;
    this.order.discountAmount = Math.round((this.order.grandAmount * discountPercent) * 100 ) / 100
    this.order.amountAfterDiscount = this.order.grandAmount - this.order.discountAmount;

    let gstPercent = this.order.gstPercent / 100;
    this.order.gstAmount = Math.round((this.order.amountAfterDiscount * gstPercent) * 100) / 100;
    this.order.amountAfterGST = this.order.amountAfterDiscount + this.order.gstAmount;

    this.order.totalAmount = this.order.amountAfterGST + this.order.deliveryChargesAmount ;
  }

  initialForm(){
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      state: [''],
      zip: [''],
      phoneNumber: ['', Validators.required],
    })
  }
  displayFn(options: any) : (code:string) => string | null {
    return (code: string) =>{
      const correspondingOption = Array.isArray(options) ? options.find(option => option.code === code) : null;
      return correspondingOption ?correspondingOption.name : ''
    }
  }
  gotoCart() {
    this.router.navigate(['carts']);
  }

  clearLocalStorage() {
    localStorage.clear()
  }
  getUserInformation(id:string, form: FormGroup){
    this.userService.get(id).subscribe((user)=>{
      Object.keys(user).forEach(name => {
        if (this.form.controls[name]) {
          this.form.controls[name].patchValue(user[name]);
        }
      });
    })
  }
  // _throwIfControlMissing(name: string): boolean {
  //   if (!Object.keys(this.controls).length) {
  //     throw new Error(`
  //       There are no form controls registered with this group yet.  If you're using ngModel,
  //       you may want to check next tick (e.g. use setTimeout).
  //     `);
  //   }
  //   if (!this.controls[name]) {
  //     throw new Error(`Cannot find form control with name: ${name}.`);
  //   }
  // }

  getForm(): Order {
     let order:Order = this.formService.getReactiveFormObject<Order>(this.form);
     order.purchaserId = this.subscriberId;
     order.grandAmount = this.order.grandAmount;
     order.discountPercent = this.order.discountPercent;
     order.discountAmount = this.order.discountAmount;
     order.amountAfterDiscount = this.order.amountAfterDiscount;
     order.gstPercent = this.order.gstPercent;
     order.gstAmount = this.order.gstAmount;
     order.amountAfterGST = this.order.amountAfterGST;
     order.deliveryChargesAmount = this.order.deliveryChargesAmount;
     order.totalAmount = this.order.totalAmount;
     order.createdOn = new Date();
     order.createdBy = '';
     order.modifiedOn = new Date();
     order.modifiedBy = '';
     return order;
  }
  confirmOrder(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    const data: ConfirmationData = {
      title: 'Confirm order',
      message: 'confirm the order item.',
      btnOKText: 'Ok',
      btnCancelText: 'Cancel'
    }
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result)=>{
      if (result){
        let order: Order = this.getForm();
        this.productService.addToOrder( order, this.orderItems).then(()=>{
          this.toastrService.showSuccessMessage('order place successfully.')
          this.router.navigate(['/'])
        }).catch((error)=>{
          this.toastrService.showErrorMessage(error)
        })
      }
    })
  }
  validateForm(){
    return this.form.invalid
  }
}


