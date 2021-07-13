import firebase from 'firebase/app'
import Timestamp = firebase.firestore.Timestamp;

export interface Product {
  id?: string;
  code: string;
  name: string;
  currency: string;
  price: number;
  ratings?: number;
  seller?: string;
  category?:string;
  stockQuantity?: number;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
  url?:string;
}
