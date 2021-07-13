import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ReferencesResolverService } from '../shared/services/references-resolver.service';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
const authRoutes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent, resolve: {references: ReferencesResolverService}},
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
