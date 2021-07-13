import { NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import {MaterialModule} from './modules/material.module';
import {CommonUseModule} from './modules/common-use.module';
import {RouterModule} from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { PageNoFoundComponent } from './components/page-no-found/page-no-found.component';
import { MainLayoutComponent } from './theme/main-layout/main-layout.component';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';

import {AdminGuard} from '../shared/classes/admin-guard';
import { CarouselComponent } from './theme/carousel/carousel.component';
import { SidebarComponent } from './theme/sidebar/sidebar.component';
import { SidemenuComponent } from './theme/sidemenu/sidemenu.component';
import { FloatButtonComponent } from './components/float-button/float-button.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { FirestoreTimestampPipe } from './pipes/firestore-timestamp.pipe';
import { AuditDirective } from './directives/audit.directive';
import { AuditPipe } from './pipes/audit.pipe';
import { ReferencesResolverService } from './services/references-resolver.service';
import { DropzoneDirective } from './directives/dropzone.directive';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { MatIconDirective } from './directives/mat-icon.directive';
import { MatGridListResponsiveDirective } from './directives/mat-grid-list-responsive.directive';
import { SumPipe } from './pipes/sum.pipe';
import { MatElevationDirective } from './directives/mat-elevation.directive';


const THIRD_MODULES = [
  CommonModule,
  CommonUseModule,
  MaterialModule,
  RouterModule
]
const COMPONENTS = [
  MainLayoutComponent,
  AdminLayoutComponent,
  NavComponent,
  AccessDeniedComponent,
  PageNoFoundComponent,
  CarouselComponent,
  SidebarComponent,
  SidemenuComponent,
  FloatButtonComponent,
  ProgressSpinnerComponent,
  UploaderComponent,
  UploadTaskComponent
]
const COMPONENTS_DYNAMIC = [
  ConfirmationDialogComponent
]
const PROVIDERS = [AdminGuard, AuditPipe,FirestoreTimestampPipe, ReferencesResolverService]

const DIRECTIVES = [AuditDirective,DropzoneDirective, MatIconDirective,MatGridListResponsiveDirective, MatElevationDirective]
const PIPES = [FirestoreTimestampPipe, AuditPipe, SumPipe]

@NgModule({
  imports: [THIRD_MODULES],
  exports: [THIRD_MODULES, COMPONENTS, DIRECTIVES, PIPES],
  declarations: [COMPONENTS, COMPONENTS_DYNAMIC, DIRECTIVES, PIPES],
  entryComponents: [COMPONENTS_DYNAMIC],
  providers: [PROVIDERS]
})
export class SharedModule { }
