import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  @Input() ripple = false;
  constructor( private menuService: MenuService) { }

  menus = this.menuService.getMenu();
  ngOnInit(): void {

  }

}
