import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferencesResolverService } from 'src/app/shared/services/references-resolver.service';
import { UserInquiryComponent } from './user-inquiry/user-inquiry.component';
import { UserMaintenanceComponent } from './user-maintenance/user-maintenance.component';

const routes: Routes = [
  { path: 'user-inquiry', component: UserInquiryComponent },
  {
    path: 'user-maintenance', component: UserMaintenanceComponent,
    resolve: { references: ReferencesResolverService }
  },
  { path: '', redirectTo: 'user-inquiry', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
