import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Utilities } from 'src/app/shared/classes/utilities';
import { Country, Order } from 'src/app/shared/models';
import { OrderItems } from 'src/app/shared/models/order-items';
import { References } from 'src/app/shared/models/references';
import { FormService, OrderService, ProductService } from 'src/app/shared/services';
import { Location } from '@angular/common';


@Component({
  selector: 'app-order-maintenance',
  templateUrl: './order-maintenance.component.html',
  styleUrls: ['./order-maintenance.component.scss']
})
export class OrderMaintenanceComponent implements OnInit {
  countries: Country[];
  countryOption$: Observable<Country[]>;
  order: Order;
  id: string = '';
  orderForm: FormGroup;
  orderItemForm: FormGroup;
  dataSource: Array<any> = [];
  displayedColumns: string[] = ['name', 'unitPrice', 'quantity', 'amount', 'actions'];


  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    private formService: FormService,
    private productService: ProductService,
    private location: Location) {
    this.activatedRoute.data.subscribe((data) => {
      const ref = data['references'] || { country: [], category: [], currency: [], seller: [] } as References;
      this.countries = ref.country;
    })
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'] || '';
      if (this.id.length > 0) {
        this.get(this.id);
      }
    })
    this.initForm();
    this.countryOption$ = this.orderForm.controls.country.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? Utilities.filter<Country>(name, this.countries) : this.countries.slice())
    )
  }
  async get(id: string) {
    const orderItems: Array<any> = [];
    await this.orderService.get(id).subscribe(async (value) => {
      // console.log(value.order)
      this.formService.setObjectToReactiveForm(this.orderForm, value.order);
      value.orderItems.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        orderItems.push(doc.data());
      });
      // console.log('order1 ', orderItems);
      await this.productService.getProducts().subscribe((allProduct)=>{
        const filteredOrder = allProduct.filter(option => orderItems.some(filter => filter.productId === option.id))
        .map((mOrder)=>{
          return { ...mOrder, item: orderItems.filter(option => option.productId === mOrder.id)};
        })
        // console.log(filteredOrder);
        this.bind(filteredOrder);
      })
    })
  }
  update(){

  }
  editItem(row: any){
  }
  deleteItem(row: any){
  }
  displayFn(options: any): (code: string) => string | null {
    return Utilities.displayFnByCode(options, 'name');
  }
  getDiscountPercent() {
    return 'discount (' + this.orderForm.controls.discountPercent.value + '%)';
  }
  getGstPercent() {
    return 'gst (' + this.orderForm.controls.gstPercent.value + '%)';
  }
  bind(data: any){
    const items: Array<any> = [];
    data.forEach(element => {
      const item : any ={
        orderId: element.item[0].orderId,
        productId: element.item[0].productId,
        quantity:element.item[0].quantity,
        unitPrice:element.item[0].unitPrice,
        amount:element.item[0].amount,
        name:element.name
      }
      items.push(item);
    })
    console.log(items)
    // this.dataSource = items;
    this.dataSource = items;
  }
  getFormArray() : FormArray{
    return this.orderItemForm.controls.tableRows.value;
  }
  goBack(){
    this.location.back();
  }
  initForm() {
    this.orderForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      state: [''],
      zip: [''],
      phoneNumber: ['', Validators.required],
      grandAmount: [0],
      discountPercent: [8],
      discountAmount: [0],
      amountAfterDiscount: [0],
      gstPercent: [8],
      gstAmount: [0],
      amountAfterGST: [0],
      deliveryChargesAmount: [0],
      totalAmount: [0],
      createdOn: [new Date()],
      createdBy: [''],
      modifiedOn: [new Date()],
      modifiedBy: ['']
    });
    this.orderItemForm = this.fb.group({
      tableRows: this.fb.array([])
    })
  }
}
