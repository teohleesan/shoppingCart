import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { finalize, map, retryWhen, take, delay, catchError } from 'rxjs/operators';
import { Product } from '../models/product';

import { SessionService } from './session.service';
import { localstorage_cart_key, retryCount, retryInterval } from '../classes/const-variable';
import { Order } from '../models/order';
import { OrderItems } from '../models/order-items';
import * as _ from 'lodash-es';


const INCREMENT = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cart = new BehaviorSubject({});
  cart$: Observable<any> = this.cart;
  cartEvent: EventEmitter<any>;
  productCollection: AngularFirestoreCollection;
  cartCollection: AngularFirestoreCollection;
  orderCollection: AngularFirestoreCollection;
  doc: AngularFirestoreDocument;
  connectionRef: any = firebase.firestore
  cartKey = '';


  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private sessionService: SessionService,
  ) {
    this.productCollection = this.afs.collection('products');
    this.cartCollection = this.afs.collection('carts');
    this.orderCollection = this.afs.collection<Order>('orders');
    this.loadCart();
    this.cartEvent = new EventEmitter<any>();
  }
  getCarts() {
    return this.cartCollection.doc(this.cartKey).valueChanges();
  }

  getProducts() {
    return this.afs.collection('products').valueChanges({ idField: 'id' });
  }

  async loadCart() {
    const result = await localStorage.getItem(localstorage_cart_key)
    if (result !== null) {
      this.cartKey = result;
      await this.cartCollection.doc(this.cartKey).valueChanges().subscribe(async (value) => {
        if (!value) {
          await this.cartCollection.add({
            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
          }).then(async (docRef) => {
            this.cartKey = docRef.id
            await localStorage.setItem(localstorage_cart_key, this.cartKey)
            this.cart.next({});
            this.cartEvent.emit({});
          })
        } else {
          delete value.lastUpdate
          this.cart.next(value || {})
          this.cartEvent.emit(value || {});
        }
      })
    } else {
      setTimeout(async () => {
        let id = (await this.create()).id
        this.cartKey = id
        await localStorage.setItem(localstorage_cart_key, this.cartKey)
        this.cart.next({})
        this.cartEvent.emit({});
      }, 1000)
    }

  }
  create() {
    return this.afs.collection('carts').add({
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  async addToCart(id: string) {
    await this.cartCollection.doc(this.cartKey).update({
      [id]: firebase.firestore.FieldValue.increment(1)
    })
    await this.productCollection.doc(id).update({
      stockQuantity: firebase.firestore.FieldValue.increment(-1)
    })
  }
  async removeFromCart(id: string) {
    await this.cartCollection.doc(this.cartKey).update({
      [id]: firebase.firestore.FieldValue.increment(-1)
    })
    await this.productCollection.doc(id).update({
      stockQuantity: firebase.firestore.FieldValue.increment(1)
    })
  }
  async checkOut() {
    this.orderCollection.add(this.cart.value);
    this.cartCollection.doc(this.cartKey).set({
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    })
    this.cart.next({});
    this.cartEvent.emit({});
  }
  removeCart() {
    const bs = this.cart.getValue();
    Object.entries(bs).forEach(async ([key, value]) => {
      if (value > 0) {
        let v: number = value as number;
        await this.cartCollection.doc(this.cartKey).update({
          [key]: firebase.firestore.FieldValue.increment(-v)
        })
        await this.productCollection.doc(key).update({
          stockQuantity: firebase.firestore.FieldValue.increment(v)
        })
      }
    })
  }
  async checkLocalStorage() {
    console.log(this.cartKey);
    const result = await localStorage.getItem(localstorage_cart_key)
    console.log(result);
    console.log(this.cart.getValue())
  }
  async removecart() {
    await localStorage.removeItem(localstorage_cart_key)
    this.cart.next({});
    this.cartEvent.emit({});
  }


  async addToOrder(order: Order, orderItems: Array<OrderItems>) {
    const id = await this.getFirebaseId();
    await this.orderCollection.doc(id).set(order).then(() => {
      orderItems.forEach((element, index) => {
        element.orderId = id;
        this.orderCollection.doc(id).collection('orderItems').add(element).then().catch((error) => {
        })
      })
      this.clearCart();
    }).catch((error) => {
      console.log(error)
    })
  }
  getFirebaseId() {
    return this.afs.createId();
  }
  clearCart() {
    console.log('clear cart ', this.cartKey);
    this.cartCollection.doc(this.cartKey).set({
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
}
