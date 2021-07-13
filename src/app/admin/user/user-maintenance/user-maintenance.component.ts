import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { UserAccount } from 'src/app/shared/models/user-account';
import { ActionService, ToastrService, UserService, ItemsService, SessionService, FormService, FileService } from 'src/app/shared/services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/shared/models/role';
import { Country } from 'src/app/shared/models/country';
import { debounceTime, map, retryWhen, startWith, take, delay, catchError} from 'rxjs/operators';
import { AuditPipe } from '../../../shared/pipes/audit.pipe'
import { References } from 'src/app/shared/models/references';
import { retryCount, retryInterval, userUploadPath } from 'src/app/shared/classes/const-variable';
import { Location } from '@angular/common';


@Component({
  selector: 'app-user-maintenance',
  templateUrl: './user-maintenance.component.html',
  styleUrls: ['./user-maintenance.component.scss']
})
export class UserMaintenanceComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef;
  files: Array<any> = [];
  private routesub: Subscription;
  form: FormGroup;
  image$: any;
  id: string ='';
  countrys: Country[];
  filteredCountry$: Observable<Country[]>;

  constructor(private userService: UserService,
    private actionService: ActionService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private fileService: FileService,
    private itemsService: ItemsService,
    private formService: FormService,
    private auditPipe: AuditPipe,
    private location: Location) {
    this.image$ = this.sessionService.getAppSetting().defaultAvatarScr;
    this.initForm();
    this.activatedRoute.data.subscribe((data)=>{
      const ref = data['references'] || { country:[], category: [], currency: [] } as References;
      this.countrys = ref.country;
    });
  }

  ngOnInit() {
    this.routesub = this.activatedRoute.queryParams.subscribe((param) => {
      this.id = param['id'] || '';
      if (this.id.length > 0) {
        this.get(this.id);
      }
    })
    this.filteredCountry$ = this.form.controls['country'].valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filterCountry(name) : this.countrys.slice())
    )
  }
  ngAfterViewInit() {

  }
  private _filterCountry(name: string): Country[] {
    const filterValue = name.toLowerCase();
    return this.countrys.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  initForm() {
    this.form = this.fb.group({
      id: [''],
      emailId: [{ value: '', disabled: true }, [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      country: [''],
      state: [''],
      zip: [''],
      phoneNumber: [''],
      createdBy: [''],
      createdOn: [{ value: new Date(), disabled: true }],
      subscriber: [false],
      admin: [false]
    })
  }
  async get(id) {
    let user = await this.userService.get(id).pipe(
      retryWhen((error)=>{
        return error.pipe(delay(retryInterval), take(retryCount))
      }),
      catchError((error)=>{
        return of({} as UserAccount)
      })
    ).subscribe((user) => {
      this.setForm(user);
      if (user?.url){
        this.image$ = user.url
      }
    })
  }
  setForm(data: UserAccount) {

    this.form = this.formService.setObjectToReactiveForm(this.form, data);
    this.form.patchValue({
      subscriber: data.roles.subscriber,
      admin: data.roles.admin
    })
  }
  getForm() {
    let role: Role = {
      subscriber: this.form.controls.subscriber.value,
      admin: this.form.controls.admin.value
    }
    let user: UserAccount = this.formService.getReactiveFormObject(this.form);
    user.roles = role;
    return user;
  }
  createdOn() {
    return this.form.controls.createdOn.value;
  }
  createdBy() {
    return this.form.controls.createdBy?.value || '';
  }
  getFile() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index]
        this.files.push(file);
        this.onChange(file)
        // this.image$ = this.fileService.previewImage(file);

        console.log(this.image$)

      }
    }
    fileUpload.click();
  }

  onChange(file: any) {
    let reader = new FileReader();
    reader.onload = (e: any) => {
        this.image$ = reader.result;
    }
    reader.readAsDataURL(file);
}


  displayFn(options: Country[]): (code: string) => string | null {
    return (code: string) => {
      const correspondingOption = Array.isArray(options) ? options.find(option => option.code === code) : null;
      return correspondingOption ? correspondingOption.name : '';
    }
  }
  displayAudit() {
    return this.auditPipe.transform(this.createdOn(), this.createdBy())
  }
  update() {
    let user: UserAccount = this.getForm();
    user.id = this.id;
    this.userService.update(user).then(async _ => {
      if (this.files.length > 0) {
        const upload = await this.userService.pushFileToStorage(userUploadPath, user.id, this.files[0])
      }
      this.toastrService.showSuccessMessage('record updated successfully.')
    }).catch((error) => {
      this.toastrService.showErrorMessage(error.message)
    })
  }
  removeImage(){
    this.userService.removeFileFromStorage(this.id,this.image$).subscribe((result)=>{
      console.log(result);
      this.image$ = this.getDefaultImage();
      this.files =[]
    })
  }
  getDefaultImage(){
    return this.sessionService.getAppSetting().defaultAvatarScr;
  }
  goBack(){
    this.location.back();

  }

}
