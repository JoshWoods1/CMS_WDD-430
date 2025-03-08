import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient,) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
    
  }


getDocuments(): any{
  this.http
    .get<Document[]>('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/documents.json')
    .subscribe(
      (documents: Document[] | null) => {
        if (!documents) {
          this.documents = [];
          return;
        }

        this.documents = documents;
        this.maxDocumentId = this.getMaxId();

        // Sorting in ascending order (A-Z)
        this.documents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

        // Emit updated document list
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
      }
    );
}

  storeDocuments() {
    let documents = JSON.stringify(this.documents);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http
      .put('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/documents.json', documents, {
        headers: headers
      })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }



  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice();
    this.storeDocuments();
 }

 getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
       let currentId = parseInt(document.id);
       if (currentId > maxId) {
          maxId = currentId;
       }
    }
    return maxId;
 }

 addDocument(newDocument: Document) {
  if (!newDocument) {
    return;
  }
  this.maxDocumentId++;
  newDocument.id = String(this.maxDocumentId);
  this.documents.push(newDocument);
  let documentsListClone = this.documents.slice();
  this.storeDocuments();
 }

 updateDocument(originalDocument: Document, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }
  let pos = this.documents.indexOf(originalDocument);
  if (pos < 0) {
    return;
  }
  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
  let documentsListClone = this.documents.slice();
  this.storeDocuments();
 }
}