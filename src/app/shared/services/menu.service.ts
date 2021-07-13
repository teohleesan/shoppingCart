import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu: Menu[]
  private menuSubject = new BehaviorSubject<Menu[]>([]);
  getMenu$: Observable<Menu[]>;
  constructor() {
    this.getMenu$ = this.menuSubject.asObservable();
  }
  setMenu(menu: Menu[]){
    this.menuSubject.next(menu);
  }
  getMenu():Observable<Menu[]>{
    return this.getMenu$;
  }
  reset() {
    this.menuSubject.next([]);
  }

}
