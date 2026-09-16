import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ZonesRoutingModule } from './zones-routing.module';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneFormComponent } from './zone-form/zone-form.component';

@NgModule({
  declarations: [ ZoneListComponent, ZoneFormComponent ],
  imports: [ CommonModule, ReactiveFormsModule, ZonesRoutingModule ]
})
export class ZonesModule { }
