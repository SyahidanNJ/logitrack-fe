import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutRoutingModule } from './check-out-routing.module';
import { CheckoutListComponent } from './check-out-list/check-out-list.component';
import { CheckoutFormComponent } from './check-out-form/check-out-form.component';

@NgModule({
  declarations: [ CheckoutListComponent, CheckoutFormComponent ],
  imports: [ CommonModule, ReactiveFormsModule, CheckoutRoutingModule ]
})
export class CheckoutModule { }
