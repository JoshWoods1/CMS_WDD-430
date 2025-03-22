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
    this.http.get<{ message: string; contacts: Contact[] }>('http://localhost:3000/contacts')
      .subscribe(
        (response) => {
          console.log("Full API Response for Contacts:", response); // Debugging output
  
          if (!response || !Array.isArray(response.contacts)) {
            console.error("Invalid API response format for contacts:", response);
            this.contacts = [];
            return;
          }
  
          this.contacts = response.contacts;
          this.maxContactId = this.getMaxId();
  
          // Sorting in ascending order (A-Z or other relevant criteria)
          this.contacts.sort((a, b) => (a.name < b.name ? -1 : 1));
  
          // Emit updated contact list
          this.contactListChangedEvent.next([...this.contacts]);
        },
        (error) => {
          console.error('Error fetching contacts:', error);
          this.contacts = []; // Prevents null reference issues
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
  
    const pos = this.contacts.findIndex(c => c.id === contact.id);
  
    if (pos < 0) {
      return;
    }
  
    // Delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          // Remove the contact from the local array
          this.contacts.splice(pos, 1);
          this.sortAndSend(); // You can modify this function to handle sorting and emitting updated data
        }
      );
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

 addContact(contact: Contact) {
  if (!contact) {
    return;
  }

  // Make sure the ID of the new contact is empty (or reset it to a default value)
  contact.id = '';

  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Add the contact to the database
  this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
    contact,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // Add the new contact to the contacts array
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      }
    );
}


private sortAndSend() {
  this.contacts.sort((a, b) => a.name.localeCompare(b.name)); // Sort documents alphabetically
  this.contactListChangedEvent.next(this.contacts.slice()); // Emit the updated list
}
 
updateContact(originalContact: Contact, newContact: Contact) {
  if (!originalContact || !newContact) {
    return;
  }

  const pos = this.contacts.findIndex(c => c.id === originalContact.id);

  if (pos < 0) {
    return;
  }

  // Ensure the ID of the new contact is the same as the original
  newContact.id = originalContact.id;

  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // Update the contact in the database
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
    .subscribe(
      (response: Response) => {
        // Update the contact in the local array
        this.contacts[pos] = newContact;
        this.sortAndSend(); // You can modify this function to handle sorting and emitting updated data
      }
    );
}

}