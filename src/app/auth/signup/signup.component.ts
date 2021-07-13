import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith } from 'rxjs/operators';
import { Country } from 'src/app/shared/models';
import { OrderItems } from 'src/app/shared/models/order-items';
import { References } from 'src/app/shared/models/references';
import { Role } from 'src/app/shared/models/role';
import { UserAccount } from 'src/app/shared/models/user-account';
import { AuthService, ToastrService, UserService, FormService } from 'src/app/shared/services/index';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  title: string = '';
  signUpForm: FormGroup;
  loginForm: FormGroup;
  caller: string = '';
  cartAmount: number = 0;
  orderItems: Array<OrderItems> = [];
  countries: Country[];
  filteredCountry$: Observable<Country[]>;
  userAccount: UserAccount;
  backgroundColor: string = "primary"

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formService: FormService) {

    this.activatedRoute.data.subscribe((data) => {
      let ref = data['references'] || { country: [] } as References;
      this.countries = ref.country;
    })
  }
  ngOnInit(): void {
    this.initSignUpForm();
    this.initLoginForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.cartAmount = params['totalAmount'] || 0;
      this.orderItems = params['orderItems'] ? JSON.parse(params['orderItems']) : [];
      this.caller = params['caller'] || '';
    })
    this.filteredCountry$ = this.signUpForm.controls['country'].valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      distinctUntilChanged(),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter<Country>(name, this.countries) : this.countries.slice())
    )
  }
  private _filter<T>(name: string, options: any): any {
    const filterValue = name.toLowerCase();
    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  signup() {
    this.userService.getUserAccountByEmail(this.signUpForm.controls.emailId.value).pipe(
      finalize(() => {
        this.toastrService.showInfoMessage('validating...');
      })
    ).subscribe((user) => {
      if (user.length === 0) {
        this.toastrService.showInfoMessage('processing...');
        this.createUserAccount()
      }
    })
  }
  async createUserAccount() {
    const emailId = this.signUpForm.get('emailId').value;
    const password = this.signUpForm.get('password').value;
    const role: Role = {
      subscriber: this.caller === '' || this.caller === 'check-out' ? true : false,
      admin: this.caller === 'admin' ? true : false
    }
    let newUser: UserAccount = this.formService.getReactiveFormObject<UserAccount>(this.signUpForm);
    newUser.roles = role;
    await this.authService.createUserWithEmailAndPassword(emailId, password)
      .then(async (credential) => {
        newUser.id = credential.user.uid;
        await this.userService.create(newUser)
          .then(() => {
            this.toastrService.showSuccessMessage(newUser.emailId + ' created successfully.')
            this.onSuccess(newUser.id)
          })
          .catch((err) => {
            this.toastrService.showErrorMessage(err.code + err.message)
          })
      })
      .catch((err) => this.toastrService.showErrorMessage(err.code + err.message))
  }
  onSuccess(subscriberId: string) {
    switch (this.caller) {
      case '':
        this.router.navigate(['/']);
        break;
      case 'check-out':
        this.router.navigate(['check-out'], {
          queryParams: {
            totalAmount: this.cartAmount, orderItems: JSON.stringify(this.orderItems), subscriberId
          }
        });
        break;
      case 'admin':
        this.router.navigate(['admin/user/user-inquiry']);
        break;
    }
  }
  displayFn(options: any): (code: string) => string | null {
    return (code: string) => {
      const correspondingOption = Array.isArray(options) ? options.find(option => option.code === code) : null;
      return correspondingOption ? correspondingOption.name : '';
    }
  }
  validateSignUp() {
    return !this.signUpForm.valid && !this.signUpForm.hasError('matchValue');
  }
  matchPassword(form: FormGroup) {
    const password = form.controls.password.value;
    const confirmPassword = form.controls.confirmPassword.value;
    return password === confirmPassword ? null : { 'matchValue': false };
  }
  initSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address1: '',
      address2: '',
      country: '',
      state: '',
      zip: 0,
      phoneNumber: '',
      createdBy: [''],
      createdOn: [{ value: new Date(), disabled: true }],
    }, { validatos: this.matchPassword })
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  async signin() {
    const emailId = this.loginForm.get('emailId').value;
    const password = this.loginForm.get('password').value;
    await this.authService.signUpUserWithEmailAndPassword(emailId, password)
      .then((credential) =>{
        console.log(credential.user.uid)
        this.onSuccess(credential.user.uid)
      })
      .catch((err) => this.toastrService.showErrorMessage(err.code + err.message))
  }

  validateLogin() {
    return !this.loginForm.valid;
  }

  signInwithGoogle() {
    this.authService.googleSignIn()
      .then()
      .catch((err) => this.toastrService.showErrorMessage(err.code + err.message))
  }


}
