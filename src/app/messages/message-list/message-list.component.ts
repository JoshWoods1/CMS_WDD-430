import { Component } from '@angular/core';
import { Message } from '../message.model';
@Component({
  selector: 'cms-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages = [
    new Message('1', 'Hello from Josh', 'Hello there, this is a test.', 'Josh Woods'),
    new Message('2', 'Hello from Bob', 'Hello there, this is Bob\'s test.', 'Bob'),
    new Message('3', 'Hello from Meacy', 'Hello there, this is Meacy\'s test.', 'Meacy Woods'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
