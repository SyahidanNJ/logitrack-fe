import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';

@NgModule({
  declarations: [
    WarehouseListComponent,
    WarehouseFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WarehousesRoutingModule
  ]
})
export class WarehousesModule { }
