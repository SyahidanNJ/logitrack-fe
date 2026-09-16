import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutListComponent } from './check-out-list/check-out-list.component';
import { CheckoutFormComponent } from './check-out-form/check-out-form.component';

const routes: Routes = [
  { path: '', component: CheckoutListComponent },
  { path: 'add', component: CheckoutFormComponent }
];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class CheckoutRoutingModule { }
