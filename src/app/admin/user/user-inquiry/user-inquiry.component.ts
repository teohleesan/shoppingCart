import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { UserAccount } from 'src/app/shared/models/user-account';
import { ActionService,ToastrService, UserService, SessionService } from 'src/app/shared/services/index';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { retryWhen, take, delay, catchError} from 'rxjs/operators';
import { retryCount, retryInterval } from 'src/app/shared/classes/const-variable';

@Component({
  selector: 'app-user-inquiry',
  templateUrl: './user-inquiry.component.html',
  styleUrls: ['./user-inquiry.component.scss']
})
export class UserInquiryComponent implements OnInit {
  displayedColumns: string[] = ['avatar', 'emailId', 'firstName', 'lastName', 'phoneNumber','roles', 'createdOn', 'actions'];
  dataSource: UserAccount[];
  userSub: Subscription;
  constructor(private userService: UserService,
    private actionService: ActionService ,
    private toastrService:ToastrService,
    private sessionService: SessionService,
    private router: Router) {
      this.actionService.toggleCreateEvent.subscribe(_ => {
        // create new record
      })
    }
   ngOnInit() {
    this.userSub = this.userService.inquiry().pipe(
      retryWhen((error)=>{
        return error.pipe(delay(retryInterval), take(retryCount))
      }),
      catchError((error)=>{
        return of([])
      })
    ).subscribe((data)=>{
      this.dataSource = data;
    })
  }
   edit(row: UserAccount){
      this.router.navigate(['/admin/user/user-maintenance'],{queryParams: {id: row.id}})
  }
  delete(row:UserAccount){

  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  getDefaultImage(){
    return this.sessionService.getAppSetting().defaultAvatarScr;
  }

}
