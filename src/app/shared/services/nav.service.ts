import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  snav: any
  currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event)=>{
      if (event instanceof NavigationEnd){
        this.currentUrl.next(event.urlAfterRedirects)
      }
    })
  }
  closeNav() {
    this.snav.close();
  }

  openNav() {
    this.snav.open();
  }
}
