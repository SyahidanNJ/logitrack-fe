import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckinRoutingModule } from './check-in-routing.module';
import { CheckinListComponent } from './check-in-list/check-in-list.component';
import { CheckinFormComponent } from './check-in-form/check-in-form.component';

@NgModule({
  declarations: [ CheckinListComponent, CheckinFormComponent ],
  imports: [ CommonModule, ReactiveFormsModule, CheckinRoutingModule ]
})
export class CheckinModule { }
