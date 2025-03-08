import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): any {
    this.http.get('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/messages.json').subscribe(
      (messages: Message[] | null) => {
        if (!messages) {
          this.messages = [];
          return;
        }
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      });
  }

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/messages.json', messages, {
      headers: headers
    }).subscribe(() => {
    this.messageChangedEvent.next(this.messages.slice());
    });
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
