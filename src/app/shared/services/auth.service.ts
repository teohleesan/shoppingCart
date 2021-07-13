import { EventEmitter, Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ToastrService } from './toastr.service';
import { User } from '../models/user';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserAccount } from '../models/user-account';
import { SessionService } from './session.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private firebaseUser: Observable<firebase.User | null>;

  userSubject = new BehaviorSubject<User>(null);
  user$: Observable<User>;
  private sub: Subscription;

  constructor(private auth: AngularFireAuth,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
  ) {
    // this.firebaseUser = this.auth.authState;
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.sub = this.userService.getUserAccountByEmail(user.email ?? '').subscribe((data) => {
          data.forEach((a) => {
            let x: User = { id: a.id, emailId: a.emailId, roles: { admin: a.roles?.admin, subscriber: a.roles?.subscriber } }
            this.userSubject.next(x);
            this.sessionService.setLoginUser(x);
            this.sub.unsubscribe();
          })
        }, (error: any) => {
          this.userSubject.next(null);
          this.sessionService.setLoginUser(null);
        })

      }
      else {
        // no auth user
        this.userSubject.next(null)
        this.sessionService.setLoginUser(null);
      }
    })
  }

  signOut() {
    this.auth.signOut().then(_ => {
      this.userSubject.next(null);
      this.sessionService.setLoginUser(null);
      this.router.navigate(['/']);
    });
  }
  createUserWithEmailAndPassword(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
  signUpUserWithEmailAndPassword(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  googleSignIn() {
    return this.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }
  getauth(){
    this.auth.authState.subscribe((user)=>{
      console.log('firebase User auth',user)
    })
  }


}
