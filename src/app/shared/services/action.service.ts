import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  toggleUpdateEvent:EventEmitter<void>
  toggleCreateEvent: EventEmitter<void>
  constructor() {
    this.toggleUpdateEvent = new EventEmitter<any>();
    this.toggleCreateEvent = new EventEmitter<any>();
   }

}
