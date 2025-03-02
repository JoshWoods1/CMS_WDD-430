import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
@Component({
  selector: 'cms-contact-edit',
  standalone: false,

  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
      if (params['id'] === undefined || params['id'] === null) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(params['id']);
      if (this.originalContact === undefined || this.originalContact === null) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact.group && this.contact.group.length > 0) {
        this.groupContacts = this.contact.group.slice();
      }
    });
  }
  
  onSubmit(form: NgForm) {
    let value = form.value;
    let newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      console.log(this.contactService)
      this.contactService.addContact(newContact);
    }
    
    this.router.navigate(['/contacts']);
  }
  
  onCancel() {
    this.router.navigate(['/contacts']);
  }
}
