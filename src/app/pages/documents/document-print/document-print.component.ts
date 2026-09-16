import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../../../core/services/rest-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-document-print',
  templateUrl: './document-print.component.html',
  styleUrls: ['./document-print.component.scss'],
  standalone: false
})
export class DocumentPrintComponent implements OnInit {
  doc: any;
  loading = true;

  constructor(
    private route: ActivatedRoute, 
    private api: RestApiService,
    public location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get(`documents/${id}`).subscribe({
        next: (res) => {
          this.doc = res.data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }
}
