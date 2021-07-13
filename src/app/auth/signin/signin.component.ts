import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/shared/models';
import { AuthService, ToastrService, ItemsService } from 'src/app/shared/services/index';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private itemsService: ItemsService) {
  }
  ngOnInit(): void {
    this.initLoginForm();

  }
  initLoginForm(){
    this.loginForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  async signin(){
    const emailId = this.loginForm.get('emailId').value;
    const password = this.loginForm.get('password').value;
    await this.authService.signUpUserWithEmailAndPassword(emailId, password)
    .then(()=> this.router.navigate(['/']))
    .catch((err)=> this.toastrService.showErrorMessage(err.code + err.message))
  }

  validateLogin(){
    return !this.loginForm.valid;
  }

  signInwithGoogle(){
    this.authService.googleSignIn()
    .then()
    .catch((err)=> this.toastrService.showErrorMessage(err.code + err.message))
  }
  updateCredential(){}

}
