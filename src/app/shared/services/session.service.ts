import { Injectable } from '@angular/core';
import { User } from '../models';
import { AppSetting } from '../models/app-setting';
import { Pagination } from '../models/pagination.models';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private pagination: Pagination;
  private appSetting:AppSetting;
  private loginUser: User;

  constructor() {
    this.pagination = new Pagination();
    this.appSetting = {} as AppSetting;
    this.loginUser = {} as User;
   }
   setPagination(pagination:Pagination){
    this.pagination = pagination;
   }
   setAppSetting(appSetting:AppSetting){
    this.appSetting = appSetting;
   }
   getAppSetting():AppSetting{
    return this.appSetting;
   }
   setLoginUser(user:User){
    this.loginUser = user
   }
   getLoginUser():User{
    return this.loginUser;
   }
}
