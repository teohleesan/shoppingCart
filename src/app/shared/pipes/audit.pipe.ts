import { Pipe, PipeTransform } from '@angular/core';
import {FirestoreTimestampPipe} from './firestore-timestamp.pipe'

@Pipe({
  name: 'audit'
})
export class AuditPipe implements PipeTransform {
  constructor(private firestoreTimestampPipe: FirestoreTimestampPipe){}
  transform(timeStamp: any, altered :any): string {
    if (timeStamp && altered){
      return this.firestoreTimestampPipe.transform(timeStamp) + ' / ' + altered
    }else if(altered){
      return altered
    }else if(timeStamp){
      return this.firestoreTimestampPipe.transform(timeStamp)
    }
    return null;
  }

}
