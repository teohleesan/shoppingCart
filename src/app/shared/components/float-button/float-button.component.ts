import { Component, OnInit } from '@angular/core';
import { ActionService } from '../../services/action.service';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.scss']
})
export class FloatButtonComponent implements OnInit {
  show = false;
  constructor(private actionService:ActionService) { }

  ngOnInit(): void {
  }

  toggleButton(){
    this.actionService.toggleCreateEvent.emit();
  }

}
