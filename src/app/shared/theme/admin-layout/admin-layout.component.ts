import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { FileLoadService } from '../../services/file-load.service';
import { MenuService } from '../../services/menu.service';
import { NavService } from '../../services/nav.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild('snav') snav:ElementRef;
  mobileQuery: MediaQueryList;
  shouldRun: boolean = true;
  constructor(media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private fileLoadService: FileLoadService,
    private menuService: MenuService,
    private navService: NavService,
    private authService: AuthService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  private _mobileQueryListener: () => void;
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    let menuPromise = this.fileLoadService.loadJson('menu');
    Promise.all([menuPromise]).then((item)=>{
      item.forEach((i)=>{
        const arr = Array.of(i)
        this.menuService.setMenu(arr[0].menu);
      })
    })
    .catch()
  }
  ngAfterViewInit() {
    this.navService.snav = this.snav;
  }
  home(){
    this.router.navigate(['/']);
  }
  signout(){
    this.authService.signOut()
  }

}
