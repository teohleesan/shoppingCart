import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService, SessionService, FileLoadService, AuthService } from './shared/services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shoppingCart';
  spin = false;
  constructor(private router: Router,
    private auth: AuthService,
    private sessionService: SessionService,
    private toastrService: ToastrService,
    private fileLoadService: FileLoadService,
    private changeDetectorRef: ChangeDetectorRef,){
      this.toastrService.progressBarEvent.subscribe((event)=>{
        this.updateProgressSpinner(event);
      })
  }
  ngOnInit(): void {
    this.fileLoadService.loadJson('appSetting').then((item)=>{
      this.sessionService.setAppSetting(item.appSetting[0])
    })
  }
  updateProgressSpinner(event: boolean) {
    this.spin = event;
    this.changeDetectorRef.detectChanges();
  }
}
