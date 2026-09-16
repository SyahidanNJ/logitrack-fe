import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentPrintComponent } from './document-print/document-print.component';


@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentFormComponent,
    DocumentPrintComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DocumentsRoutingModule
  ]
})
export class DocumentsModule { }
