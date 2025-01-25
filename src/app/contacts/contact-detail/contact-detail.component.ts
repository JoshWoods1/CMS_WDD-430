import { Component, Input } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  contacts: Contact[] = [
  new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', 'images/jacksonk.jpg', null),
  new Contact('2', 'Rex Barzee', 'barzeer@byui.edu','208-496-3768','images/barzeer.jpg', null)]

  @Input() contact: Contact;
}
