import { Component } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
@Component({
  selector: 'cms-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages = [];

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
    this.messages = this.messageService.getMessages();
    this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    )
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

  getMessages() {
    this.messageService.getMessages().subscribe(
      (response) => {
        console.log("Full API Response for Messages:", response);

        if (!response || !Array.isArray(response.messages)) {
          console.error('Invalid API response format:', response);
          return;
        }

        // Store the messages and handle any additional logic
        this.messages = response.messages;
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }
}
