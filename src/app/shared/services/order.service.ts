import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs';
import { map, switchMap, switchMapTo } from 'rxjs/operators';
import { Order } from '../models';
import { OrderItems } from '../models/order-items';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderCollection: AngularFirestoreCollection;
  doc: AngularFirestoreDocument

  constructor(private afs: AngularFirestore) {
    this.orderCollection = this.afs.collection('orders');
  }

  inquiry() {
    return this.orderCollection.valueChanges({ idField: 'id' });
  }
  get(id: string) {
    // return this.afs.collection('orders')
    //   .doc(id)
    //   .collection('orderItems')
    //   .get()

    const orderRef = this.afs.collection('orders').doc(id).valueChanges({ idField: 'id' });

    const orderItemRef = this.afs.collection('orders').doc(id).collection('orderItems').get();

    return orderRef.pipe(
      switchMap(order => orderItemRef.pipe(
        map(items => Object.assign({ order: order, orderItems: items }))
      )
      ))
  }
  inquiryAll() {
    return this.afs.collection('orders').valueChanges({ idField: 'id' }).pipe(
      switchMap((orders: any[]) => {
        const res = orders.map((r: any) => {
          return this.afs.collection('orders').doc(r.id).collection('orderItems').valueChanges({ idField: 'id' }).pipe(
            map(orderItems => Object.assign(orders.filter(option => option.id.indexOf(r.id) === 0), { orderItems }))
          )
        })
        return combineLatest(res);
      })
    )
  }

}
