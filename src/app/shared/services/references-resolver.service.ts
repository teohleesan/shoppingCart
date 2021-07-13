import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { from, Observable } from 'rxjs';
import { References } from '../models/references';
import { FileLoadService } from './file-load.service'


@Injectable({
  providedIn: 'root'
})
export class ReferencesResolverService implements Resolve<References> {
  references: Observable<References>;
  constructor(private fileLoadService: FileLoadService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<References> {
    const countryPromise = this.fileLoadService.loadJson('country');
    const categoryPromise = this.fileLoadService.loadJson('category');
    const currencyPromise = this.fileLoadService.loadJson('currency');
    const sellerPromise = this.fileLoadService.loadJson('seller');
    const promises = [countryPromise, categoryPromise, currencyPromise, sellerPromise]
    let promiseall = Promise.all(promises).then((items) => {
      return {
        country: items[0].country,
        category: items[1].category,
        currency: items[2].currency,
        seller: items[3].seller
      } as References
    })
      .catch()
    return from(promiseall)
  }
}
