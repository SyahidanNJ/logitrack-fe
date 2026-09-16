import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentPrintComponent } from './document-print/document-print.component';

const routes: Routes = [
  { path: '', component: DocumentListComponent },
  { path: 'print/:id', component: DocumentPrintComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
