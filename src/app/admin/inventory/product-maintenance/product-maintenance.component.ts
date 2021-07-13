import { Component, ElementRef, OnInit, ViewChild, Renderer2, Self, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, retryWhen, startWith, take, delay, catchError } from 'rxjs/operators';
import { References } from 'src/app/shared/models/references';
import { AuditPipe } from 'src/app/shared/pipes/audit.pipe';
import { FileService, FirebaseStorageService, InventoryService, SessionService, ToastrService, } from 'src/app/shared/services/index';
import { Currency, Product, Seller, Category } from '../../../shared/models/index';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UploadProductImageComponent } from '../upload-product-image/upload-product-image.component';
import { ProductImageGalleryComponent } from '../product-image-gallery/product-image-gallery.component';
import { MatBottomSheetConfig, MatBottomSheet } from '@angular/material/bottom-sheet';
import { productUploadPath, retryCount, retryInterval } from 'src/app/shared/classes/const-variable';

@Component({
  selector: 'app-product-maintenance',
  templateUrl: './product-maintenance.component.html',
  styleUrls: ['./product-maintenance.component.scss']
})
export class ProductMaintenanceComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload: ElementRef;
  // @ViewChild('btn',{read : ElementRef}) btn: ElementRef;
  private routeSubscription: Subscription;
  private productSub: Subscription;
  private firebaseStorageSubscription: Subscription;
  isHovered: boolean = false;
  files: Array<any> = [];
  form: FormGroup;
  image$: any;
  currencies: Currency[];
  currencyOptions$: Observable<Currency[]>;
  sellers: Seller[];
  sellerOptions$: Observable<Seller[]>;
  categories: Seller[];
  categoryOptions$: Observable<Category[]>;
  id: string = '';
  newMode:boolean = true;

  constructor(@Self() private self: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private fileService: FileService,
    private auditPipe: AuditPipe,
    private matdialog: MatDialog,
    private renderer: Renderer2,
    private firebaseStorageService: FirebaseStorageService,
    private matBottomSheet: MatBottomSheet
  ) {
    this.image$ = this.sessionService.getAppSetting().defaultBlankScr;
    this.initForm()
    this.activatedRoute.data.subscribe((data) => {
      const ref = data['references'] || { category: [], currency: [], seller: [] } as References
      this.categories = ref.category;
      this.currencies = ref.currency;
      this.sellers = ref.seller;
    })
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'] || '';
      if (this.id.length > 0) {
        this.newMode = false;
        this.get(this.id);
      }
    })
    this.currencyOptions$ = this.form.controls['currency'].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      map((value) => typeof value === 'string' ? value : value.name),
      map((name) => name ? this._filter<Currency>(name, this.currencies) : this.currencies.slice())
    )
    this.categoryOptions$ = this.form.controls['category'].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter<Category>(name, this.categories) : this.categories.slice())
    )
    this.sellerOptions$ = this.form.controls['seller'].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter<Seller>(name, this.sellers) : this.sellers.slice())
    )
  }
  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
  private _filter<T>(name: string, options: any): any {
    const filterValue = name.toLowerCase();
    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
  }
  initForm() {
    this.form = this.fb.group({
      id: [''],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      price: ['', [Validators.required]],
      ratings: [''],
      seller: ['', [Validators.required]],
      category: ['', [Validators.required]],
      stockQuantity: [''],
      createdOn: [{ value: new Date(), disabled: true }],
      createdBy: [''],
      modifiedOn: [{ value: new Date(), disabled: true }],
      modifiedBy: [''],
    })
  }
  get(id: string) {
    this.productSub = this.inventoryService.get(id)
      .pipe(
        retryWhen(error => {
          return error.pipe(delay(retryInterval), take(retryCount))
        }),
        catchError((error) => {
          return of({} as Product)
        }))
      .subscribe((item) => {
        this.setForm(item);
        this.image$ = item?.url ? item.url : this.getDefaultImage();
      })
  }
  async update() {
    let product: Product = this.getForm();
    if (!this.newMode) {
      await this.inventoryService.update(product).then(_ => {
        this.toastrService.showSuccessMessage('record updated successfully.');
      }).catch((error) => this.toastrService.showErrorMessage(error.message))
    } else {
      await this.inventoryService.create(product).then(docRef => {
        this.id = docRef.id;
        this.toastrService.showSuccessMessage('record updated successfully.');
      }).catch((error) => this.toastrService.showErrorMessage(error.message))
    }
    if (this.files.length > 0) {
      this.inventoryService.pushFileToStorage(productUploadPath, this.files[0], this.id).subscribe((percentage) => {
        console.log('push file ' + percentage);
      })
    }
  }

  getFile() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.click();
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push(file)
        // console.log(this.fileService.displayImage(file))
        this.fileService.loadImage(file).subscribe(arg => {
          this.image$ = arg
        });
      }
    }
  }
  setForm(item: Product) {
    this.form.setValue({
      id: this.id,
      code: item.code,
      name: item.name,
      currency: item.currency,
      price: item.price,
      ratings: item.ratings || 0,
      seller: item.seller || '',
      category: item.category || '',
      stockQuantity: item.stockQuantity || 0,
      createdOn: item.createdOn || new Date(),
      createdBy: item.createdBy || '',
      modifiedOn: item.modifiedOn || new Date(),
      modifiedBy: item.modifiedBy || ''
    })
  }
  getForm(): Product {
    return {
      id: this.form.get('id').value,
      code: this.form.get('code').value,
      name: this.form.get('name').value,
      currency: this.form.get('currency').value,
      price: this.form.get('price').value,
      ratings: this.form.get('ratings').value,
      seller: this.form.get('seller').value,
      category: this.form.get('category').value,
      stockQuantity: this.form.get('stockQuantity').value
    } as Product
  }
  displayFn(options: any): (code: string) => string | null {
    return (code: string) => {
      const correspondingOption = Array.isArray(options) ? options.find(option => option.code === code) : null;
      return correspondingOption ? correspondingOption.name : ''
    }
  }

  displayAudit() {
    return this.auditPipe.transform(this.form.controls.createdOn.value, this.form.controls.createdBy?.value || '')
  }
  uploadProductImage(width, height) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.autoFocus = true;
    matDialogConfig.data = {
      path: productUploadPath,
      id: this.id
    };
    matDialogConfig.height = "80%"
    matDialogConfig.width = "80%"
    matDialogConfig.hasBackdrop = false;
    // matDialogConfig.panelClass="custom-modalbox"
    const dialogRef = this.matdialog.open(UploadProductImageComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe(() => {

    })
  }
  getuploadedimage() {
    this.firebaseStorageService.getList(productUploadPath, this.id).then((imageurls) => {
      const matBottomSheetConfig = new MatBottomSheetConfig();
      matBottomSheetConfig.autoFocus = true;
      matBottomSheetConfig.data = {
        title: this.form.controls.name.value,
        path: productUploadPath,
        id: this.id,
        imageurls
      };
      matBottomSheetConfig.hasBackdrop = false;
      matBottomSheetConfig.panelClass = 'bottom-sheet-container'
      matBottomSheetConfig.direction = 'ltr'
      // matDialogConfig.panelClass="custom-modalbox"
      const dialogRef = this.matBottomSheet.open(ProductImageGalleryComponent, matBottomSheetConfig);
      dialogRef.afterDismissed().subscribe(() => {

      })
    }).catch(error => this.toastrService.showErrorMessage(error))
  }
  onValueChanged(event: any) {
    // this.renderer.addClass(this.btn.nativeElement,'box');
    // if (event){
    //   console.log('enterAnimation');
    //    this.renderer.addClass(this.btn.nativeElement,'enterAnimation');
    //   // this.renderer.addClass(this.btn.nativeElement,'loremdiv:hover');
    // } else{
    //   console.log('leaveAnimation');
    //   this.renderer.addClass(this.btn.nativeElement,'enterAnimation');
    // }
  }
  getDefaultImage() {
    return this.sessionService.getAppSetting().defaultBlankScr;
  }
  getName() {
    return this.form.controls.name ? this.form.controls.name.value : '';
  }
  deleteImage() {
    this.inventoryService.removeFileFromStorage(this.id, this.image$).subscribe((result)=>{
      console.log(result);
    })
  }
}
