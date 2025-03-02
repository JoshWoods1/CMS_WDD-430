import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute)
  {

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if(params['id'] === undefined || params['id'] === null) {
          this.editMode = false;
          return;
        }

        this.originalDocument = this.documentService.getDocument(params['id']);
        if(this.originalDocument === undefined || this.originalDocument === null) {
          return;
        }

        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    );
    
  }


  onSubmit(form: NgForm) {
    let value = form.value;
    let newDocument = new Document(value.id, value.name, value.description, value.url, null);

    if(this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }

  onCancel(){
    this.router.navigate(['/documents']);
  }
}
