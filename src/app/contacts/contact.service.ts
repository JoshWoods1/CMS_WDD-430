import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
   }

   getContacts(): any {
    this.http.get('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/contacts.json')
    .subscribe(
      (contacts: Contact[] | null) => {
        if (!contacts) {
          this.contacts = [];
          return;
        }
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );
   }

   storeContacts() {
    let contacts = JSON.stringify(this.contacts);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/contacts.json', contacts, {
      headers: headers
    })
    .subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
   }

   getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
   }

   deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    let contactsListClone = this.contacts.slice();
    this.storeContacts();
   }

   getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
       let currentId = parseInt(contact.id);
       if (currentId > maxId) {
          maxId = currentId;
       }
    }
    return maxId;
 }

  addContact(newContact: Contact) {
   if (!newContact) {
     return;
   }
   this.maxContactId++;
   newContact.id = String(this.maxContactId);
   this.contacts.push(newContact);
   let contactsListClone = this.contacts.slice();
   this.storeContacts();
  }
 
  updateContact(originalContact: Contact, newContact: Contact) {
   if (!originalContact || !newContact) {
     return;
   }
   let pos = this.contacts.indexOf(originalContact);
   if (pos < 0) {
     return;
   }
   newContact.id = originalContact.id;
   this.contacts[pos] = newContact;
   let contactsListClone = this.contacts.slice();
   this.storeContacts();
  }
}