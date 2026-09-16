import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinListComponent } from './check-in-list/check-in-list.component';
import { CheckinFormComponent } from './check-in-form/check-in-form.component';

const routes: Routes = [
  { path: '', component: CheckinListComponent },
  { path: 'add', component: CheckinFormComponent }
];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class CheckinRoutingModule { }
